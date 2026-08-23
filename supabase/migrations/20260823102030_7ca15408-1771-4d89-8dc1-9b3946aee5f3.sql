-- Monthly leaderboard (role-filterable), public-safe: no emails exposed
CREATE OR REPLACE FUNCTION public.monthly_leaderboard(_month date DEFAULT date_trunc('month', now())::date, _role text DEFAULT NULL, _limit int DEFAULT 50)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar_url text,
  role text,
  points integer,
  events integer,
  total_points integer,
  level integer,
  level_name text,
  badge_count integer,
  rank integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH month_events AS (
    SELECT pe.user_id,
           SUM(pe.points)::int AS points,
           COUNT(*)::int AS events
    FROM public.point_events pe
    WHERE pe.awarded_at >= date_trunc('month', _month::timestamptz)
      AND pe.awarded_at < date_trunc('month', _month::timestamptz) + interval '1 month'
    GROUP BY pe.user_id
  ),
  roles AS (
    SELECT DISTINCT ON (ur.user_id) ur.user_id, ur.role::text AS role
    FROM public.user_roles ur
    ORDER BY ur.user_id, ur.created_at
  )
  SELECT me.user_id,
         COALESCE(NULLIF(p.full_name, ''), 'Member') AS display_name,
         p.avatar_url,
         COALESCE(r.role, 'member') AS role,
         me.points,
         me.events,
         COALESCE(up.total_points, 0) AS total_points,
         COALESCE(up.level, 1) AS level,
         COALESCE(up.level_name, 'Explorer') AS level_name,
         COALESCE((SELECT COUNT(*) FROM public.user_badges ub WHERE ub.user_id = me.user_id), 0)::int AS badge_count,
         RANK() OVER (ORDER BY me.points DESC, me.events DESC)::int AS rank
  FROM month_events me
  LEFT JOIN public.profiles p ON p.user_id = me.user_id
  LEFT JOIN public.user_points up ON up.user_id = me.user_id
  LEFT JOIN roles r ON r.user_id = me.user_id
  WHERE _role IS NULL OR COALESCE(r.role, 'member') = _role
  ORDER BY me.points DESC, me.events DESC
  LIMIT GREATEST(1, LEAST(_limit, 200));
$$;

GRANT EXECUTE ON FUNCTION public.monthly_leaderboard(date, text, int) TO anon, authenticated;

-- Public profile gamification snapshot (no email / phone)
CREATE OR REPLACE FUNCTION public.public_gamification(_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar_url text,
  bio text,
  city text,
  role text,
  total_points integer,
  level integer,
  level_name text,
  badges jsonb,
  joined_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id,
         COALESCE(NULLIF(p.full_name, ''), 'Member'),
         p.avatar_url,
         p.bio,
         p.city,
         COALESCE((SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = p.user_id ORDER BY ur.created_at LIMIT 1), 'member'),
         COALESCE(up.total_points, 0),
         COALESCE(up.level, 1),
         COALESCE(up.level_name, 'Explorer'),
         COALESCE((
           SELECT jsonb_agg(jsonb_build_object('key', b.key, 'name', b.name, 'description', b.description, 'icon', b.icon, 'awarded_at', ub.awarded_at) ORDER BY ub.awarded_at)
           FROM public.user_badges ub JOIN public.badges b ON b.key = ub.badge_key
           WHERE ub.user_id = p.user_id
         ), '[]'::jsonb),
         p.created_at
  FROM public.profiles p
  LEFT JOIN public.user_points up ON up.user_id = p.user_id
  WHERE p.user_id = _user_id AND p.is_active = true;
$$;

GRANT EXECUTE ON FUNCTION public.public_gamification(uuid) TO anon, authenticated;

-- Admin: manual point adjustment (positive or negative)
CREATE OR REPLACE FUNCTION public.admin_adjust_points(_user_id uuid, _points integer, _reason text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can adjust points';
  END IF;
  IF _points = 0 THEN
    RAISE EXCEPTION 'Adjustment must be non-zero';
  END IF;

  INSERT INTO public.point_events (user_id, role, event_key, points, source_table, source_id)
  VALUES (
    _user_id,
    (SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = _user_id ORDER BY ur.created_at LIMIT 1),
    'admin_adjustment',
    _points,
    'admin',
    COALESCE(NULLIF(_reason, ''), 'manual') || ':' || gen_random_uuid()::text
  )
  RETURNING id INTO new_id;

  PERFORM public.recalc_user_points(_user_id);
  PERFORM public.evaluate_badges(_user_id);
  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_adjust_points(uuid, integer, text) TO authenticated;

-- Admin: void (delete) a point event
CREATE OR REPLACE FUNCTION public.admin_void_point_event(_event_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can void points';
  END IF;

  SELECT user_id INTO target FROM public.point_events WHERE id = _event_id;
  IF target IS NULL THEN
    RAISE EXCEPTION 'Point event not found';
  END IF;

  DELETE FROM public.point_events WHERE id = _event_id;
  PERFORM public.recalc_user_points(target);
  RETURN target;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_void_point_event(uuid) TO authenticated;

-- Admin: search members with their points for the points editor
CREATE OR REPLACE FUNCTION public.admin_points_directory(_search text DEFAULT NULL, _limit int DEFAULT 50)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  email text,
  role text,
  total_points integer,
  level integer,
  level_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id,
         p.full_name,
         p.email,
         COALESCE((SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = p.user_id ORDER BY ur.created_at LIMIT 1), 'member'),
         COALESCE(up.total_points, 0),
         COALESCE(up.level, 1),
         COALESCE(up.level_name, 'Explorer')
  FROM public.profiles p
  LEFT JOIN public.user_points up ON up.user_id = p.user_id
  WHERE public.has_role(auth.uid(), 'admin')
    AND (_search IS NULL OR _search = '' OR p.full_name ILIKE '%' || _search || '%' OR p.email ILIKE '%' || _search || '%')
  ORDER BY COALESCE(up.total_points, 0) DESC
  LIMIT GREATEST(1, LEAST(_limit, 200));
$$;

GRANT EXECUTE ON FUNCTION public.admin_points_directory(text, int) TO authenticated;
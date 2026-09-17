CREATE OR REPLACE FUNCTION private.admin_adjust_points(_user_id uuid, _points integer, _reason text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private AS $$
DECLARE new_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Only admins can adjust points'; END IF;
  IF _points = 0 THEN RAISE EXCEPTION 'Adjustment must be non-zero'; END IF;
  INSERT INTO public.point_events (user_id, role, event_key, points, source_table, source_id)
  VALUES (_user_id, (SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = _user_id ORDER BY ur.created_at LIMIT 1), 'admin_adjustment', _points, 'admin', COALESCE(NULLIF(_reason, ''), 'manual') || ':' || gen_random_uuid()::text)
  RETURNING id INTO new_id;
  PERFORM public.recalc_user_points(_user_id);
  PERFORM public.evaluate_badges(_user_id);
  RETURN new_id;
END; $$;

CREATE OR REPLACE FUNCTION private.admin_points_directory(_search text DEFAULT NULL, _limit integer DEFAULT 50)
RETURNS TABLE(user_id uuid, full_name text, email text, role text, total_points integer, level integer, level_name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, private AS $$
  SELECT p.user_id, p.full_name, p.email,
    COALESCE((SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = p.user_id ORDER BY ur.created_at LIMIT 1), 'member'),
    COALESCE(up.total_points, 0), COALESCE(up.level, 1), COALESCE(up.level_name, 'Explorer')
  FROM public.profiles p LEFT JOIN public.user_points up ON up.user_id = p.user_id
  WHERE public.has_role(auth.uid(), 'admin')
    AND (_search IS NULL OR _search = '' OR p.full_name ILIKE '%' || _search || '%' OR p.email ILIKE '%' || _search || '%')
  ORDER BY COALESCE(up.total_points, 0) DESC LIMIT GREATEST(1, LEAST(_limit, 200));
$$;

CREATE OR REPLACE FUNCTION private.admin_void_point_event(_event_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private AS $$
DECLARE target uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Only admins can void points'; END IF;
  SELECT user_id INTO target FROM public.point_events WHERE id = _event_id;
  IF target IS NULL THEN RAISE EXCEPTION 'Point event not found'; END IF;
  DELETE FROM public.point_events WHERE id = _event_id;
  PERFORM public.recalc_user_points(target);
  RETURN target;
END; $$;

CREATE OR REPLACE FUNCTION private.increment_usage_counter(_counter_key text, _delta integer DEFAULT 1)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private AS $$
DECLARE _uid uuid := auth.uid(); _new integer;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _delta IS NULL OR _delta < 1 OR _delta > 10 THEN _delta := 1; END IF;
  INSERT INTO public.usage_counters (user_id, counter_key, period_start, count)
  VALUES (_uid, _counter_key, date_trunc('month', now())::date, _delta)
  ON CONFLICT (user_id, counter_key, period_start)
  DO UPDATE SET count = public.usage_counters.count + _delta, updated_at = now()
  RETURNING count INTO _new;
  RETURN _new;
END; $$;

CREATE OR REPLACE FUNCTION private.monthly_leaderboard(_month date DEFAULT date_trunc('month', now())::date, _role text DEFAULT NULL, _limit integer DEFAULT 50)
RETURNS TABLE(user_id uuid, display_name text, avatar_url text, role text, points integer, events integer, total_points integer, level integer, level_name text, badge_count integer, rank integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, private AS $$
  WITH month_events AS (
    SELECT pe.user_id, SUM(pe.points)::int AS points, COUNT(*)::int AS events
    FROM public.point_events pe
    WHERE pe.awarded_at >= date_trunc('month', _month::timestamptz)
      AND pe.awarded_at < date_trunc('month', _month::timestamptz) + interval '1 month'
    GROUP BY pe.user_id
  ), roles AS (
    SELECT DISTINCT ON (ur.user_id) ur.user_id, ur.role::text AS role
    FROM public.user_roles ur ORDER BY ur.user_id, ur.created_at
  )
  SELECT me.user_id, COALESCE(NULLIF(p.full_name, ''), 'Member'), p.avatar_url, COALESCE(r.role, 'member'), me.points, me.events,
    COALESCE(up.total_points, 0), COALESCE(up.level, 1), COALESCE(up.level_name, 'Explorer'),
    COALESCE((SELECT COUNT(*) FROM public.user_badges ub WHERE ub.user_id = me.user_id), 0)::int,
    RANK() OVER (ORDER BY me.points DESC, me.events DESC)::int
  FROM month_events me
  LEFT JOIN public.profiles p ON p.user_id = me.user_id
  LEFT JOIN public.user_points up ON up.user_id = me.user_id
  LEFT JOIN roles r ON r.user_id = me.user_id
  WHERE _role IS NULL OR COALESCE(r.role, 'member') = _role
  ORDER BY me.points DESC, me.events DESC LIMIT GREATEST(1, LEAST(_limit, 200));
$$;

CREATE OR REPLACE FUNCTION private.public_gamification(_user_id uuid)
RETURNS TABLE(user_id uuid, display_name text, avatar_url text, bio text, city text, role text, total_points integer, level integer, level_name text, badges jsonb, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, private AS $$
  SELECT p.user_id, COALESCE(NULLIF(p.full_name, ''), 'Member'), p.avatar_url, p.bio, p.city,
    COALESCE((SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = p.user_id ORDER BY ur.created_at LIMIT 1), 'member'),
    COALESCE(up.total_points, 0), COALESCE(up.level, 1), COALESCE(up.level_name, 'Explorer'),
    COALESCE((SELECT jsonb_agg(jsonb_build_object('key', b.key, 'name', b.name, 'description', b.description, 'icon', b.icon, 'awarded_at', ub.awarded_at) ORDER BY ub.awarded_at)
      FROM public.user_badges ub JOIN public.badges b ON b.key = ub.badge_key WHERE ub.user_id = p.user_id), '[]'::jsonb), p.created_at
  FROM public.profiles p LEFT JOIN public.user_points up ON up.user_id = p.user_id
  WHERE p.user_id = _user_id AND p.is_active = true;
$$;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.admin_adjust_points(uuid, integer, text), private.admin_points_directory(text, integer), private.admin_void_point_event(uuid), private.increment_usage_counter(text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.monthly_leaderboard(date, text, integer), private.public_gamification(uuid) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.admin_adjust_points(_user_id uuid, _points integer, _reason text) RETURNS uuid LANGUAGE sql SECURITY INVOKER SET search_path = public, private AS $$ SELECT private.admin_adjust_points(_user_id, _points, _reason) $$;
CREATE OR REPLACE FUNCTION public.admin_points_directory(_search text DEFAULT NULL, _limit integer DEFAULT 50) RETURNS TABLE(user_id uuid, full_name text, email text, role text, total_points integer, level integer, level_name text) LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public, private AS $$ SELECT * FROM private.admin_points_directory(_search, _limit) $$;
CREATE OR REPLACE FUNCTION public.admin_void_point_event(_event_id uuid) RETURNS uuid LANGUAGE sql SECURITY INVOKER SET search_path = public, private AS $$ SELECT private.admin_void_point_event(_event_id) $$;
CREATE OR REPLACE FUNCTION public.increment_usage_counter(_counter_key text, _delta integer DEFAULT 1) RETURNS integer LANGUAGE sql SECURITY INVOKER SET search_path = public, private AS $$ SELECT private.increment_usage_counter(_counter_key, _delta) $$;
CREATE OR REPLACE FUNCTION public.monthly_leaderboard(_month date DEFAULT date_trunc('month', now())::date, _role text DEFAULT NULL, _limit integer DEFAULT 50) RETURNS TABLE(user_id uuid, display_name text, avatar_url text, role text, points integer, events integer, total_points integer, level integer, level_name text, badge_count integer, rank integer) LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public, private AS $$ SELECT * FROM private.monthly_leaderboard(_month, _role, _limit) $$;
CREATE OR REPLACE FUNCTION public.public_gamification(_user_id uuid) RETURNS TABLE(user_id uuid, display_name text, avatar_url text, bio text, city text, role text, total_points integer, level integer, level_name text, badges jsonb, joined_at timestamptz) LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public, private AS $$ SELECT * FROM private.public_gamification(_user_id) $$;

REVOKE ALL ON FUNCTION public.admin_adjust_points(uuid, integer, text), public.admin_points_directory(text, integer), public.admin_void_point_event(uuid), public.increment_usage_counter(text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_adjust_points(uuid, integer, text), public.admin_points_directory(text, integer), public.admin_void_point_event(uuid), public.increment_usage_counter(text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.monthly_leaderboard(date, text, integer), public.public_gamification(uuid) TO anon, authenticated, service_role;
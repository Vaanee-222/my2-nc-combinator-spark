
CREATE TABLE public.point_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text,
  event_key text NOT NULL,
  points integer NOT NULL,
  source_table text,
  source_id text,
  awarded_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX point_events_unique_source ON public.point_events (user_id, event_key, coalesce(source_id, ''));
CREATE INDEX point_events_user_idx ON public.point_events (user_id, awarded_at DESC);

GRANT SELECT ON public.point_events TO authenticated;
GRANT ALL ON public.point_events TO service_role;
ALTER TABLE public.point_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their own point events" ON public.point_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all point events" ON public.point_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.user_points (
  user_id uuid PRIMARY KEY,
  total_points integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  level_name text NOT NULL DEFAULT 'Explorer',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.user_points TO authenticated;
GRANT ALL ON public.user_points TO service_role;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their own totals" ON public.user_points
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all totals" ON public.user_points
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.level_for_points(_points integer)
RETURNS TABLE(level integer, level_name text)
LANGUAGE sql IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN _points >= 4000 THEN 5
    WHEN _points >= 1801 THEN 4
    WHEN _points >= 751 THEN 3
    WHEN _points >= 251 THEN 2
    ELSE 1 END,
  CASE
    WHEN _points >= 4000 THEN 'Flagship'
    WHEN _points >= 1801 THEN 'Signal'
    WHEN _points >= 751 THEN 'Contender'
    WHEN _points >= 251 THEN 'Builder'
    ELSE 'Explorer' END;
$$;

CREATE OR REPLACE FUNCTION public.recalc_user_points(_user_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total integer;
  lvl integer;
  lname text;
BEGIN
  SELECT coalesce(sum(points), 0) INTO total FROM public.point_events WHERE user_id = _user_id;
  SELECT l.level, l.level_name INTO lvl, lname FROM public.level_for_points(total) l;
  INSERT INTO public.user_points (user_id, total_points, level, level_name, updated_at)
  VALUES (_user_id, total, lvl, lname, now())
  ON CONFLICT (user_id) DO UPDATE
    SET total_points = excluded.total_points,
        level = excluded.level,
        level_name = excluded.level_name,
        updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.award_points(
  _user_id uuid, _event_key text, _points integer,
  _source_table text DEFAULT NULL, _source_id text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _user_id IS NULL OR _points IS NULL OR _points <= 0 THEN
    RETURN;
  END IF;
  INSERT INTO public.point_events (user_id, event_key, points, source_table, source_id)
  VALUES (_user_id, _event_key, _points, _source_table, _source_id)
  ON CONFLICT DO NOTHING;
  PERFORM public.recalc_user_points(_user_id);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.award_points(uuid, text, integer, text, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalc_user_points(uuid) FROM anon, authenticated;

-- generic trigger: awards points for the row's owner
CREATE OR REPLACE FUNCTION public.tg_award_points()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid;
  ekey text := TG_ARGV[0];
  pts integer := TG_ARGV[1]::integer;
  ucol text := coalesce(TG_ARGV[2], 'user_id');
BEGIN
  EXECUTE format('SELECT ($1).%I', ucol) INTO uid USING NEW;
  IF uid IS NOT NULL THEN
    PERFORM public.award_points(uid, ekey, pts, TG_TABLE_NAME, NEW.id::text);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER award_points_applications AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.tg_award_points('program_application', '30');
CREATE TRIGGER award_points_inclab AFTER INSERT ON public.inclab_applications
  FOR EACH ROW EXECUTE FUNCTION public.tg_award_points('program_application', '30');
CREATE TRIGGER award_points_incubation AFTER INSERT ON public.incubation_applications
  FOR EACH ROW EXECUTE FUNCTION public.tg_award_points('program_application', '30');
CREATE TRIGGER award_points_hackathon AFTER INSERT ON public.hackathon_registrations
  FOR EACH ROW EXECUTE FUNCTION public.tg_award_points('program_application', '30');
CREATE TRIGGER award_points_deal_claims AFTER INSERT ON public.deal_claims
  FOR EACH ROW EXECUTE FUNCTION public.tg_award_points('deal_claimed', '20');
CREATE TRIGGER award_points_cofounder_requests AFTER INSERT ON public.cofounder_requests
  FOR EACH ROW EXECUTE FUNCTION public.tg_award_points('cofounder_request_posted', '35');
CREATE TRIGGER award_points_cofounder_applications AFTER INSERT ON public.cofounder_applications
  FOR EACH ROW EXECUTE FUNCTION public.tg_award_points('cofounder_application_sent', '15', 'applicant_id');
CREATE TRIGGER award_points_mentorship_requests AFTER INSERT ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.tg_award_points('mentorship_requested', '25', 'requester_id');
CREATE TRIGGER award_points_intro_requests AFTER INSERT ON public.introduction_requests
  FOR EACH ROW EXECUTE FUNCTION public.tg_award_points('intro_requested', '20', 'requester_id');

-- mentor sessions: award only when completed
CREATE OR REPLACE FUNCTION public.tg_award_session_points()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(coalesce(NEW.status, '')) = 'completed' THEN
    PERFORM public.award_points(NEW.mentor_id, 'session_completed', 75, 'mentor_sessions', NEW.id::text);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER award_points_mentor_sessions AFTER INSERT OR UPDATE OF status ON public.mentor_sessions
  FOR EACH ROW EXECUTE FUNCTION public.tg_award_session_points();

-- backfill existing activity
DO $backfill$
DECLARE r record;
BEGIN
  FOR r IN SELECT user_id, id FROM public.applications WHERE user_id IS NOT NULL LOOP
    PERFORM public.award_points(r.user_id, 'program_application', 30, 'applications', r.id::text);
  END LOOP;
  FOR r IN SELECT user_id, id FROM public.inclab_applications WHERE user_id IS NOT NULL LOOP
    PERFORM public.award_points(r.user_id, 'program_application', 30, 'inclab_applications', r.id::text);
  END LOOP;
  FOR r IN SELECT user_id, id FROM public.incubation_applications WHERE user_id IS NOT NULL LOOP
    PERFORM public.award_points(r.user_id, 'program_application', 30, 'incubation_applications', r.id::text);
  END LOOP;
  FOR r IN SELECT user_id, id FROM public.hackathon_registrations WHERE user_id IS NOT NULL LOOP
    PERFORM public.award_points(r.user_id, 'program_application', 30, 'hackathon_registrations', r.id::text);
  END LOOP;
  FOR r IN SELECT user_id, id FROM public.deal_claims WHERE user_id IS NOT NULL LOOP
    PERFORM public.award_points(r.user_id, 'deal_claimed', 20, 'deal_claims', r.id::text);
  END LOOP;
  FOR r IN SELECT user_id, id FROM public.cofounder_requests WHERE user_id IS NOT NULL LOOP
    PERFORM public.award_points(r.user_id, 'cofounder_request_posted', 35, 'cofounder_requests', r.id::text);
  END LOOP;
  FOR r IN SELECT applicant_id AS user_id, id FROM public.cofounder_applications LOOP
    PERFORM public.award_points(r.user_id, 'cofounder_application_sent', 15, 'cofounder_applications', r.id::text);
  END LOOP;
  FOR r IN SELECT requester_id AS user_id, id FROM public.mentorship_requests LOOP
    PERFORM public.award_points(r.user_id, 'mentorship_requested', 25, 'mentorship_requests', r.id::text);
  END LOOP;
  FOR r IN SELECT requester_id AS user_id, id FROM public.introduction_requests LOOP
    PERFORM public.award_points(r.user_id, 'intro_requested', 20, 'introduction_requests', r.id::text);
  END LOOP;
  FOR r IN SELECT mentor_id AS user_id, id FROM public.mentor_sessions WHERE lower(coalesce(status,'')) = 'completed' LOOP
    PERFORM public.award_points(r.user_id, 'session_completed', 75, 'mentor_sessions', r.id::text);
  END LOOP;
END
$backfill$;

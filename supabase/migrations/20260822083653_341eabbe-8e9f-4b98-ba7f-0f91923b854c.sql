CREATE TABLE IF NOT EXISTS public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'award',
  criteria_event text NOT NULL,
  threshold integer NOT NULL DEFAULT 1,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.badges TO anon, authenticated;
GRANT ALL ON public.badges TO service_role;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone" ON public.badges
  FOR SELECT USING (true);
CREATE POLICY "Admins manage badges" ON public.badges
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_key text NOT NULL REFERENCES public.badges(key) ON DELETE CASCADE,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_key)
);

GRANT SELECT ON public.user_badges TO anon, authenticated;
GRANT ALL ON public.user_badges TO service_role;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User badges are viewable by everyone" ON public.user_badges
  FOR SELECT USING (true);

INSERT INTO public.badges (key, name, description, icon, criteria_event, threshold, sort_order) VALUES
  ('first_application', 'First Move', 'Applied to your first program', 'rocket', 'program_application', 1, 10),
  ('serial_applicant', 'Serial Applicant', 'Applied to 5 programs', 'layers', 'program_application', 5, 20),
  ('first_deal', 'Deal Hunter', 'Claimed your first perk deal', 'tag', 'deal_claimed', 1, 30),
  ('deal_veteran', 'Perk Collector', 'Claimed 5 deals', 'gift', 'deal_claimed', 5, 40),
  ('cofounder_poster', 'Team Builder', 'Posted a co-founder requirement', 'users', 'cofounder_request_posted', 1, 50),
  ('cofounder_applicant', 'Ready to Join', 'Applied to a co-founder role', 'handshake', 'cofounder_application_sent', 1, 60),
  ('mentee', 'Coachable', 'Requested mentorship', 'graduation-cap', 'mentorship_requested', 1, 70),
  ('investor_outreach', 'Fundraiser', 'Requested an investor introduction', 'trending-up', 'intro_requested', 1, 80),
  ('first_session', 'Mentor Debut', 'Completed your first mentor session', 'calendar-check', 'session_completed', 1, 90),
  ('ten_sessions', '10 Sessions', 'Completed 10 mentor sessions', 'medal', 'session_completed', 10, 100),
  ('xp_builder', 'Builder', 'Reached 250 XP', 'sparkles', '*points*', 251, 110),
  ('xp_contender', 'Contender', 'Reached 750 XP', 'star', '*points*', 751, 120),
  ('xp_signal', 'Signal', 'Reached 1800 XP', 'zap', '*points*', 1801, 130),
  ('xp_flagship', 'Flagship', 'Reached 4000 XP', 'crown', '*points*', 4000, 140)
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.evaluate_badges(_user_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  b record;
  cnt integer;
  total integer;
BEGIN
  IF _user_id IS NULL THEN RETURN; END IF;
  SELECT coalesce(sum(points), 0) INTO total FROM public.point_events WHERE user_id = _user_id;
  FOR b IN SELECT * FROM public.badges WHERE is_active LOOP
    IF b.criteria_event = '*points*' THEN
      cnt := total;
    ELSE
      SELECT count(*) INTO cnt FROM public.point_events
        WHERE user_id = _user_id AND event_key = b.criteria_event;
    END IF;
    IF cnt >= b.threshold THEN
      INSERT INTO public.user_badges (user_id, badge_key)
      VALUES (_user_id, b.key)
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.evaluate_badges(uuid) FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.tg_evaluate_badges()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.evaluate_badges(NEW.user_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS evaluate_badges_on_points ON public.point_events;
CREATE TRIGGER evaluate_badges_on_points AFTER INSERT ON public.point_events
  FOR EACH ROW EXECUTE FUNCTION public.tg_evaluate_badges();

DO $$
DECLARE u uuid;
BEGIN
  FOR u IN SELECT DISTINCT user_id FROM public.point_events LOOP
    PERFORM public.evaluate_badges(u);
  END LOOP;
END $$;
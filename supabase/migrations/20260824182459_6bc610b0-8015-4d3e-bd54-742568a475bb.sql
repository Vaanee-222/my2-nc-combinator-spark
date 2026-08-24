-- 1. Audience on plans
ALTER TABLE public.subscription_plans
  ADD COLUMN IF NOT EXISTS audience text NOT NULL DEFAULT 'startup';

ALTER TABLE public.subscription_plans
  DROP CONSTRAINT IF EXISTS subscription_plans_audience_check;
ALTER TABLE public.subscription_plans
  ADD CONSTRAINT subscription_plans_audience_check
  CHECK (audience IN ('startup','investor','mentor','cofounder','all'));

-- Existing rows stay startup-facing
UPDATE public.subscription_plans SET audience = 'startup' WHERE audience IS NULL;

-- 2. Role ladders
INSERT INTO public.subscription_plans (name, category, tier, audience, price_usd, billing_period, description, features, is_popular, is_active, sort_order)
VALUES
  ('Mentor Free','membership','free','mentor',0,'month','Profile, accept requests and log sessions.',
   ARRAY['Public mentor profile','Accept mentorship requests','Log and track sessions','Community access'],false,true,10),
  ('Mentor Pro','membership','pro','mentor',29,'month','Paid sessions, booking page and mentee CRM.',
   ARRAY['Paid session listing with payouts','Calendar and booking page','Mentee CRM with notes and history','Session outcome analytics','Priority in mentor matching'],true,true,11),
  ('Advisory Partner','membership','premium','mentor',99,'month','Co-branded advisory listing and cohort office hours.',
   ARRAY['Everything in Mentor Pro','Co-branded advisory listing','Cohort office-hours slot','Revenue share on referred startups','Advisory Board eligibility'],false,true,12),

  ('Co-founder Free','membership','free','cofounder',0,'month','Browse opportunities and apply.',
   ARRAY['Browse co-founder opportunities','3 applications per month','Public profile','Community access'],false,true,20),
  ('Co-founder Plus','membership','pro','cofounder',19,'month','Unlimited applications and profile boost.',
   ARRAY['Unlimited applications','Profile boost in founder search','Verified skills badge','See who viewed your profile','Direct message founders'],true,true,21),
  ('Founder Track','membership','premium','cofounder',59,'month','Matchmaking concierge and founder toolkit.',
   ARRAY['Everything in Co-founder Plus','Matchmaking concierge','Equity and agreement templates','Legal and incorporation partner credits'],false,true,22),

  ('Investor Free','membership','free','investor',0,'month','Public directory listing and inbound inquiries.',
   ARRAY['Public investor directory listing','Receive inbound inquiries','Community access'],false,true,30),
  ('Deal Flow','membership','pro','investor',99,'month','Curated deal alerts and portfolio tracking.',
   ARRAY['Curated weekly deal alerts','Filters by sector, stage and geography','Portfolio tracker','Startup health score reports'],true,true,31),
  ('Syndicate','membership','premium','investor',299,'month','Data rooms, demo-day priority and co-invest intros.',
   ARRAY['Everything in Deal Flow','Data room access','Cohort demo-day priority','Co-investment introductions','Analytics exports'],false,true,32)
ON CONFLICT DO NOTHING;

-- 3. Monthly usage counters for quota-style perks
CREATE TABLE IF NOT EXISTS public.usage_counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  counter_key text NOT NULL,
  period_start date NOT NULL DEFAULT date_trunc('month', now())::date,
  count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, counter_key, period_start)
);

GRANT SELECT ON public.usage_counters TO authenticated;
GRANT ALL ON public.usage_counters TO service_role;

ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members read own usage" ON public.usage_counters;
CREATE POLICY "Members read own usage" ON public.usage_counters
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins read all usage" ON public.usage_counters;
CREATE POLICY "Admins read all usage" ON public.usage_counters
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Server-side increment so clients cannot fake usage
CREATE OR REPLACE FUNCTION public.increment_usage_counter(_counter_key text, _delta integer DEFAULT 1)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _new integer;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _delta IS NULL OR _delta < 1 OR _delta > 10 THEN
    _delta := 1;
  END IF;

  INSERT INTO public.usage_counters (user_id, counter_key, period_start, count)
  VALUES (_uid, _counter_key, date_trunc('month', now())::date, _delta)
  ON CONFLICT (user_id, counter_key, period_start)
  DO UPDATE SET count = public.usage_counters.count + _delta, updated_at = now()
  RETURNING count INTO _new;

  RETURN _new;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_usage_counter(text, integer) FROM public;
GRANT EXECUTE ON FUNCTION public.increment_usage_counter(text, integer) TO authenticated;
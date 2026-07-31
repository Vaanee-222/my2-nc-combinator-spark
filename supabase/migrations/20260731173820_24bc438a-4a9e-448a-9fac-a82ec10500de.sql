-- 1. site settings (CMS singleton)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'Xi Combinator',
  tagline text,
  logo_url text,
  favicon_url text,
  meta_title text,
  meta_description text,
  og_image_url text,
  twitter_handle text,
  contact_email text,
  contact_phone text,
  address text,
  linkedin_url text,
  twitter_url text,
  youtube_url text,
  footer_text text,
  announcement_text text,
  announcement_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.site_settings (site_name, tagline, meta_title, meta_description)
VALUES ('Xi Combinator', 'Build globally. Scale relentlessly.', 'Xi Combinator — Global Startup Accelerator & Community',
        'Xi Combinator backs early-stage founders worldwide with incubation, MVP labs, hackathons, mentorship and investor access.');

-- 2. cohort startups
CREATE TABLE public.cohort_startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text UNIQUE,
  name text NOT NULL,
  founder text,
  category text,
  description text,
  stage text,
  traction text,
  status text NOT NULL DEFAULT 'Selected',
  cohort_type text NOT NULL DEFAULT 'monthly',
  period text NOT NULL,
  highlight text,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cohort_startups TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cohort_startups TO authenticated;
GRANT ALL ON public.cohort_startups TO service_role;
ALTER TABLE public.cohort_startups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible cohort startups" ON public.cohort_startups FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins manage cohort startups" ON public.cohort_startups FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_cohort_startups_updated_at BEFORE UPDATE ON public.cohort_startups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. advisors
CREATE TABLE public.advisors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  company text,
  country text,
  expertise text,
  description text,
  linkedin_url text,
  avatar_url text,
  tier text NOT NULL DEFAULT 'Strategic Advisors',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.advisors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.advisors TO authenticated;
GRANT ALL ON public.advisors TO service_role;
ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active advisors" ON public.advisors FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage advisors" ON public.advisors FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_advisors_updated_at BEFORE UPDATE ON public.advisors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
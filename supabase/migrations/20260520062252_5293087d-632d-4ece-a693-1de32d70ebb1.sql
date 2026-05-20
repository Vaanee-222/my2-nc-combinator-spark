-- Partner regions
CREATE TABLE public.partner_regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  flag TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region_id UUID NOT NULL REFERENCES public.partner_regions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  note TEXT,
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view active regions" ON public.partner_regions FOR SELECT USING (true);
CREATE POLICY "Anyone can view active partners" ON public.partners FOR SELECT USING (true);

-- Admin manage
CREATE POLICY "Admins manage regions" ON public.partner_regions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage partners" ON public.partners FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_partner_regions_updated_at
  BEFORE UPDATE ON public.partner_regions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data
INSERT INTO public.partner_regions (name, flag, description, sort_order) VALUES
  ('India', '🇮🇳', 'Headquarters & primary operations', 1),
  ('Middle East', '🇦🇪', 'Dubai & Oman — Gulf expansion', 2),
  ('Europe', '🇪🇺', 'United Kingdom & Switzerland', 3),
  ('Asia', '🌏', 'Singapore & Hong Kong', 4),
  ('North America', '🇺🇸', 'USA & Canada', 5);

INSERT INTO public.partners (region_id, name, note, sort_order)
SELECT id, p.name, p.note, p.sort_order FROM public.partner_regions r
JOIN (VALUES
  ('India', 'DJ Partners & Consulting', 'Strategy & advisory', 1),
  ('India', 'Bengaluru Innovation Hub', 'Tech ecosystem', 2),
  ('India', 'Mumbai VC Network', 'Early-stage capital', 3),
  ('Middle East', 'Dubai Future Foundation', 'Govt. innovation', 1),
  ('Middle East', 'Oman Tech Fund', 'Sovereign investment', 2),
  ('Middle East', 'DIFC Innovation Hub', 'Fintech & scale-ups', 3),
  ('Europe', 'London Tech Bridge', 'UK market entry', 1),
  ('Europe', 'Swiss Startup Association', 'Deep-tech & R&D', 2),
  ('Europe', 'Zurich Capital Partners', 'Growth funding', 3),
  ('Asia', 'Singapore Enterprise Hub', 'APAC HQ partner', 1),
  ('Asia', 'Hong Kong Cyberport', 'Tech accelerator', 2),
  ('Asia', 'SEA Founders Network', 'Regional founders', 3),
  ('North America', 'Silicon Valley Connect', 'Bay Area access', 1),
  ('North America', 'NYC Venture Alliance', 'East Coast capital', 2),
  ('North America', 'Toronto Innovation Council', 'Canadian ecosystem', 3)
) AS p(region_name, name, note, sort_order) ON r.name = p.region_name;
CREATE TABLE IF NOT EXISTS public.investors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  check_size text,
  portfolio_count integer DEFAULT 0,
  stage text,
  status text NOT NULL DEFAULT 'Active',
  website_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.investors TO authenticated;
GRANT ALL ON public.investors TO service_role;

ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage investors" ON public.investors
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS update_investors_updated_at ON public.investors;
CREATE TRIGGER update_investors_updated_at
BEFORE UPDATE ON public.investors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_type text NOT NULL,
  name text NOT NULL,
  start_date text,
  duration text,
  capacity integer DEFAULT 0,
  budget text,
  status text NOT NULL DEFAULT 'Planning',
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage programs" ON public.programs
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS update_programs_updated_at ON public.programs;
CREATE TRIGGER update_programs_updated_at
BEFORE UPDATE ON public.programs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.investors (name, check_size, portfolio_count, stage, status, website_url, notes)
SELECT * FROM (VALUES
  ('Sequoia Capital India', '$60K-$600K', 45, 'Series A+', 'Active', 'https://www.sequoiacap.com', 'India and Southeast Asia venture partner'),
  ('Accel Partners', '$25K-$300K', 38, 'Seed-Series B', 'Active', 'https://www.accel.com', 'Seed and growth-stage investor'),
  ('Matrix Partners', '$12K-$180K', 52, 'Pre-Seed-Series A', 'Active', 'https://www.matrixpartners.in', 'Early-stage venture investor')
) AS seed(name, check_size, portfolio_count, stage, status, website_url, notes)
WHERE NOT EXISTS (SELECT 1 FROM public.investors);

INSERT INTO public.programs (program_type, name, start_date, duration, capacity, budget, status, description)
SELECT * FROM (VALUES
  ('hackathon', 'AI Innovation Hackathon 2026', 'March 15-17, 2026', '3 days', 150, '$60K', 'Active', 'Flagship builder event for applied AI products.'),
  ('incubation', 'Cohort 2026-A', 'January 2026', '6 months', 25, '$125K', 'Active', 'Structured incubation cohort for early-stage founders.'),
  ('mvplab', 'MVP Development Program Q1 2026', 'February 2026', '12 weeks', 40, '$40K', 'Active', 'Hands-on sprint for validating and shipping MVPs.'),
  ('inclab', 'Xi Lab Research Sprint 2026', 'April 2026', '10 weeks', 15, '$60K', 'Planning', 'Deep-tech and applied research commercialization sprint.')
) AS seed(program_type, name, start_date, duration, capacity, budget, status, description)
WHERE NOT EXISTS (SELECT 1 FROM public.programs);
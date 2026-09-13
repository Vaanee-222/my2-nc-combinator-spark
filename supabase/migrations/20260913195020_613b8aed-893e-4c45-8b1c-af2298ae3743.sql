UPDATE public.programs
SET name = 'AI Agents Challenge 2026', start_date = 'October 16-18, 2026', budget = '$120K', status = 'Active', updated_at = now()
WHERE program_type = 'hackathon' AND name = 'AI Innovation Hackathon 2026';

UPDATE public.programs
SET name = 'Cohort 2026-Q4', start_date = 'November 2026', capacity = 24, status = 'Planning', updated_at = now()
WHERE program_type = 'incubation' AND name = 'Cohort 2026-A';

UPDATE public.programs
SET name = 'MVP Development Program Q4 2026', start_date = 'October 2026', status = 'Planning', updated_at = now()
WHERE program_type = 'mvplab' AND name = 'MVP Development Program Q1 2026';

UPDATE public.programs
SET start_date = 'November 2026', capacity = 24, status = 'Planning', updated_at = now()
WHERE program_type = 'inclab' AND name = 'Xi Lab Research Sprint 2026';

UPDATE public.deal_offers
SET status = 'expired', updated_at = now()
WHERE status = 'approved'
  AND company_name IN ('Notion', 'Stripe')
  AND valid_until IN ('Jan 15, 2026', 'Mar 31, 2026');
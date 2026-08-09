CREATE TABLE public.cofounder_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.cofounder_requests(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL,
  applicant_name text NOT NULL,
  email text NOT NULL,
  headline text,
  message text NOT NULL,
  skills text,
  linkedin_url text,
  status text NOT NULL DEFAULT 'new',
  founder_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (request_id, applicant_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cofounder_applications TO authenticated;
GRANT ALL ON public.cofounder_applications TO service_role;

ALTER TABLE public.cofounder_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants view own cofounder applications"
  ON public.cofounder_applications FOR SELECT TO authenticated
  USING (applicant_id = auth.uid());

CREATE POLICY "Post owners view applications to their posts"
  ON public.cofounder_applications FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cofounder_requests r WHERE r.id = request_id AND r.user_id = auth.uid()));

CREATE POLICY "Admins view all cofounder applications"
  ON public.cofounder_applications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Applicants create own cofounder applications"
  ON public.cofounder_applications FOR INSERT TO authenticated
  WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Applicants update own cofounder applications"
  ON public.cofounder_applications FOR UPDATE TO authenticated
  USING (applicant_id = auth.uid())
  WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Post owners update applications to their posts"
  ON public.cofounder_applications FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cofounder_requests r WHERE r.id = request_id AND r.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cofounder_requests r WHERE r.id = request_id AND r.user_id = auth.uid()));

CREATE POLICY "Admins manage all cofounder applications"
  ON public.cofounder_applications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Applicants delete own cofounder applications"
  ON public.cofounder_applications FOR DELETE TO authenticated
  USING (applicant_id = auth.uid());

CREATE TRIGGER cofounder_applications_updated_at
  BEFORE UPDATE ON public.cofounder_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.validate_cofounder_application()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.applicant_name := btrim(coalesce(NEW.applicant_name, ''));
  NEW.email := lower(btrim(coalesce(NEW.email, '')));
  NEW.message := btrim(coalesce(NEW.message, ''));
  NEW.linkedin_url := nullif(btrim(coalesce(NEW.linkedin_url, '')), '');

  IF length(NEW.applicant_name) < 2 OR length(NEW.applicant_name) > 100 THEN
    RAISE EXCEPTION 'Name must be between 2 and 100 characters';
  END IF;
  IF NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'A valid email address is required';
  END IF;
  IF length(NEW.message) < 20 OR length(NEW.message) > 2000 THEN
    RAISE EXCEPTION 'Your message must be between 20 and 2000 characters';
  END IF;
  IF NEW.linkedin_url IS NOT NULL AND NEW.linkedin_url !~* '^https?://' THEN
    RAISE EXCEPTION 'Profile link must start with http:// or https://';
  END IF;
  IF NEW.status NOT IN ('new','shortlisted','accepted','rejected','withdrawn') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_cofounder_application_trg
  BEFORE INSERT OR UPDATE ON public.cofounder_applications
  FOR EACH ROW EXECUTE FUNCTION public.validate_cofounder_application();

CREATE TABLE public.deal_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  deal_id uuid REFERENCES public.deal_offers(id) ON DELETE SET NULL,
  deal_title text NOT NULL,
  company_name text,
  offer_value text,
  redemption_url text,
  status text NOT NULL DEFAULT 'claimed',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.deal_claims TO authenticated;
GRANT ALL ON public.deal_claims TO service_role;

ALTER TABLE public.deal_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own deal claims"
  ON public.deal_claims FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users create own deal claims"
  ON public.deal_claims FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own deal claims"
  ON public.deal_claims FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins manage deal claims"
  ON public.deal_claims FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER deal_claims_updated_at
  BEFORE UPDATE ON public.deal_claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
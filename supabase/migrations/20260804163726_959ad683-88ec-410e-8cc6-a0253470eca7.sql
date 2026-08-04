-- 1. INVESTOR INQUIRIES
CREATE TABLE public.investor_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  startup_name text NOT NULL,
  investor_name text NOT NULL,
  email text NOT NULL,
  phone text,
  firm text,
  investor_type text NOT NULL,
  ticket_size text NOT NULL,
  stage_preference text,
  instrument text,
  timeline text,
  profile_url text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investor_inquiries TO authenticated;
GRANT ALL ON public.investor_inquiries TO service_role;
ALTER TABLE public.investor_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors insert own inquiries" ON public.investor_inquiries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Investors read own inquiries" ON public.investor_inquiries FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update inquiries" ON public.investor_inquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete inquiries" ON public.investor_inquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.validate_investor_inquiry()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  blob text;
BEGIN
  NEW.investor_name := btrim(coalesce(NEW.investor_name, ''));
  NEW.email := lower(btrim(coalesce(NEW.email, '')));
  NEW.firm := nullif(btrim(coalesce(NEW.firm, '')), '');
  NEW.message := nullif(btrim(coalesce(NEW.message, '')), '');
  NEW.profile_url := nullif(btrim(coalesce(NEW.profile_url, '')), '');

  IF length(NEW.investor_name) < 2 OR length(NEW.investor_name) > 100 THEN
    RAISE EXCEPTION 'Investor name must be between 2 and 100 characters';
  END IF;
  IF NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'A valid work email address is required';
  END IF;
  IF NEW.investor_type NOT IN ('Angel','Syndicate','Micro VC','Venture Capital','Family Office','Corporate / Strategic') THEN
    RAISE EXCEPTION 'Invalid investor type';
  END IF;
  IF NEW.ticket_size NOT IN ('Under $25K','$25K - $100K','$100K - $500K','$500K - $2M','$2M+') THEN
    RAISE EXCEPTION 'Invalid ticket size';
  END IF;
  IF NEW.stage_preference IS NOT NULL AND NEW.stage_preference NOT IN ('Pre-Seed','Seed','Series A','Series B+') THEN
    RAISE EXCEPTION 'Invalid stage preference';
  END IF;
  IF NEW.instrument IS NOT NULL AND NEW.instrument NOT IN ('SAFE','Convertible Note','Priced Equity','Secondary') THEN
    RAISE EXCEPTION 'Invalid instrument';
  END IF;
  IF NEW.timeline IS NOT NULL AND NEW.timeline NOT IN ('Immediate','1-3 months','3-6 months','Exploratory') THEN
    RAISE EXCEPTION 'Invalid decision timeline';
  END IF;
  IF NEW.status NOT IN ('pending','reviewing','accepted','declined') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;
  IF NEW.message IS NOT NULL AND length(NEW.message) > 2000 THEN
    RAISE EXCEPTION 'Message must be 2000 characters or fewer';
  END IF;
  IF NEW.profile_url IS NOT NULL AND NEW.profile_url !~* '^https?://' THEN
    RAISE EXCEPTION 'Profile link must start with http:// or https://';
  END IF;

  -- Investor inquiries must never carry pitch-deck material
  blob := lower(concat_ws(' ', NEW.message, NEW.profile_url, NEW.firm));
  IF blob ~ '(pitch[ _-]?deck|deck[ _-]?url|\.pdf|\.pptx?|drive\.google\.com/file|docsend\.com)' THEN
    RAISE EXCEPTION 'Investor inquiries cannot include pitch decks or document uploads';
  END IF;

  RETURN NEW;
END;
$$;
CREATE TRIGGER validate_investor_inquiry_trg BEFORE INSERT OR UPDATE ON public.investor_inquiries FOR EACH ROW EXECUTE FUNCTION public.validate_investor_inquiry();
CREATE TRIGGER investor_inquiries_updated_at BEFORE UPDATE ON public.investor_inquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. CONSULTATION BOOKINGS
CREATE TABLE public.consultation_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  consultation_type text NOT NULL,
  preferred_date text,
  preferred_time text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultation_bookings TO authenticated;
GRANT INSERT ON public.consultation_bookings TO anon;
GRANT ALL ON public.consultation_bookings TO service_role;
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can book a consultation" ON public.consultation_bookings FOR INSERT TO anon, authenticated WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Owners and admins read bookings" ON public.consultation_bookings FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update bookings" ON public.consultation_bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete bookings" ON public.consultation_bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER consultation_bookings_updated_at BEFORE UPDATE ON public.consultation_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. GRANTS
CREATE TABLE public.grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  amount text,
  grant_type text,
  focus text,
  deadline text,
  status text NOT NULL DEFAULT 'Open',
  description text,
  sectors text[] NOT NULL DEFAULT '{}',
  eligibility text[] NOT NULL DEFAULT '{}',
  benefits text[] NOT NULL DEFAULT '{}',
  application_process text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.grants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grants TO authenticated;
GRANT ALL ON public.grants TO service_role;
ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active grants" ON public.grants FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage grants" ON public.grants FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER grants_updated_at BEFORE UPDATE ON public.grants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.grant_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  grant_id uuid REFERENCES public.grants(id) ON DELETE SET NULL,
  grant_name text NOT NULL,
  applicant_name text NOT NULL,
  email text NOT NULL,
  phone text,
  startup_name text,
  sector text,
  stage text,
  funding_ask text,
  proposal text,
  status text NOT NULL DEFAULT 'submitted',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grant_applications TO authenticated;
GRANT ALL ON public.grant_applications TO service_role;
ALTER TABLE public.grant_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users submit grant applications" ON public.grant_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners and admins read grant applications" ON public.grant_applications FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update grant applications" ON public.grant_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete grant applications" ON public.grant_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER grant_applications_updated_at BEFORE UPDATE ON public.grant_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. SUBSCRIPTION PLANS + PURCHASES
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'membership',
  tier text,
  price_usd numeric NOT NULL DEFAULT 0,
  billing_period text NOT NULL DEFAULT 'monthly',
  description text,
  features text[] NOT NULL DEFAULT '{}',
  is_popular boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscription_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscription_plans TO authenticated;
GRANT ALL ON public.subscription_plans TO service_role;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active plans" ON public.subscription_plans FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage plans" ON public.subscription_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.subscription_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  plan_name text NOT NULL,
  amount_usd numeric NOT NULL DEFAULT 0,
  billing_period text,
  buyer_email text,
  status text NOT NULL DEFAULT 'active',
  reference text,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscription_purchases TO authenticated;
GRANT ALL ON public.subscription_purchases TO service_role;
ALTER TABLE public.subscription_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users record own purchases" ON public.subscription_purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners and admins read purchases" ON public.subscription_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update purchases" ON public.subscription_purchases FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete purchases" ON public.subscription_purchases FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER subscription_purchases_updated_at BEFORE UPDATE ON public.subscription_purchases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. DEAL OFFERS
CREATE TABLE public.deal_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by uuid,
  company_name text NOT NULL,
  title text NOT NULL,
  category text,
  description text,
  offer_value text,
  discount text,
  redemption_url text,
  promo_code text,
  contact_email text NOT NULL,
  valid_until text,
  logo_url text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.deal_offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deal_offers TO authenticated;
GRANT ALL ON public.deal_offers TO service_role;
ALTER TABLE public.deal_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view approved deals" ON public.deal_offers FOR SELECT TO anon, authenticated USING (status = 'approved' OR auth.uid() = submitted_by OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users submit deals" ON public.deal_offers FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins update deals" ON public.deal_offers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete deals" ON public.deal_offers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER deal_offers_updated_at BEFORE UPDATE ON public.deal_offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. CLOUD CREDIT REQUESTS
CREATE TABLE public.cloud_credit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  applicant_name text NOT NULL,
  email text NOT NULL,
  startup_name text,
  provider text NOT NULL,
  credit_amount text,
  stage text,
  use_case text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cloud_credit_requests TO authenticated;
GRANT ALL ON public.cloud_credit_requests TO service_role;
ALTER TABLE public.cloud_credit_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users submit credit requests" ON public.cloud_credit_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners and admins read credit requests" ON public.cloud_credit_requests FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update credit requests" ON public.cloud_credit_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete credit requests" ON public.cloud_credit_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER cloud_credit_requests_updated_at BEFORE UPDATE ON public.cloud_credit_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
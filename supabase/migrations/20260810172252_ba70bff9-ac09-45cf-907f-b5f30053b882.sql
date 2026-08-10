CREATE TABLE public.investor_portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  startup_id uuid REFERENCES public.startups(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  sector text,
  stage text,
  amount_invested numeric NOT NULL DEFAULT 0,
  ownership_pct numeric NOT NULL DEFAULT 0,
  current_valuation numeric NOT NULL DEFAULT 0,
  invested_on date,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.investor_portfolio TO authenticated;
GRANT ALL ON public.investor_portfolio TO service_role;
ALTER TABLE public.investor_portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investors manage own portfolio" ON public.investor_portfolio
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all portfolio" ON public.investor_portfolio
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER investor_portfolio_updated_at BEFORE UPDATE ON public.investor_portfolio
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.investor_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  startup_id uuid REFERENCES public.startups(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  sector text,
  stage text NOT NULL DEFAULT 'Sourced',
  progress integer NOT NULL DEFAULT 10,
  ask_amount numeric,
  revenue text,
  team_size integer,
  founded_year integer,
  source text,
  contact_email text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.investor_deals TO authenticated;
GRANT ALL ON public.investor_deals TO service_role;
ALTER TABLE public.investor_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investors manage own deals" ON public.investor_deals
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all deals" ON public.investor_deals
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER investor_deals_updated_at BEFORE UPDATE ON public.investor_deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.investor_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  firm_name text,
  contact_person text,
  email text,
  phone text,
  bio text,
  investor_type text,
  check_size_min numeric,
  check_size_max numeric,
  sectors text[] NOT NULL DEFAULT '{}',
  stages text[] NOT NULL DEFAULT '{}',
  regions text[] NOT NULL DEFAULT '{}',
  notify_new_deals boolean NOT NULL DEFAULT true,
  notify_portfolio_updates boolean NOT NULL DEFAULT true,
  notify_market_insights boolean NOT NULL DEFAULT false,
  notify_weekly_digest boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.investor_preferences TO authenticated;
GRANT ALL ON public.investor_preferences TO service_role;
ALTER TABLE public.investor_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investors manage own preferences" ON public.investor_preferences
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all preferences" ON public.investor_preferences
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER investor_preferences_updated_at BEFORE UPDATE ON public.investor_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_investor_portfolio_user ON public.investor_portfolio(user_id);
CREATE INDEX idx_investor_deals_user ON public.investor_deals(user_id);
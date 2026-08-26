-- Anonymous visitors cannot execute public.has_role, so any policy that calls it
-- for the anon role returns "permission denied for function has_role" (HTTP 401).
-- Split each policy: a pure anon-safe predicate + an authenticated policy that may use has_role.

DROP POLICY IF EXISTS "Public can view active plans" ON public.subscription_plans;
CREATE POLICY "Anon can view active plans"
  ON public.subscription_plans FOR SELECT TO anon
  USING (is_active);
CREATE POLICY "Members can view plans"
  ON public.subscription_plans FOR SELECT TO authenticated
  USING (is_active OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Public can view active grants" ON public.grants;
CREATE POLICY "Anon can view active grants"
  ON public.grants FOR SELECT TO anon
  USING (is_active);
CREATE POLICY "Members can view grants"
  ON public.grants FOR SELECT TO authenticated
  USING (is_active OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Public can view approved deals" ON public.deal_offers;
CREATE POLICY "Anon can view approved deals"
  ON public.deal_offers FOR SELECT TO anon
  USING (status = 'approved');
CREATE POLICY "Members can view deals"
  ON public.deal_offers FOR SELECT TO authenticated
  USING (
    status = 'approved'
    OR auth.uid() = submitted_by
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

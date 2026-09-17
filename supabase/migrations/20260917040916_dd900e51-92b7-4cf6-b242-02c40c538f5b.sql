CREATE TABLE public.admin_tab_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  tab_key text NOT NULL CHECK (tab_key ~ '^[a-z][a-z0-9-]*$'),
  is_allowed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role, tab_key),
  CHECK (role <> 'admin'::public.app_role)
);
GRANT SELECT ON public.admin_tab_permissions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.admin_tab_permissions TO authenticated;
GRANT ALL ON public.admin_tab_permissions TO service_role;
ALTER TABLE public.admin_tab_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own role tab permissions"
ON public.admin_tab_permissions FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);
CREATE POLICY "Admins manage tab permissions"
ON public.admin_tab_permissions FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER update_admin_tab_permissions_updated_at
BEFORE UPDATE ON public.admin_tab_permissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.admin_tab_permissions (role, tab_key, is_allowed)
SELECT role::public.app_role, tab_key, true
FROM (VALUES
  ('investor','overview'),('investor','analytics'),('investor','inbox'),('investor','inquiries'),('investor','introductions'),('investor','startups'),('investor','directory'),('investor','cohorts'),
  ('mentor','overview'),('mentor','applications'),('mentor','hackathons'),('mentor','incubation'),('mentor','mvplab'),('mentor','inclab'),('mentor','cofounders'),('mentor','health'),('mentor','advisors'),
  ('startup','overview'),('startup','applications'),('startup','credits'),('startup','plans'),('startup','deals'),('startup','grants'),
  ('cofounder','overview'),('cofounder','cofounders')
) AS seeded(role, tab_key);
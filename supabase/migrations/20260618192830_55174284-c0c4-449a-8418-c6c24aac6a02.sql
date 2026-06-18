CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT private.has_role(_user_id, _role)
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
CREATE POLICY "Admins can update applications" ON public.applications
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
CREATE POLICY "Users can view own applications" ON public.applications
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update hackathon regs" ON public.hackathon_registrations;
CREATE POLICY "Admins can update hackathon regs" ON public.hackathon_registrations
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can view own registrations" ON public.hackathon_registrations;
CREATE POLICY "Users can view own registrations" ON public.hackathon_registrations
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update inclab apps" ON public.inclab_applications;
CREATE POLICY "Admins can update inclab apps" ON public.inclab_applications
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can view own inclab apps" ON public.inclab_applications;
CREATE POLICY "Users can view own inclab apps" ON public.inclab_applications
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update incubation apps" ON public.incubation_applications;
CREATE POLICY "Admins can update incubation apps" ON public.incubation_applications
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can view own incubation apps" ON public.incubation_applications;
CREATE POLICY "Users can view own incubation apps" ON public.incubation_applications
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage blogs" ON public.blogs;
CREATE POLICY "Admins manage blogs" ON public.blogs
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage news" ON public.news;
CREATE POLICY "Admins manage news" ON public.news
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage regions" ON public.partner_regions;
CREATE POLICY "Admins manage regions" ON public.partner_regions
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage partners" ON public.partners;
CREATE POLICY "Admins manage partners" ON public.partners
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage startups" ON public.startups;
CREATE POLICY "Admins manage startups" ON public.startups
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Public read partner logos" ON storage.objects;
DROP POLICY IF EXISTS "partner-logos: public read by path" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins update partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete partner logos" ON storage.objects;
DROP POLICY IF EXISTS "partner-logos: admin insert" ON storage.objects;
DROP POLICY IF EXISTS "partner-logos: admin update" ON storage.objects;
DROP POLICY IF EXISTS "partner-logos: admin delete" ON storage.objects;

CREATE POLICY "partner-logos: admin insert" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'partner-logos' AND private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "partner-logos: admin update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'partner-logos' AND private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "partner-logos: admin delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'partner-logos' AND private.has_role(auth.uid(), 'admin'::public.app_role));
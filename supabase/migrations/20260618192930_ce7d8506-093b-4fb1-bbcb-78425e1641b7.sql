DROP POLICY IF EXISTS "Admins can delete applications" ON public.applications;
CREATE POLICY "Admins can delete applications" ON public.applications
FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete hackathon registrations" ON public.hackathon_registrations;
CREATE POLICY "Admins can delete hackathon registrations" ON public.hackathon_registrations
FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete incubation applications" ON public.incubation_applications;
CREATE POLICY "Admins can delete incubation applications" ON public.incubation_applications
FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete inclab applications" ON public.inclab_applications;
CREATE POLICY "Admins can delete inclab applications" ON public.inclab_applications
FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update cofounder requests" ON public.cofounder_requests;
CREATE POLICY "Admins can update cofounder requests" ON public.cofounder_requests
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete cofounder requests" ON public.cofounder_requests;
CREATE POLICY "Admins can delete cofounder requests" ON public.cofounder_requests
FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles" ON public.profiles
FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));
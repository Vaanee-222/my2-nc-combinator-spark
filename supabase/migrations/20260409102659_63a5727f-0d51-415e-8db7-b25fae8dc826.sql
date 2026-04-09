
DROP POLICY "Users can create hackathon registrations" ON public.hackathon_registrations;
CREATE POLICY "Auth users can create hackathon registrations" ON public.hackathon_registrations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY "Users can create incubation apps" ON public.incubation_applications;
CREATE POLICY "Auth users can create incubation apps" ON public.incubation_applications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY "Users can create applications" ON public.applications;
CREATE POLICY "Auth users can create applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

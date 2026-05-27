
INSERT INTO storage.buckets (id, name, public) VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read partner logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-logos');

CREATE POLICY "Admins upload partner logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update partner logos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete partner logos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'));

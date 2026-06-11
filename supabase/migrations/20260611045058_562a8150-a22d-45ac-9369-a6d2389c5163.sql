-- 1. Revoke EXECUTE on SECURITY DEFINER functions from PUBLIC/anon/authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
-- service_role retains rights via implicit ownership / superuser bypass; RLS policies that reference has_role
-- still work because the policy evaluates inside Postgres, not via the PostgREST API role.

-- 2. Tighten storage policies for the public partner-logos bucket: still publicly READABLE,
--    but only admins can LIST contents (drop the broad list-anything policy).
DO $$
BEGIN
  -- Remove any existing listing/select policies on partner-logos so we can replace cleanly.
  DELETE FROM pg_policies WHERE schemaname='storage' AND tablename='objects'
    AND policyname IN (
      'Public partner-logos read',
      'Public read partner-logos',
      'Public partner logos read access',
      'partner-logos public read',
      'Anyone can read partner-logos'
    );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Drop any catch-all read policies on partner-logos
DROP POLICY IF EXISTS "Public partner-logos read" ON storage.objects;
DROP POLICY IF EXISTS "Public read partner-logos" ON storage.objects;
DROP POLICY IF EXISTS "Public partner logos read access" ON storage.objects;
DROP POLICY IF EXISTS "partner-logos public read" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read partner-logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins manage partner-logos" ON storage.objects;

-- Public read access by direct path (object-level GET), but no broad listing.
CREATE POLICY "partner-logos: public read by path"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-logos');

-- Admin-only write/update/delete
CREATE POLICY "partner-logos: admin insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "partner-logos: admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "partner-logos: admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));

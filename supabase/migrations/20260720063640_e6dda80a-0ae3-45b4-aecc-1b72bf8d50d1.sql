
-- profiles: restrict SELECT to owner + admin
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::app_role));

-- profiles: add WITH CHECK to owner update
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- profiles: public view for non-sensitive fields (for directory / listings)
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = on) AS
SELECT id, user_id, full_name, avatar_url, bio, city, is_active, created_at
FROM public.profiles
WHERE is_active = true;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- cofounder_requests: require auth to view (hides contact_email from anonymous)
DROP POLICY IF EXISTS "Anyone can view cofounder requests" ON public.cofounder_requests;
CREATE POLICY "Authenticated users can view cofounder requests"
  ON public.cofounder_requests FOR SELECT
  TO authenticated
  USING (true);

-- cofounder_requests: add WITH CHECK to owner update
DROP POLICY IF EXISTS "Users can update own requests" ON public.cofounder_requests;
CREATE POLICY "Users can update own requests"
  ON public.cofounder_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- messages: prevent receiver from altering sender/content when marking read
DROP POLICY IF EXISTS "Receivers can mark as read" ON public.messages;
CREATE POLICY "Receivers can mark as read"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Column-level restriction: receivers may only change is_read
REVOKE UPDATE ON public.messages FROM authenticated;
GRANT UPDATE (is_read) ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

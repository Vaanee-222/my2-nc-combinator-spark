CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
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
      AND (
        auth.uid() = _user_id
        OR EXISTS (
          SELECT 1
          FROM public.user_roles admin_roles
          WHERE admin_roles.user_id = auth.uid()
            AND admin_roles.role = 'admin'::public.app_role
        )
      )
  )
$$;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;

CREATE OR REPLACE FUNCTION public.assign_signup_role(_role public.app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF _role = 'admin'::public.app_role THEN
    RAISE EXCEPTION 'Admin role cannot be self-assigned';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), _role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_signup_role(public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_signup_role(public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_signup_role(public.app_role) TO service_role;

DROP POLICY IF EXISTS "Users can create own non-admin role" ON public.user_roles;
CREATE POLICY "Users can create own non-admin role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND role <> 'admin'::public.app_role);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE OR REPLACE FUNCTION public.admin_replace_user_role(_user_id uuid, _role public.app_role)
RETURNS public.user_roles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.user_roles;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  IF _user_id = auth.uid() AND _role <> 'admin'::public.app_role THEN
    RAISE EXCEPTION 'You cannot remove your own administrator role';
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id AND role <> _role;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO UPDATE SET role = EXCLUDED.role
  RETURNING * INTO result;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_replace_user_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_replace_user_role(uuid, public.app_role) TO authenticated, service_role;

CREATE UNIQUE INDEX deal_claims_one_claim_per_user_deal
ON public.deal_claims (user_id, deal_id)
WHERE deal_id IS NOT NULL;
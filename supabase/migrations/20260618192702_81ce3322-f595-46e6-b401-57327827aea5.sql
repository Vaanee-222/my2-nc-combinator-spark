REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
DROP FUNCTION IF EXISTS public.assign_signup_role(public.app_role);
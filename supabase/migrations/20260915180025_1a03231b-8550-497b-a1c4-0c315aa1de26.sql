CREATE OR REPLACE FUNCTION public.protect_admin_role_deletion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role = 'admin'::public.app_role THEN
    IF auth.uid() = OLD.user_id THEN
      RAISE EXCEPTION 'You cannot revoke your own administrator role';
    END IF;
    IF (SELECT count(*) FROM public.user_roles WHERE role = 'admin'::public.app_role) <= 1 THEN
      RAISE EXCEPTION 'At least one administrator must remain';
    END IF;
  END IF;
  RETURN OLD;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_admin_role_deletion() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.protect_admin_role_deletion() TO service_role;

DROP TRIGGER IF EXISTS protect_admin_role_deletion_trigger ON public.user_roles;
CREATE TRIGGER protect_admin_role_deletion_trigger
BEFORE DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.protect_admin_role_deletion();

ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_messages_name_length CHECK (char_length(btrim(name)) BETWEEN 1 AND 161) NOT VALID,
  ADD CONSTRAINT contact_messages_email_format CHECK (char_length(email) <= 255 AND email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$') NOT VALID,
  ADD CONSTRAINT contact_messages_subject_length CHECK (subject IS NULL OR char_length(subject) <= 223) NOT VALID,
  ADD CONSTRAINT contact_messages_message_length CHECK (char_length(btrim(message)) BETWEEN 1 AND 3130) NOT VALID;
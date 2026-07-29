CREATE OR REPLACE FUNCTION public.validate_introduction_request()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.requester_name := btrim(coalesce(NEW.requester_name, ''));
  NEW.contact_email := lower(btrim(coalesce(NEW.contact_email, '')));
  NEW.message := btrim(coalesce(NEW.message, ''));
  NEW.startup_name := nullif(btrim(coalesce(NEW.startup_name, '')), '');

  IF length(NEW.requester_name) < 2 OR length(NEW.requester_name) > 100 THEN
    RAISE EXCEPTION 'Name must be between 2 and 100 characters';
  END IF;
  IF NEW.contact_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(NEW.contact_email) > 255 THEN
    RAISE EXCEPTION 'A valid email address is required';
  END IF;
  IF length(NEW.message) < 20 OR length(NEW.message) > 1000 THEN
    RAISE EXCEPTION 'Message must be between 20 and 1000 characters';
  END IF;
  IF NEW.status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;
  IF NEW.startup_name IS NOT NULL AND length(NEW.startup_name) > 120 THEN
    RAISE EXCEPTION 'Startup name must be 120 characters or fewer';
  END IF;

  IF TG_OP = 'INSERT' AND EXISTS (
    SELECT 1 FROM public.introduction_requests r
    WHERE r.requester_id = NEW.requester_id
      AND r.investor_id = NEW.investor_id
      AND r.status = 'pending'
  ) THEN
    RAISE EXCEPTION 'You already have a pending introduction request for this investor';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_introduction_request_trg ON public.introduction_requests;
CREATE TRIGGER validate_introduction_request_trg
BEFORE INSERT OR UPDATE ON public.introduction_requests
FOR EACH ROW EXECUTE FUNCTION public.validate_introduction_request();
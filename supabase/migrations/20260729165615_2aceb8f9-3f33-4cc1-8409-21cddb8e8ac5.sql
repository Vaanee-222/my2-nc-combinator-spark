ALTER TABLE public.cofounder_requests
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS review_notes text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

UPDATE public.cofounder_requests SET review_status = 'approved' WHERE review_status = 'pending';

DROP POLICY IF EXISTS "Public can view approved cofounder requests" ON public.cofounder_requests;
CREATE POLICY "Public can view approved cofounder requests"
ON public.cofounder_requests FOR SELECT TO anon
USING (review_status = 'approved' AND status = 'active');

GRANT SELECT ON public.cofounder_requests TO anon;

CREATE TABLE IF NOT EXISTS public.introduction_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL,
  investor_id text NOT NULL,
  investor_name text NOT NULL,
  requester_name text NOT NULL,
  contact_email text NOT NULL,
  startup_name text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.introduction_requests TO authenticated;
GRANT ALL ON public.introduction_requests TO service_role;

ALTER TABLE public.introduction_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users create own introduction requests"
ON public.introduction_requests FOR INSERT TO authenticated
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users view own introduction requests"
ON public.introduction_requests FOR SELECT TO authenticated
USING (auth.uid() = requester_id OR private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update introduction requests"
ON public.introduction_requests FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete introduction requests"
ON public.introduction_requests FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_introduction_requests_updated_at
BEFORE UPDATE ON public.introduction_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cofounder_requests_updated_at
BEFORE UPDATE ON public.cofounder_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
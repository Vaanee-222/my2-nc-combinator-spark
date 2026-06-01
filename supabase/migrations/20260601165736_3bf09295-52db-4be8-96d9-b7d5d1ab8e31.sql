-- INClab applications table
CREATE TABLE public.inclab_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  founder_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  startup_name TEXT,
  stage TEXT,
  industry TEXT,
  team_size TEXT,
  problem TEXT,
  solution TEXT,
  market TEXT,
  traction TEXT,
  funding_ask TEXT,
  why_inclab TEXT,
  pitch_deck_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.inclab_applications TO authenticated;
GRANT ALL ON public.inclab_applications TO service_role;

ALTER TABLE public.inclab_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can create inclab apps"
  ON public.inclab_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own inclab apps"
  ON public.inclab_applications FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update inclab apps"
  ON public.inclab_applications FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_inclab_applications_updated_at
  BEFORE UPDATE ON public.inclab_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
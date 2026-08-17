CREATE TABLE public.notification_reads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  notification_key text NOT NULL,
  read_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, notification_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_reads TO authenticated;
GRANT ALL ON public.notification_reads TO service_role;

ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own notification reads"
ON public.notification_reads FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX notification_reads_user_idx ON public.notification_reads (user_id);
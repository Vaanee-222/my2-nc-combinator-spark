
CREATE TABLE public.mentor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text,
  expertise text,
  experience text,
  company text,
  bio text,
  linkedin_url text,
  specializations text[] NOT NULL DEFAULT '{}',
  hourly_availability text,
  rating numeric NOT NULL DEFAULT 0,
  notify_new_requests boolean NOT NULL DEFAULT true,
  notify_session_reminders boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentor_profiles TO authenticated;
GRANT ALL ON public.mentor_profiles TO service_role;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentors manage own profile" ON public.mentor_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view mentor profiles" ON public.mentor_profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER mentor_profiles_updated_at BEFORE UPDATE ON public.mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.mentorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL,
  mentee_id uuid,
  mentee_name text NOT NULL,
  mentee_email text,
  startup_name text,
  sector text,
  stage text,
  current_focus text,
  sessions_completed integer NOT NULL DEFAULT 0,
  next_session_on date,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentorships TO authenticated;
GRANT ALL ON public.mentorships TO service_role;
ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentors manage own mentorships" ON public.mentorships FOR ALL TO authenticated
  USING (auth.uid() = mentor_id) WITH CHECK (auth.uid() = mentor_id);
CREATE POLICY "Mentees view own mentorship" ON public.mentorships FOR SELECT TO authenticated
  USING (auth.uid() = mentee_id);
CREATE POLICY "Admins view mentorships" ON public.mentorships FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER mentorships_updated_at BEFORE UPDATE ON public.mentorships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.mentor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL,
  mentorship_id uuid REFERENCES public.mentorships(id) ON DELETE SET NULL,
  mentee_name text NOT NULL,
  topic text NOT NULL,
  session_type text NOT NULL DEFAULT 'Video Call',
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  meeting_url text,
  status text NOT NULL DEFAULT 'confirmed',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentor_sessions TO authenticated;
GRANT ALL ON public.mentor_sessions TO service_role;
ALTER TABLE public.mentor_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentors manage own sessions" ON public.mentor_sessions FOR ALL TO authenticated
  USING (auth.uid() = mentor_id) WITH CHECK (auth.uid() = mentor_id);
CREATE POLICY "Admins view mentor sessions" ON public.mentor_sessions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER mentor_sessions_updated_at BEFORE UPDATE ON public.mentor_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.mentorship_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid,
  requester_id uuid NOT NULL,
  founder_name text NOT NULL,
  contact_email text NOT NULL,
  startup_name text,
  sector text,
  stage text,
  challenge text NOT NULL,
  match_score integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  mentor_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentorship_requests TO authenticated;
GRANT ALL ON public.mentorship_requests TO service_role;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Requesters create requests" ON public.mentorship_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Requesters view own requests" ON public.mentorship_requests FOR SELECT TO authenticated
  USING (auth.uid() = requester_id);
CREATE POLICY "Mentors view assigned requests" ON public.mentorship_requests FOR SELECT TO authenticated
  USING (auth.uid() = mentor_id OR (mentor_id IS NULL AND public.has_role(auth.uid(), 'mentor')));
CREATE POLICY "Mentors update assigned requests" ON public.mentorship_requests FOR UPDATE TO authenticated
  USING (auth.uid() = mentor_id OR (mentor_id IS NULL AND public.has_role(auth.uid(), 'mentor')))
  WITH CHECK (auth.uid() = mentor_id OR (mentor_id IS NULL AND public.has_role(auth.uid(), 'mentor')));
CREATE POLICY "Admins manage mentorship requests" ON public.mentorship_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER mentorship_requests_updated_at BEFORE UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

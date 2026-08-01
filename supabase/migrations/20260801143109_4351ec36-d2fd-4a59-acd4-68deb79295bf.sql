ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS robots_txt text,
  ADD COLUMN IF NOT EXISTS sitemap_extra_paths text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS sitemap_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS draft_settings jsonb,
  ADD COLUMN IF NOT EXISTS has_draft boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.site_settings_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_id uuid REFERENCES public.site_settings(id) ON DELETE CASCADE,
  snapshot jsonb NOT NULL,
  note text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.site_settings_versions TO authenticated;
GRANT ALL ON public.site_settings_versions TO service_role;
ALTER TABLE public.site_settings_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read version history"
  ON public.site_settings_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can create versions"
  ON public.site_settings_versions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  url text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  folder text NOT NULL DEFAULT 'general',
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view media" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Admins can insert media" ON public.media_assets FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update media" ON public.media_assets FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete media" ON public.media_assets FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_media_assets_updated_at BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
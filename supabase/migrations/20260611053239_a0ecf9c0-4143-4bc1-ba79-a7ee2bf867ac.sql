
-- Partners: add slug + category + tagline
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS tagline TEXT;

-- Backfill slugs for any existing rows
UPDATE public.partners
SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) || '-' || substr(id::text, 1, 6)
WHERE slug IS NULL OR slug = '';

ALTER TABLE public.partners
  ADD CONSTRAINT partners_slug_key UNIQUE (slug);

-- Blogs SEO fields
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS og_image_url TEXT;

-- News SEO fields
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS og_image_url TEXT;

-- Applications: review notes + reviewed_at + updated_at
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const setMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
};

/**
 * Applies the CMS-managed site settings (title, description, favicon, social
 * preview) to the document head. Per-page Helmet tags still override these.
 */
const SiteMeta = () => {
  const { data } = useSiteSettings();

  useEffect(() => {
    if (!data) return;

    const title = data.meta_title || data.site_name;
    const description = data.meta_description || data.tagline || "";

    document.title = title;
    if (description) {
      setMeta('meta[name="description"]', { name: "description", content: description });
      setMeta('meta[property="og:description"]', { property: "og:description", content: description });
      setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    }
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    if (data.og_image_url) {
      setMeta('meta[property="og:image"]', { property: "og:image", content: data.og_image_url });
      setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: data.og_image_url });
    }
    if (data.twitter_handle) {
      setMeta('meta[name="twitter:site"]', { name: "twitter:site", content: data.twitter_handle });
    }

    if (data.favicon_url) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = data.favicon_url;
    }
  }, [data]);

  return null;
};

export default SiteMeta;

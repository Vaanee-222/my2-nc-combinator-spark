/**
 * Builders for the public sitemap.xml and robots.txt.
 * Pure and dependency-free so both the admin CMS preview and the
 * build-time generator script (scripts/generate-sitemap.ts) share them.
 */

export interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

/** Public, indexable routes declared in src/App.tsx (auth/admin routes excluded). */
export const STATIC_SITEMAP_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/philosophy", changefreq: "monthly", priority: "0.5" },
  { path: "/incubation", changefreq: "weekly", priority: "0.9" },
  { path: "/mvp-lab", changefreq: "weekly", priority: "0.8" },
  { path: "/xi-lab", changefreq: "weekly", priority: "0.8" },
  { path: "/hackathon", changefreq: "weekly", priority: "0.8" },
  { path: "/resources", changefreq: "monthly", priority: "0.6" },
  { path: "/partnership", changefreq: "monthly", priority: "0.6" },
  { path: "/partners", changefreq: "monthly", priority: "0.6" },
  { path: "/startup-directory", changefreq: "weekly", priority: "0.7" },
  { path: "/featured-startups", changefreq: "weekly", priority: "0.7" },
  { path: "/monthly-top-10", changefreq: "monthly", priority: "0.7" },
  { path: "/quarterly-top-5", changefreq: "monthly", priority: "0.7" },
  { path: "/current-cohort", changefreq: "monthly", priority: "0.7" },
  { path: "/success-stories", changefreq: "monthly", priority: "0.6" },
  { path: "/investor-centre", changefreq: "weekly", priority: "0.7" },
  { path: "/deals", changefreq: "weekly", priority: "0.6" },
  { path: "/cloud-credits", changefreq: "monthly", priority: "0.5" },
  { path: "/grants-funding", changefreq: "monthly", priority: "0.6" },
  { path: "/blogs", changefreq: "weekly", priority: "0.7" },
  { path: "/news", changefreq: "daily", priority: "0.7" },
  { path: "/meet-cofounder", changefreq: "weekly", priority: "0.6" },
  { path: "/become-mentor", changefreq: "monthly", priority: "0.5" },
  { path: "/past-events", changefreq: "monthly", priority: "0.5" },
  { path: "/subscription", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-conditions", changefreq: "yearly", priority: "0.3" },
];

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const normalizePath = (path: string) => {
  const trimmed = path.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

export function buildSitemapXml(baseUrl: string, entries: SitemapEntry[]): string {
  const base = baseUrl.replace(/\/+$/, "");
  const seen = new Set<string>();
  const urls: string[] = [];

  for (const entry of entries) {
    const path = normalizePath(entry.path);
    if (!path || seen.has(path)) continue;
    seen.add(path);
    urls.push(
      [
        "  <url>",
        `    <loc>${escapeXml(`${base}${path === "/" ? "/" : path}`)}</loc>`,
        entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
        entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
        entry.priority ? `    <priority>${entry.priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
  ].join("\n");
}

export const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /

Disallow: /admin-dashboard
Disallow: /admin-workflow
Disallow: /messages`;

export function buildRobotsTxt(options: {
  body?: string | null;
  baseUrl?: string;
  sitemapEnabled?: boolean;
}): string {
  const body = (options.body?.trim() || DEFAULT_ROBOTS_TXT).replace(/^Sitemap:.*$/gim, "").trimEnd();
  if (!options.sitemapEnabled) return `${body}\n`;
  const base = (options.baseUrl || "").replace(/\/+$/, "");
  return `${body}\n\nSitemap: ${base}/sitemap.xml\n`;
}

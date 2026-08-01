// Generates public/sitemap.xml and public/robots.txt from the Website CMS
// configuration plus published database content.
// Runs before `vite dev` and `vite build` via the predev/prebuild hooks.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import {
  STATIC_SITEMAP_ENTRIES,
  buildRobotsTxt,
  buildSitemapXml,
  normalizePath,
  type SitemapEntry,
} from "../src/lib/seoFiles";

const BASE_URL = process.env.SITE_BASE_URL || "https://xicombinator.lovable.app";

function loadEnv() {
  const path = resolve(".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

async function fetchTable(table: string, query: string): Promise<any[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return [];
    return (await res.json()) as any[];
  } catch {
    return [];
  }
}

async function main() {
  loadEnv();

  const [settings] = await fetchTable("site_settings", "select=*&limit=1");
  const sitemapEnabled = settings?.sitemap_enabled ?? true;

  const entries: SitemapEntry[] = [...STATIC_SITEMAP_ENTRIES];

  for (const extra of (settings?.sitemap_extra_paths ?? []) as string[]) {
    const path = normalizePath(extra);
    if (path) entries.push({ path, changefreq: "monthly", priority: "0.5" });
  }

  const [blogs, news, partners] = await Promise.all([
    fetchTable("blogs", "select=slug,updated_at&is_published=eq.true"),
    fetchTable("news", "select=slug,updated_at&is_published=eq.true"),
    fetchTable("partners", "select=slug,updated_at"),
  ]);

  const lastmod = (row: any) => (row.updated_at ? String(row.updated_at).slice(0, 10) : undefined);

  for (const b of blogs) if (b.slug) entries.push({ path: `/blog/${b.slug}`, changefreq: "monthly", priority: "0.6", lastmod: lastmod(b) });
  for (const n of news) if (n.slug) entries.push({ path: `/news/${n.slug}`, changefreq: "weekly", priority: "0.6", lastmod: lastmod(n) });
  for (const p of partners) if (p.slug) entries.push({ path: `/partners/${p.slug}`, changefreq: "monthly", priority: "0.5", lastmod: lastmod(p) });

  if (sitemapEnabled) {
    writeFileSync(resolve("public/sitemap.xml"), buildSitemapXml(BASE_URL, entries));
    console.log(`sitemap.xml written (${entries.length} entries)`);
  } else {
    console.log("sitemap disabled in Website CMS - skipping sitemap.xml");
  }

  writeFileSync(
    resolve("public/robots.txt"),
    buildRobotsTxt({ body: settings?.robots_txt, baseUrl: BASE_URL, sitemapEnabled }),
  );
  console.log("robots.txt written");
}

main();

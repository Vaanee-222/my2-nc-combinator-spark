import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  STATIC_SITEMAP_ENTRIES,
  buildSitemapXml,
  buildRobotsTxt,
  normalizePath,
  DEFAULT_ROBOTS_TXT,
} from "@/lib/seoFiles";

const appSource = fs.readFileSync(path.resolve(__dirname, "../App.tsx"), "utf8");
const declaredRoutes = new Set(
  Array.from(appSource.matchAll(/path="([^"]+)"/g)).map((m) => m[1]),
);

describe("sitemap entries", () => {
  it("TC-SM-01 contains no duplicate paths", () => {
    const paths = STATIC_SITEMAP_ENTRIES.map((e) => e.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("TC-SM-02 only lists paths that exist as routes", () => {
    const missing = STATIC_SITEMAP_ENTRIES.map((e) => e.path).filter((p) => !declaredRoutes.has(p));
    expect(missing, `sitemap paths without routes: ${missing.join(", ")}`).toEqual([]);
  });

  it("TC-SM-03 never exposes authenticated or admin routes", () => {
    const priv = ["/admin-dashboard", "/admin-workflow", "/messages", "/application-status", "/user-dashboard"];
    const leaked = STATIC_SITEMAP_ENTRIES.map((e) => e.path).filter((p) => priv.includes(p));
    expect(leaked).toEqual([]);
  });

  it("TC-SM-04 uses valid priorities between 0.0 and 1.0", () => {
    for (const e of STATIC_SITEMAP_ENTRIES) {
      const p = Number(e.priority);
      expect(Number.isFinite(p)).toBe(true);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    }
  });
});

describe("buildSitemapXml", () => {
  it("TC-SX-01 emits a valid urlset with absolute locs", () => {
    const xml = buildSitemapXml("https://example.com/", [{ path: "/about" }]);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain("<loc>https://example.com/about</loc>");
    expect(xml.trim().endsWith("</urlset>")).toBe(true);
  });

  it("TC-SX-02 dedupes repeated paths", () => {
    const xml = buildSitemapXml("https://x.io", [{ path: "/a" }, { path: "a" }]);
    expect(xml.match(/<loc>/g)?.length).toBe(1);
  });

  it("TC-SX-03 escapes XML-unsafe characters in URLs", () => {
    const xml = buildSitemapXml("https://x.io", [{ path: "/search?q=a&b=c" }]);
    expect(xml).toContain("&amp;");
    expect(xml).not.toMatch(/q=a&b=c/);
  });

  it("TC-SX-04 omits optional tags when not provided", () => {
    const xml = buildSitemapXml("https://x.io", [{ path: "/a" }]);
    expect(xml).not.toContain("<priority>");
    expect(xml).not.toContain("<lastmod>");
  });

  it("TC-SX-05 normalizePath adds a leading slash and rejects blanks", () => {
    expect(normalizePath("about")).toBe("/about");
    expect(normalizePath("/about")).toBe("/about");
    expect(normalizePath("   ")).toBe("");
  });
});

describe("buildRobotsTxt", () => {
  it("TC-RB-01 falls back to the default body", () => {
    const txt = buildRobotsTxt({ sitemapEnabled: false });
    expect(txt.trim()).toBe(DEFAULT_ROBOTS_TXT.trim());
  });

  it("TC-RB-02 appends exactly one Sitemap line when enabled", () => {
    const txt = buildRobotsTxt({ baseUrl: "https://x.io/", sitemapEnabled: true });
    expect(txt.match(/^Sitemap:/gm)?.length).toBe(1);
    expect(txt).toContain("Sitemap: https://x.io/sitemap.xml");
  });

  it("TC-RB-03 strips a user-supplied Sitemap line to avoid duplicates", () => {
    const txt = buildRobotsTxt({
      body: "User-agent: *\nAllow: /\nSitemap: https://old.example/sitemap.xml",
      baseUrl: "https://x.io",
      sitemapEnabled: true,
    });
    expect(txt).not.toContain("old.example");
    expect(txt.match(/^Sitemap:/gm)?.length).toBe(1);
  });

  it("TC-RB-04 keeps admin routes disallowed by default", () => {
    const txt = buildRobotsTxt({ sitemapEnabled: true, baseUrl: "https://x.io" });
    expect(txt).toContain("Disallow: /admin-dashboard");
  });
});

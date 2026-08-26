import { describe, it, expect } from "vitest";
import { searchIndex, searchEntries } from "@/lib/searchIndex";
import fs from "node:fs";
import path from "node:path";

const appSource = fs.readFileSync(path.resolve(__dirname, "../App.tsx"), "utf8");
const declaredRoutes = new Set(
  Array.from(appSource.matchAll(/path="([^"]+)"/g)).map((m) => m[1]),
);

describe("searchIndex data integrity", () => {
  it("TC-SI-01 has no duplicate paths", () => {
    const paths = searchIndex.map((e) => e.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("TC-SI-02 every entry has a title, description and at least one keyword", () => {
    for (const e of searchIndex) {
      expect(e.title.trim().length, `title for ${e.path}`).toBeGreaterThan(0);
      expect(e.description.trim().length, `description for ${e.path}`).toBeGreaterThan(0);
      expect(e.keywords.length, `keywords for ${e.path}`).toBeGreaterThan(0);
    }
  });

  it("TC-SI-03 every indexed path resolves to a declared route (no dead search results)", () => {
    const dead = searchIndex.map((e) => e.path).filter((p) => !declaredRoutes.has(p));
    expect(dead, `dead search paths: ${dead.join(", ")}`).toEqual([]);
  });
});

describe("searchEntries ranking", () => {
  it("TC-SE-01 returns nothing for an empty or whitespace query", () => {
    expect(searchEntries("")).toEqual([]);
    expect(searchEntries("   ")).toEqual([]);
  });

  it("TC-SE-02 matches are case-insensitive", () => {
    expect(searchEntries("HACKATHON").length).toBeGreaterThan(0);
    expect(searchEntries("hackathon").length).toBe(searchEntries("HACKATHON").length);
  });

  it("TC-SE-03 ranks a title hit above a keyword-only hit", () => {
    const results = searchEntries("mentor");
    expect(results[0].title.toLowerCase()).toContain("mentor");
  });

  it("TC-SE-04 finds pages via keyword synonyms only", () => {
    expect(searchEntries("co-founder").some((r) => r.path === "/meet-cofounder")).toBe(true);
    expect(searchEntries("gdpr").some((r) => r.path === "/privacy-policy")).toBe(true);
  });

  it("TC-SE-05 returns an empty list for an unknown term", () => {
    expect(searchEntries("zzzz-not-a-real-term")).toEqual([]);
  });
});

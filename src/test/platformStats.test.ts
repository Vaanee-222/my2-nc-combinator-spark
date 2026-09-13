import { describe, it, expect } from "vitest";
import {
  PLATFORM_STATS,
  PLATFORM_STAT_LABELS,
  validatePlatformStats,
} from "@/lib/platformStats";
import fs from "node:fs";
import path from "node:path";

describe("platformStats consistency", () => {
  it("labels agree with numeric source of truth", () => {
    expect(() => validatePlatformStats()).not.toThrow();
  });

  it("exports matching keys on both records", () => {
    // Every displayed label must trace back to a numeric stat.
    expect(Object.keys(PLATFORM_STATS).length).toBeGreaterThan(0);
    expect(Object.keys(PLATFORM_STAT_LABELS).length).toBeGreaterThan(0);
  });

  it("detects drift", () => {
    const original = (PLATFORM_STAT_LABELS as any).startupsAccelerated;
    (PLATFORM_STAT_LABELS as any).startupsAccelerated = "999+";
    expect(() => validatePlatformStats()).toThrow(/Label drift/);
    (PLATFORM_STAT_LABELS as any).startupsAccelerated = original;
  });

  it("keeps key public pages connected to the canonical platform stats", () => {
    const pages = ["AboutUs.tsx", "Incubation.tsx", "StartupDirectory.tsx", "InvestorCentre.tsx"];
    for (const page of pages) {
      const source = fs.readFileSync(path.resolve(process.cwd(), "src/pages", page), "utf8");
      expect(source, `${page} should use canonical platform stats`).toContain("PLATFORM_STAT_LABELS");
    }
  });

  it("contains no malformed currency examples or dollar values with Indian comma grouping", () => {
    const roots = [path.resolve(process.cwd(), "src")];
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== "test") walk(full);
        else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
      }
    };
    roots.forEach(walk);
    const source = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
    expect(source).not.toMatch(/\$\d{1,2},\d{2},\d{3}/);
    expect(source).not.toContain("$250Kores");
  });
});

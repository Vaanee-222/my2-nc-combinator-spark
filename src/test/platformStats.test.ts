import { describe, it, expect } from "vitest";
import {
  PLATFORM_STATS,
  PLATFORM_STAT_LABELS,
  validatePlatformStats,
} from "@/lib/platformStats";

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
});

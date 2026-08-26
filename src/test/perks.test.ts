import { describe, it, expect } from "vitest";
import { PERKS, introQuotaForLevel } from "@/hooks/usePerks";

describe("perk ladder", () => {
  it("TC-PK-01 has unique perk keys", () => {
    const keys = PERKS.map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("TC-PK-02 unlock levels stay within the 1-5 ladder and are ordered", () => {
    const levels = PERKS.map((p) => p.level);
    expect(Math.min(...levels)).toBeGreaterThanOrEqual(1);
    expect(Math.max(...levels)).toBeLessThanOrEqual(5);
    expect([...levels].sort((a, b) => a - b)).toEqual(levels);
  });

  it("TC-PK-03 every perk has a label and description", () => {
    for (const p of PERKS) {
      expect(p.label.trim().length, p.key).toBeGreaterThan(0);
      expect(p.description.trim().length, p.key).toBeGreaterThan(0);
    }
  });
});

describe("introQuotaForLevel", () => {
  it("TC-PK-04 levels 1-2 get no free intros", () => {
    expect(introQuotaForLevel(1)).toBe(0);
    expect(introQuotaForLevel(2)).toBe(0);
  });

  it("TC-PK-05 level 3 gets one, level 4 gets three", () => {
    expect(introQuotaForLevel(3)).toBe(1);
    expect(introQuotaForLevel(4)).toBe(3);
  });

  it("TC-PK-06 level 5+ is unlimited", () => {
    expect(introQuotaForLevel(5)).toBe(Infinity);
    expect(introQuotaForLevel(9)).toBe(Infinity);
  });

  it("TC-PK-07 is defensive against invalid levels", () => {
    expect(introQuotaForLevel(0)).toBe(0);
    expect(introQuotaForLevel(-3)).toBe(0);
  });

  it("TC-PK-08 the free_intro perk level agrees with the quota ladder", () => {
    const perk = PERKS.find((p) => p.key === "free_intro")!;
    expect(introQuotaForLevel(perk.level)).toBeGreaterThan(0);
    expect(introQuotaForLevel(perk.level - 1)).toBe(0);
  });
});

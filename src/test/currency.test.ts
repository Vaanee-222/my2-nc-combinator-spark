import { describe, it, expect, beforeEach } from "vitest";
import {
  SUPPORTED_CURRENCIES,
  FALLBACK_RATES,
  CURRENCY_META,
  convert,
  formatMoney,
  getRate,
} from "@/lib/currency";

beforeEach(() => localStorage.clear());

describe("currency configuration", () => {
  it("TC-CU-01 every supported currency has a rate and display metadata", () => {
    for (const code of SUPPORTED_CURRENCIES) {
      expect(FALLBACK_RATES[code], `rate for ${code}`).toBeGreaterThan(0);
      expect(CURRENCY_META[code]?.symbol.length, `symbol for ${code}`).toBeGreaterThan(0);
      expect(CURRENCY_META[code]?.locale, `locale for ${code}`).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
    }
  });

  it("TC-CU-02 USD is the base currency at rate 1", () => {
    expect(FALLBACK_RATES.USD).toBe(1);
    expect(getRate("USD")).toBe(1);
  });
});

describe("convert", () => {
  it("TC-CU-03 leaves USD amounts unchanged", () => {
    expect(convert(1500, "USD")).toBe(1500);
  });

  it("TC-CU-04 applies the fallback rate for other currencies", () => {
    expect(convert(100, "INR")).toBeCloseTo(100 * FALLBACK_RATES.INR, 5);
  });

  it("TC-CU-05 handles zero and negative amounts without NaN", () => {
    expect(convert(0, "EUR")).toBe(0);
    expect(convert(-50, "EUR")).toBeCloseTo(-50 * FALLBACK_RATES.EUR, 5);
  });
});

describe("formatMoney", () => {
  it("TC-CU-06 renders a currency-prefixed string with no decimals by default", () => {
    const out = formatMoney(1500, "USD");
    expect(out).toContain("1,500");
    expect(out).not.toContain(".");
  });

  it("TC-CU-07 supports compact notation for large values", () => {
    expect(formatMoney(1_200_000_000, "USD", { compact: true })).toMatch(/1\.2B/);
  });

  it("TC-CU-08 never returns NaN for any supported currency", () => {
    for (const code of SUPPORTED_CURRENCIES) {
      expect(formatMoney(1000, code)).not.toMatch(/NaN/);
    }
  });
});

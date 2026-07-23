// Global currency conversion with live FX rates.
// Base currency: USD. Rates cached in localStorage and refreshed periodically
// from exchangerate-api.com when an API key is configured in Admin > Configuration > Currency.

export const SUPPORTED_CURRENCIES = ["USD", "INR", "EUR", "GBP", "SGD", "AED", "AUD", "CAD", "JPY"] as const;
export type CurrencyCode = typeof SUPPORTED_CURRENCIES[number];

// Fallback static rates (approx). Used until a live fetch succeeds.
export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  SGD: 1.34,
  AED: 3.67,
  AUD: 1.52,
  CAD: 1.36,
  JPY: 156,
};

export const CURRENCY_META: Record<CurrencyCode, { symbol: string; name: string; locale: string }> = {
  USD: { symbol: "$",   name: "US Dollar",           locale: "en-US" },
  INR: { symbol: "₹",   name: "Indian Rupee",        locale: "en-IN" },
  EUR: { symbol: "€",   name: "Euro",                locale: "de-DE" },
  GBP: { symbol: "£",   name: "British Pound",       locale: "en-GB" },
  SGD: { symbol: "S$",  name: "Singapore Dollar",    locale: "en-SG" },
  AED: { symbol: "د.إ", name: "UAE Dirham",          locale: "en-AE" },
  AUD: { symbol: "A$",  name: "Australian Dollar",   locale: "en-AU" },
  CAD: { symbol: "C$",  name: "Canadian Dollar",     locale: "en-CA" },
  JPY: { symbol: "¥",   name: "Japanese Yen",        locale: "ja-JP" },
};

const RATES_CACHE_KEY = "xi.fx.rates.v1";
const API_KEY_STORAGE = "xi.fx.apiKey";
// Default embedded key (user-supplied). Admins can override in Configuration > Currency.
const DEFAULT_API_KEY = "bb1b109d19268225ece96fe6";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

type RatesCache = { fetchedAt: number; rates: Record<string, number> };

let liveRates: Record<string, number> | null = null;

export const getFxApiKey = (): string => {
  if (typeof window === "undefined") return DEFAULT_API_KEY;
  return localStorage.getItem(API_KEY_STORAGE) || DEFAULT_API_KEY;
};

export const setFxApiKey = (key: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(API_KEY_STORAGE, key);
};

const loadCachedRates = (): RatesCache | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RATES_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RatesCache;
  } catch {
    return null;
  }
};

const saveCachedRates = (rates: Record<string, number>) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), rates }));
  } catch {}
};

export const getRate = (code: CurrencyCode): number => {
  if (liveRates && typeof liveRates[code] === "number") return liveRates[code];
  const cached = loadCachedRates();
  if (cached?.rates?.[code]) return cached.rates[code];
  return FALLBACK_RATES[code];
};

export async function fetchLiveRates(force = false): Promise<Record<string, number> | null> {
  const cached = loadCachedRates();
  if (!force && cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    liveRates = cached.rates;
    return cached.rates;
  }
  const key = getFxApiKey();
  if (!key) return null;
  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
    if (!res.ok) throw new Error(`FX HTTP ${res.status}`);
    const data = await res.json();
    if (data?.result !== "success" || !data.conversion_rates) {
      throw new Error(data?.["error-type"] || "FX response invalid");
    }
    liveRates = data.conversion_rates;
    saveCachedRates(data.conversion_rates);
    return data.conversion_rates;
  } catch (err) {
    console.warn("[fx] fetch failed, using cached/fallback rates", err);
    if (cached?.rates) { liveRates = cached.rates; return cached.rates; }
    return null;
  }
}

export function convert(amountUsd: number, to: CurrencyCode): number {
  return amountUsd * getRate(to);
}

export function formatMoney(amountUsd: number, currency: CurrencyCode, opts: { compact?: boolean } = {}): string {
  const value = convert(amountUsd, currency);
  const meta = CURRENCY_META[currency];
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency,
      maximumFractionDigits: opts.compact ? 1 : 0,
      notation: opts.compact ? "compact" : "standard",
    }).format(value);
  } catch {
    return `${meta.symbol}${Math.round(value).toLocaleString()}`;
  }
}

// Static FX rates (approx Q2 2026). Update periodically.
// Base: USD = 1
export const FX_RATES = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  SGD: 1.34,
} as const;

export type CurrencyCode = keyof typeof FX_RATES;

export const CURRENCY_META: Record<CurrencyCode, { symbol: string; name: string; locale: string }> = {
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  INR: { symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
  SGD: { symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
};

export function convert(amountUsd: number, to: CurrencyCode): number {
  return amountUsd * FX_RATES[to];
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

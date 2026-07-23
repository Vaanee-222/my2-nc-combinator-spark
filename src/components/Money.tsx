import { useCurrency } from "@/contexts/CurrencyContext";
import { formatMoney } from "@/lib/currency";

interface MoneyProps {
  /** USD base amount */
  usd: number;
  compact?: boolean;
  className?: string;
}

/**
 * Renders a USD-base amount converted to the user's selected currency.
 * Re-renders when live FX rates land (ratesVersion bumps).
 */
export const Money = ({ usd, compact, className }: MoneyProps) => {
  const { currency, ratesVersion } = useCurrency();
  // ratesVersion is read so React re-renders after a live fetch updates rates.
  void ratesVersion;
  return <span className={className}>{formatMoney(usd, currency, { compact })}</span>;
};

export default Money;

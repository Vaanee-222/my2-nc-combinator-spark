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
 */
export const Money = ({ usd, compact, className }: MoneyProps) => {
  const { currency } = useCurrency();
  return <span className={className}>{formatMoney(usd, currency, { compact })}</span>;
};

export default Money;

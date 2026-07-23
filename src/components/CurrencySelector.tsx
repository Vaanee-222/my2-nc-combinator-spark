import { useCurrency } from "@/contexts/CurrencyContext";
import { CURRENCY_META, SUPPORTED_CURRENCIES, type CurrencyCode } from "@/lib/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const CurrencySelector = ({ className }: { className?: string }) => {
  const { currency, setCurrency } = useCurrency();
  return (
    <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
      <SelectTrigger
        className={`h-9 w-[104px] text-xs gap-1 ${className ?? ""}`}
        aria-label="Select currency"
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_CURRENCIES.map((c) => (
          <SelectItem key={c} value={c}>
            <span className="font-medium">{c}</span>
            <span className="text-muted-foreground ml-2 text-xs">{CURRENCY_META[c].symbol}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;

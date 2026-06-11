import { useCurrency } from "@/contexts/CurrencyContext";
import { CURRENCY_META, type CurrencyCode } from "@/lib/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign } from "lucide-react";

const CODES: CurrencyCode[] = ["USD", "INR", "EUR", "GBP", "SGD"];

const CurrencySelector = ({ className }: { className?: string }) => {
  const { currency, setCurrency } = useCurrency();
  return (
    <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
      <SelectTrigger
        className={`h-9 w-[88px] text-xs gap-1 ${className ?? ""}`}
        aria-label="Select currency"
      >
        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CODES.map((c) => (
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

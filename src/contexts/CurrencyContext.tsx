import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { CurrencyCode } from "@/lib/currency";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "xi.currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  setCurrency: () => {},
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as CurrencyCode | null;
    if (stored && ["USD", "INR", "EUR", "GBP", "SGD"].includes(stored)) {
      setCurrencyState(stored);
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try { localStorage.setItem(STORAGE_KEY, c); } catch {}
    try { trackEvent("currency_changed", { currency: c }); } catch {}
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

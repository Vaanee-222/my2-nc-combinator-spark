import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SUPPORTED_CURRENCIES, fetchLiveRates, type CurrencyCode } from "@/lib/currency";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "xi.currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  ratesVersion: number;   // bumps when live rates land, so consumers can re-render
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  setCurrency: () => {},
  ratesVersion: 0,
  refreshRates: async () => {},
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [ratesVersion, setRatesVersion] = useState(0);

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as CurrencyCode | null;
    if (stored && (SUPPORTED_CURRENCIES as readonly string[]).includes(stored)) {
      setCurrencyState(stored);
    }
    // Kick off live FX fetch (uses cache if fresh).
    fetchLiveRates().then((r) => { if (r) setRatesVersion((v) => v + 1); });
  }, []);

  const refreshRates = async () => {
    const r = await fetchLiveRates(true);
    if (r) setRatesVersion((v) => v + 1);
  };

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try { localStorage.setItem(STORAGE_KEY, c); } catch {}
    try { trackEvent("currency_changed", { currency: c }); } catch {}
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, ratesVersion, refreshRates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

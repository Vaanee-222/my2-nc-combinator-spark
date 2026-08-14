import { useEffect, useState } from "react";

/** Persists the active dashboard tab so switching windows never resets the view. */
export const useDashboardTab = (key: string, fallback: string) => {
  const [tab, setTab] = useState(() => localStorage.getItem(key) || fallback);

  useEffect(() => {
    localStorage.setItem(key, tab);
  }, [key, tab]);

  return [tab, setTab] as const;
};

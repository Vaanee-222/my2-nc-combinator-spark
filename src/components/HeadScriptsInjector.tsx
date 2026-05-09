import { useEffect } from "react";
import { applyCustomHeadScripts, STORAGE_KEY } from "@/lib/sanitizeHeadScripts";

const HeadScriptsInjector = () => {
  useEffect(() => {
    const apply = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY) || "";
        applyCustomHeadScripts(raw);
      } catch {
        // ignore
      }
    };
    apply();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) apply();
    };
    const onCustom = () => apply();
    window.addEventListener("storage", onStorage);
    window.addEventListener("custom-head-scripts-updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("custom-head-scripts-updated", onCustom);
    };
  }, []);
  return null;
};

export default HeadScriptsInjector;

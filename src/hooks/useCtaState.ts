import { useCallback, useEffect, useState } from "react";

/**
 * Persistent per-user CTA action state.
 * Tracks whether the current browser has completed an action for a given key
 * (e.g. "apply:Xi Lab", "connect:startup:42", "intro:investor:sequoia").
 *
 * Stored in localStorage under `cta-state:v1` so state survives reloads and
 * lets buttons render an "acted" variant (color + label change) consistently.
 */
const STORAGE_KEY = "cta-state:v1";
const EVENT = "cta-state-change";

type Store = Record<string, { at: number }>;

function read(): Store {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function write(s: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useCtaState(key: string) {
  const [acted, setActed] = useState<boolean>(() => !!read()[key]);

  useEffect(() => {
    const sync = () => setActed(!!read()[key]);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const mark = useCallback(() => {
    const s = read();
    s[key] = { at: Date.now() };
    write(s);
  }, [key]);

  const clear = useCallback(() => {
    const s = read();
    delete s[key];
    write(s);
  }, [key]);

  return { acted, mark, clear };
}

export function markCta(key: string) {
  const s = read();
  s[key] = { at: Date.now() };
  write(s);
}

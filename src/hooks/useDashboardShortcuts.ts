import { useEffect } from "react";

const isTypingTarget = (el: EventTarget | null) => {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || node.isContentEditable;
};

/**
 * Dashboard keyboard shortcuts:
 * - `g` then 1..9 jumps to the nth pane
 * - `/` focuses the first search input on the page
 */
export const useDashboardShortcuts = (values: string[], onChange: (value: string) => void) => {
  useEffect(() => {
    let awaitingGoto = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const resetGoto = () => {
      awaitingGoto = false;
      if (timer) clearTimeout(timer);
    };

    const handler = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      if (event.key === "/") {
        const input = document.querySelector<HTMLInputElement>(
          'input[type="search"], input[placeholder*="Search" i], input[aria-label*="Search" i]',
        );
        if (input) {
          event.preventDefault();
          input.focus();
          input.select?.();
        }
        return;
      }

      if (awaitingGoto) {
        const index = Number(event.key) - 1;
        resetGoto();
        if (!Number.isNaN(index) && index >= 0 && index < values.length) {
          event.preventDefault();
          onChange(values[index]);
        }
        return;
      }

      if (event.key === "g") {
        awaitingGoto = true;
        timer = setTimeout(() => {
          awaitingGoto = false;
        }, 1500);
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (timer) clearTimeout(timer);
    };
  }, [values, onChange]);
};

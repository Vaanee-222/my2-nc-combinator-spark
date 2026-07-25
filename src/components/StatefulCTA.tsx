import * as React from "react";
import { Check } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useCtaState } from "@/hooks/useCtaState";
import { cn } from "@/lib/utils";

interface StatefulCTAProps extends Omit<ButtonProps, "children" | "onClick"> {
  /** Unique persistence key, e.g. `connect:startup:42` or `apply:Xi Lab`. */
  ctaKey: string;
  /** Label shown before action. */
  idleLabel: React.ReactNode;
  /** Label shown after action (default: "Sent"). */
  actedLabel?: React.ReactNode;
  /** Called when user clicks in the idle state. Marks acted after resolving. */
  onAct?: () => void | Promise<void>;
  /** If true, keep the button clickable after acting (e.g. to re-send). */
  reArmable?: boolean;
  showCheck?: boolean;
}

/**
 * Button that persists its "acted" state and switches color + label after use.
 * Use for Connect, Request Introduction, Claim Deal, Apply Now, etc.
 */
export const StatefulCTA = React.forwardRef<HTMLButtonElement, StatefulCTAProps>(
  (
    {
      ctaKey,
      idleLabel,
      actedLabel = "Sent",
      onAct,
      reArmable = false,
      showCheck = true,
      className,
      variant,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const { acted, mark } = useCtaState(ctaKey);

    const handleClick = async () => {
      if (acted && !reArmable) return;
      await onAct?.();
      mark();
    };

    return (
      <Button
        ref={ref}
        {...rest}
        variant={acted ? "secondary" : variant}
        disabled={disabled || (acted && !reArmable)}
        onClick={handleClick}
        aria-pressed={acted}
        className={cn(
          acted &&
            "bg-emerald-600/15 text-emerald-500 border border-emerald-600/40 hover:bg-emerald-600/20",
          className,
        )}
      >
        {acted ? (
          <span className="inline-flex items-center gap-1.5">
            {showCheck && <Check className="h-3.5 w-3.5" />}
            {actedLabel}
          </span>
        ) : (
          idleLabel
        )}
      </Button>
    );
  },
);
StatefulCTA.displayName = "StatefulCTA";

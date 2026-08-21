import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import { useMyPoints, levelProgress } from "@/hooks/useGamification";

/** Compact XP / level indicator shown in the dashboard header. */
const XPStrip = ({ className }: { className?: string }) => {
  const { data, isLoading } = useMyPoints();
  if (isLoading || !data) return null;

  const { current, next, pct, remaining } = levelProgress(data.total);

  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <Badge variant="secondary" className="px-1.5 py-0 text-[11px]">
            L{current.level} {current.name}
          </Badge>
        </span>
        <span>{data.total.toLocaleString()} XP</span>
      </div>
      <Progress value={pct} />
      <p className="mt-1 text-[11px] text-muted-foreground/80">
        {next ? `${remaining.toLocaleString()} XP to ${next.name}` : "Top level reached"}
      </p>
    </div>
  );
};

export default XPStrip;

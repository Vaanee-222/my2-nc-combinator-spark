import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles } from "lucide-react";
import { useEntitlements, type FeatureKey } from "@/hooks/useEntitlements";

type Props = {
  feature: FeatureKey;
  title: string;
  description?: string;
  children?: React.ReactNode;
  /** Render the locked notice inline instead of as a bordered panel. */
  compact?: boolean;
};

/**
 * Gate a surface behind a subscription tier. Renders children when the member
 * is entitled, otherwise an upgrade prompt pointing at the pricing page.
 */
const UpgradePrompt = ({ feature, title, description, children, compact }: Props) => {
  const { has, requiredTier, isLoading } = useEntitlements();

  if (isLoading || has(feature)) return <>{children ?? null}</>;

  const tier = requiredTier(feature);

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/20 p-3 text-sm">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">{title}</span>
        <Button asChild size="sm" variant="outline" className="ml-auto">
          <Link to="/subscription">Upgrade</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
      <Sparkles className="mx-auto mb-3 h-6 w-6 text-primary" />
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      {tier && (
        <Badge variant="outline" className="mt-3 capitalize">
          Requires {tier} plan
        </Badge>
      )}
      <div className="mt-4">
        <Button asChild size="sm">
          <Link to="/subscription">View plans</Link>
        </Button>
      </div>
    </div>
  );
};

export default UpgradePrompt;

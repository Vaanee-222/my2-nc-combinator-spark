import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, ArrowUpRight } from "lucide-react";
import { useEntitlements } from "@/hooks/useEntitlements";

const audienceLabel: Record<string, string> = {
  startup: "Startup plans",
  mentor: "Mentor plans",
  cofounder: "Co-founder plans",
  investor: "Investor plans",
};

const Quota = ({ label, used, limit }: { label: string; used: number; limit: number }) => {
  const unlimited = limit === Infinity;
  const pct = unlimited || limit === 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {unlimited ? "Unlimited" : `${used} / ${limit}`}
        </span>
      </div>
      {!unlimited && <Progress value={pct} className="h-1.5" />}
    </div>
  );
};

/** Current membership tier, monthly quota usage and the upgrade path. */
const PlanCard = () => {
  const { isLoading, audience, tier, planName, quotas, expiresAt } = useEntitlements();

  return (
    <Card className="border-border bg-card-gradient">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-primary" />
            Your plan
          </CardTitle>
          <CardDescription>
            {planName}
            {expiresAt ? ` · renews ${new Date(expiresAt).toLocaleDateString()}` : ""}
          </CardDescription>
        </div>
        <Badge variant={tier === "free" ? "outline" : "default"} className="capitalize">
          {tier}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <>
            <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
              <Quota label="Applications this month" used={quotas.applications.used} limit={quotas.applications.limit} />
              <Quota label="Investor intros this month" used={quotas.intros.used} limit={quotas.intros.limit} />
            </div>
            <Button asChild size="sm" variant={tier === "free" ? "default" : "outline"} className="w-full">
              <Link to="/subscription">
                {tier === "free" ? `Explore ${audienceLabel[audience] ?? "plans"}` : "Manage plan"}
                <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanCard;

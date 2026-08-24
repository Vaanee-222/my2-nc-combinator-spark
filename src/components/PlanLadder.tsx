import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Crown, Rocket, Users } from "lucide-react";
import { Money } from "@/components/Money";
import { usePlans, type Audience } from "@/hooks/useEntitlements";

const tierIcon = (tier?: string | null) => (tier === "premium" ? Crown : tier === "pro" ? Rocket : Users);

type Props = {
  audience: Audience;
  onSelect: (plan: { name: string; price: number }) => void;
};

/** Database-driven plan ladder for mentors, co-founders and investors. */
const PlanLadder = ({ audience, onSelect }: Props) => {
  const { data: plans, isLoading } = usePlans(audience);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-80 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!plans?.length) {
    return <p className="text-center text-muted-foreground">Plans for this audience are coming soon.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
      {plans.map((plan) => {
        const Icon = tierIcon(plan.tier);
        const price = Number(plan.price_usd ?? 0);
        return (
          <Card
            key={plan.id}
            className={`relative border transition-all duration-300 hover:scale-[1.02] ${
              plan.is_popular ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border bg-card"
            }`}
          >
            {plan.is_popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <Icon className="h-10 w-10 text-primary mx-auto mb-2" />
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                {price === 0 ? (
                  <span className="text-4xl font-bold text-foreground">Free</span>
                ) : (
                  <>
                    <Money usd={price} className="text-4xl font-bold text-foreground" />
                    <span className="text-muted-foreground">/{plan.billing_period ?? "month"}</span>
                  </>
                )}
              </div>
              <ul className="space-y-2 text-left mb-6">
                {(plan.features ?? []).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.is_popular ? "default" : "outline"}
                disabled={price === 0}
                onClick={() => onSelect({ name: plan.name, price })}
              >
                {price === 0 ? "Included by default" : `Choose ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PlanLadder;

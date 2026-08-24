import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, ListChecks, Activity, type LucideIcon } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useMyProfile, formatDate } from "@/hooks/useMyData";
import GamificationCard from "@/components/dashboard/GamificationCard";
import PerksCard from "@/components/dashboard/PerksCard";
import PlanCard from "@/components/dashboard/PlanCard";


export type Kpi = { label: string; value: ReactNode; hint?: string; icon?: LucideIcon };
export type NextStep = { id: string; label: string; description?: string; actionLabel: string; onAction: () => void; done?: boolean };

type Props = {
  kpis: Kpi[];
  steps: NextStep[];
  onOpenAccount: () => void;
  onOpenAlerts: () => void;
};

const DashboardOverview = ({ kpis, steps, onOpenAccount, onOpenAlerts }: Props) => {
  const { items } = useNotifications();
  const { data: profile } = useMyProfile();

  const filled = [profile?.full_name, profile?.email, profile?.phone, profile?.city, profile?.bio, profile?.avatar_url].filter(Boolean).length;
  const completion = Math.round((filled / 6) * 100);

  const allSteps: NextStep[] = [
    ...(completion < 100
      ? [
          {
            id: "profile",
            label: `Complete your profile (${completion}%)`,
            description: "A complete profile improves visibility across the platform.",
            actionLabel: "Update profile",
            onAction: onOpenAccount,
          },
        ]
      : []),
    ...steps,
  ];

  const pending = allSteps.filter((s) => !s.done);
  const recent = items.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kpis.slice(0, 3).map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="bg-card-gradient border-border">
              <CardContent className="flex items-center gap-4 p-6">
                {Icon && (
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  {kpi.hint && <p className="text-[11px] text-muted-foreground/80">{kpi.hint}</p>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="bg-card-gradient border-border lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="h-5 w-5 text-primary" />
              Next steps
              {pending.length > 0 && <Badge variant="secondary">{pending.length}</Badge>}
            </CardTitle>
            <CardDescription>The fastest way to move things forward today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {completion < 100 && (
              <div className="rounded-lg border border-border p-3">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Profile completeness</span>
                  <span>{completion}%</span>
                </div>
                <Progress value={completion} />
              </div>
            )}
            {pending.length === 0 ? (
              <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Nothing needs your attention right now.
              </div>
            ) : (
              pending.map((step) => (
                <div key={step.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{step.label}</p>
                    {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
                  </div>
                  <Button size="sm" variant="outline" onClick={step.onAction}>
                    {step.actionLabel}
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-card-gradient border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-primary" />
              Recent activity
            </CardTitle>
            <CardDescription>Latest updates across your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              recent.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium capitalize">{item.title}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/80">{formatDate(item.createdAt)}</p>
                </div>
              ))
            )}
            <Button variant="ghost" size="sm" className="w-full" onClick={onOpenAlerts}>
              View all alerts
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <GamificationCard />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerksCard />
        </div>
        <PlanCard />
      </div>

    </div>

  );
};

export default DashboardOverview;

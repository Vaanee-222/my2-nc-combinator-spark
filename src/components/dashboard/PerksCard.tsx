import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, Lock, CheckCircle2, Trophy } from "lucide-react";
import { usePerks } from "@/hooks/usePerks";

/** Level-gated perks and the remaining free intro quota for the signed-in member. */
const PerksCard = () => {
  const { isLoading, level, levelName, perks, intro } = usePerks();

  return (
    <Card className="border-border bg-card-gradient">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="h-5 w-5 text-primary" />
            Your perks
          </CardTitle>
          <CardDescription>Level {level} · {levelName}</CardDescription>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to="/leaderboard">
            <Trophy className="mr-2 h-3.5 w-3.5" />
            Leaderboard
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <>
            <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
              Free investor intros this month:{" "}
              <span className="font-semibold text-primary">
                {intro.quota === Infinity ? "Unlimited" : `${intro.remaining} of ${intro.quota}`}
              </span>
              {intro.quota === 0 && (
                <span className="text-muted-foreground"> — reach Level 3 to unlock one free intro each month.</span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {perks.map((perk) => (
                <div
                  key={perk.key}
                  className={`flex items-start gap-2 rounded-lg border p-3 ${
                    perk.unlocked ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20 opacity-60"
                  }`}
                >
                  {perk.unlocked ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{perk.label}</p>
                    <p className="text-xs text-muted-foreground">{perk.description}</p>
                    {!perk.unlocked && (
                      <Badge variant="outline" className="mt-1 text-[10px]">Level {perk.level}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PerksCard;

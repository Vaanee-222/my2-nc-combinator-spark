import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award, Rocket, Layers, Tag, Gift, Users, Handshake, GraduationCap, TrendingUp,
  CalendarCheck, Medal, Sparkles, Star, Zap, Crown, Flame, CheckCircle2, ArrowRight, Target,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyBadges, useMyStreak, useWeeklyQuests } from "@/hooks/useGamification";

const ICONS: Record<string, LucideIcon> = {
  rocket: Rocket, layers: Layers, tag: Tag, gift: Gift, users: Users, handshake: Handshake,
  "graduation-cap": GraduationCap, "trending-up": TrendingUp, "calendar-check": CalendarCheck,
  medal: Medal, sparkles: Sparkles, star: Star, zap: Zap, crown: Crown, award: Award,
};

/** Weekly quests, streak and earned badges — the Phase 2 engagement surface. */
const GamificationCard = () => {
  const { userRole } = useAuth();
  const { data: badges, isLoading: badgesLoading } = useMyBadges();
  const { data: streak } = useMyStreak();
  const { data: quests, isLoading: questsLoading } = useWeeklyQuests(userRole);

  const earned = (badges ?? []).filter((b) => b.earnedAt);

  return (
    <Card className="bg-card-gradient border-border">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            This week
          </CardTitle>
          <CardDescription>Three things that move you up a level.</CardDescription>
        </div>
        {streak && streak.weeks > 0 && (
          <Badge variant="secondary" className="shrink-0 gap-1">
            <Flame className="h-3.5 w-3.5 text-primary" />
            {streak.weeks} week{streak.weeks > 1 ? "s" : ""}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {questsLoading ? (
            <>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </>
          ) : (
            (quests ?? []).map((quest) => (
              <div
                key={quest.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 p-3"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    {quest.done && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    <span className={quest.done ? "text-muted-foreground line-through" : ""}>{quest.label}</span>
                    <Badge variant="outline" className="text-[10px]">+{quest.points} XP</Badge>
                  </p>
                  <p className="text-xs text-muted-foreground">{quest.description}</p>
                </div>
                {!quest.done && (
                  <Button asChild size="sm" variant="outline">
                    <Link to={quest.href}>
                      Start
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Badges</span>
            <span>
              {earned.length}/{badges?.length ?? 0}
            </span>
          </div>
          {badgesLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <TooltipProvider delayDuration={150}>
              <div className="flex flex-wrap gap-2">
                {(badges ?? []).map((badge) => {
                  const Icon = ICONS[badge.icon] ?? Award;
                  const isEarned = !!badge.earnedAt;
                  return (
                    <Tooltip key={badge.key}>
                      <TooltipTrigger asChild>
                        <div
                          className={`rounded-lg border p-2 transition-colors ${
                            isEarned ? "border-primary/40 bg-primary/10" : "border-border bg-muted/20 opacity-40"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${isEarned ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs font-medium">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {isEarned ? badge.description : `Locked — ${badge.description}`}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationCard;

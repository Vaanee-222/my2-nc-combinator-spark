import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Crown, Medal, Flame, ArrowRight, Sparkles } from "lucide-react";
import { useMonthlyLeaderboard, recentMonths, monthKey, ROLE_FILTERS, type LeaderboardRow } from "@/hooks/useLeaderboard";
import { trackEvent } from "@/lib/analytics";
import EmptyState from "@/components/dashboard/EmptyState";

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const rankStyle = (rank: number) =>
  rank === 1
    ? "bg-primary/20 text-primary border-primary/40"
    : rank <= 3
      ? "bg-muted text-foreground border-border"
      : "bg-muted/40 text-muted-foreground border-border";

const MemberRow = ({ row }: { row: LeaderboardRow }) => (
  <Link
    to={`/member/${row.user_id}`}
    className="flex items-center gap-4 rounded-xl border border-border bg-card-gradient p-4 transition-colors hover:border-primary/40"
  >
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold ${rankStyle(row.rank)}`}>
      {row.rank}
    </span>
    <Avatar className="h-10 w-10">
      <AvatarImage src={row.avatar_url ?? undefined} alt={row.display_name} />
      <AvatarFallback>{initials(row.display_name)}</AvatarFallback>
    </Avatar>
    <div className="min-w-0 flex-1">
      <p className="truncate font-medium">{row.display_name}</p>
      <p className="text-xs capitalize text-muted-foreground">
        {row.role} · Level {row.level} {row.level_name} · {row.badge_count} badge{row.badge_count === 1 ? "" : "s"}
      </p>
    </div>
    <div className="text-right">
      <p className="font-semibold text-primary">{row.points.toLocaleString()} XP</p>
      <p className="text-xs text-muted-foreground">{row.events} action{row.events === 1 ? "" : "s"}</p>
    </div>
  </Link>
);

const Leaderboard = () => {
  const months = recentMonths(6);
  const [month, setMonth] = useState(monthKey(new Date()));
  const [role, setRole] = useState("all");
  const { data, isLoading } = useMonthlyLeaderboard(month, role);

  useEffect(() => {
    trackEvent("leaderboard_viewed", { month, role });
  }, [month, role]);

  const rows = data ?? [];
  const podium = rows.slice(0, 3);
  const spotlight = rows.filter((r) => r.level >= 4).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <section className="relative overflow-hidden bg-hero-gradient py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95" />
          <div className="container relative z-10 mx-auto space-y-4 px-4 text-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary">Community</Badge>
            <h1 className="text-4xl font-bold md:text-6xl">
              Monthly{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Leaderboard</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Points are earned by building — applying to programs, mentoring, claiming perks and shipping updates.
              They can never be bought.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto space-y-8 px-4">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-56"><SelectValue placeholder="Month" /></SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent>
                  {ROLE_FILTERS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button asChild variant="outline" className="ml-auto">
                <Link to="/monthly-top-10">
                  Monthly Top 10 startups
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            ) : rows.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="No activity for this month yet"
                description="Points appear as members apply to programs, complete sessions and claim perks."
              />
            ) : (
              <>
                {podium.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {podium.map((row, i) => {
                      const Icon = i === 0 ? Crown : Medal;
                      return (
                        <Card key={row.user_id} className="border-border bg-card-gradient">
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Icon className={`h-5 w-5 ${i === 0 ? "text-primary" : "text-muted-foreground"}`} />
                              #{row.rank}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <Link to={`/member/${row.user_id}`} className="block truncate text-lg font-semibold hover:text-primary">
                              {row.display_name}
                            </Link>
                            <p className="text-sm capitalize text-muted-foreground">{row.role} · {row.level_name}</p>
                            <p className="text-2xl font-bold text-primary">{row.points.toLocaleString()} XP</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-3">
                  {rows.map((row) => <MemberRow key={row.user_id} row={row} />)}
                </div>

                {spotlight.length > 0 && (
                  <Card className="border-border bg-card-gradient">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Community spotlight
                      </CardTitle>
                      <CardDescription>Level 4+ members unlock featured placement across the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {spotlight.map((row) => (
                        <Button key={row.user_id} asChild size="sm" variant="outline">
                          <Link to={`/member/${row.user_id}`}>
                            <Flame className="mr-2 h-3.5 w-3.5 text-primary" />
                            {row.display_name}
                          </Link>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Leaderboard;

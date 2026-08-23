import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MapPin, Trophy, Award } from "lucide-react";
import { usePublicProfile } from "@/hooks/useLeaderboard";
import { levelProgress } from "@/hooks/useGamification";
import { badgeIcon } from "@/components/BadgeIcons";
import { PERKS } from "@/hooks/usePerks";
import { EmptyState } from "@/components/dashboard/EmptyState";

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const MemberProfile = () => {
  const { userId } = useParams();
  const { data: profile, isLoading } = usePublicProfile(userId);

  const progress = levelProgress(profile?.total_points ?? 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pb-16 pt-24">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/leaderboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to leaderboard
          </Link>
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-52 w-full" />
          </div>
        ) : !profile ? (
          <EmptyState
            icon={Trophy}
            title="Profile not available"
            description="This member profile is private or no longer active."
          />
        ) : (
          <div className="space-y-6">
            <Card className="border-border bg-card-gradient">
              <CardContent className="flex flex-wrap items-center gap-6 p-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.display_name} />
                  <AvatarFallback className="text-lg">{initials(profile.display_name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-2">
                  <h1 className="text-3xl font-bold">{profile.display_name}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="capitalize">{profile.role}</Badge>
                    <Badge variant="outline">Level {profile.level} · {profile.level_name}</Badge>
                    {profile.city && (
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {profile.city}
                      </span>
                    )}
                  </div>
                  {profile.bio && <p className="max-w-2xl text-sm text-muted-foreground">{profile.bio}</p>}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{profile.total_points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">total XP</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card-gradient">
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
                <CardDescription>
                  {progress.next
                    ? `${progress.remaining.toLocaleString()} XP to ${progress.next.name}`
                    : "Top level reached — Flagship."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress.pct} className="h-2" />
              </CardContent>
            </Card>

            <Card className="border-border bg-card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-primary" />
                  Badges
                </CardTitle>
                <CardDescription>{profile.badges.length} earned</CardDescription>
              </CardHeader>
              <CardContent>
                {profile.badges.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No badges earned yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {profile.badges.map((badge) => {
                      const Icon = badgeIcon(badge.icon);
                      return (
                        <div key={badge.key} className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{badge.name}</p>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card-gradient">
              <CardHeader>
                <CardTitle className="text-lg">Unlocked perks</CardTitle>
                <CardDescription>Perks granted by this member's level.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {PERKS.filter((p) => profile.level >= p.level).map((p) => (
                  <Badge key={p.key} variant="outline" className="border-primary/40 text-primary">{p.label}</Badge>
                ))}
                {PERKS.every((p) => profile.level < p.level) && (
                  <p className="text-sm text-muted-foreground">No perks unlocked yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MemberProfile;

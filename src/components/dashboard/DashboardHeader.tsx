import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, MessageSquare, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/hooks/useMyData";
import { useNotifications } from "@/hooks/useNotifications";
import XPStrip from "@/components/dashboard/XPStrip";

export type DashboardStat = { label: string; value: ReactNode; hint?: string };

type Props = {
  title: string;
  subtitle: string;
  stats?: DashboardStat[];
  meta?: ReactNode;
  actions?: ReactNode;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
};

const DashboardHeader = ({ title, subtitle, stats = [], meta, actions, onOpenNotifications, onOpenSettings }: Props) => {
  const { user, userRole } = useAuth();
  const { data: profile } = useMyProfile();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const name = profile?.full_name || user?.email?.split("@")[0] || "there";
  const filled = [profile?.full_name, profile?.email, profile?.phone, profile?.city, profile?.bio, profile?.avatar_url].filter(Boolean).length;
  const completion = Math.round((filled / 6) * 100);

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          <Button variant="outline" size="sm" onClick={() => navigate("/messages")}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Button>
          <Button variant="outline" size="sm" className="relative" onClick={onOpenNotifications}>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 h-5 min-w-5 justify-center px-1 text-[11px]">{unreadCount}</Badge>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenSettings}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Card className="bg-card-gradient border-border">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={profile?.avatar_url || undefined} alt={name} />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{name}</p>
              <p className="text-sm text-muted-foreground">{profile?.email ?? user?.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="capitalize">{userRole ?? "member"}</Badge>
                {meta}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-[92px] text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                {stat.hint && <div className="text-[11px] text-muted-foreground/80">{stat.hint}</div>}
              </div>
            ))}
            <div className="min-w-[150px]">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Profile</span>
                <span>{completion}%</span>
              </div>
              <Progress value={completion} />
              {completion < 100 && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="mt-1 text-[11px] text-primary underline-offset-2 hover:underline"
                >
                  Complete your profile
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHeader;

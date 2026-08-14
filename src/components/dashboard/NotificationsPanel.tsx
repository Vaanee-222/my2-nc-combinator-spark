import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications, type NotificationItem } from "@/hooks/useNotifications";
import { formatDate } from "@/hooks/useMyData";

const toneClass: Record<NotificationItem["tone"], string> = {
  default: "border-border",
  success: "border-green-500/40",
  warning: "border-primary/40",
  destructive: "border-destructive/40",
};

const toneBadge: Record<NotificationItem["tone"], "default" | "secondary" | "destructive" | "outline"> = {
  default: "outline",
  success: "default",
  warning: "secondary",
  destructive: "destructive",
};

const NotificationsPanel = () => {
  const { items, unreadCount, isRead, markRead, markAllRead, isLoading, refetch } = useNotifications();

  return (
    <Card className="bg-card-gradient border-border">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
              {unreadCount > 0 && <Badge>{unreadCount} new</Badge>}
            </CardTitle>
            <CardDescription>Status changes, messages and requests that need your attention.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading notifications…</p>
        ) : items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            You are all caught up. New updates on your applications, requests and messages will appear here.
          </p>
        ) : (
          <ScrollArea className="max-h-[520px] pr-3">
            <div className="space-y-3">
              {items.map((item) => {
                const read = isRead(item.id);
                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-4 transition-colors ${toneClass[item.tone]} ${read ? "opacity-60" : "bg-muted/30"}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium capitalize">{item.title}</p>
                          <Badge variant={toneBadge[item.tone]} className="capitalize">{item.kind}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground break-words">{item.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {item.href && (
                          <Button asChild variant="outline" size="sm">
                            <Link to={item.href}>Open</Link>
                          </Button>
                        )}
                        {!read && (
                          <Button variant="ghost" size="sm" onClick={() => markRead(item.id)}>
                            Mark read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;

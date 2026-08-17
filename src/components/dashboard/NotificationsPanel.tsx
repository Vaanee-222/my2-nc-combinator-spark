import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNotifications, type NotificationItem } from "@/hooks/useNotifications";
import { formatDate } from "@/hooks/useMyData";
import { EmptyState, SkeletonList } from "@/components/dashboard/EmptyState";

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

type Filter = "all" | "unread" | "requests" | "messages";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "requests", label: "Requests" },
  { value: "messages", label: "Messages" },
];

const REQUEST_KINDS: NotificationItem["kind"][] = ["applicant", "introduction", "mentorship", "application"];

const NotificationsPanel = () => {
  const { items, unreadCount, isRead, markRead, markAllRead, isLoading, refetch } = useNotifications();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({
      all: items.length,
      unread: unreadCount,
      requests: items.filter((i) => REQUEST_KINDS.includes(i.kind)).length,
      messages: items.filter((i) => i.kind === "message").length,
    }),
    [items, unreadCount],
  );

  const filtered = useMemo(() => {
    if (filter === "unread") return items.filter((i) => !isRead(i.id));
    if (filter === "requests") return items.filter((i) => REQUEST_KINDS.includes(i.kind));
    if (filter === "messages") return items.filter((i) => i.kind === "message");
    return items;
  }, [items, filter, isRead]);

  const grouped = useMemo(() => {
    const map = new Map<string, NotificationItem[]>();
    filtered.forEach((item) => {
      const list = map.get(item.kind) ?? [];
      list.push(item);
      map.set(item.kind, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

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
        <div className="mt-3 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                filter === f.value
                  ? "border-primary/50 bg-primary/15 font-medium text-primary"
                  : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {f.label}
              <span className="ml-1.5 opacity-70">{counts[f.value]}</span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonList count={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title={filter === "all" ? "You are all caught up" : "Nothing in this filter"}
            description={
              filter === "all"
                ? "New updates on your applications, requests and messages will appear here."
                : "Try another filter to see the rest of your alerts."
            }
            actionLabel={filter === "all" ? undefined : "Show all"}
            onAction={filter === "all" ? undefined : () => setFilter("all")}
          />
        ) : (
          <ScrollArea className="max-h-[520px] pr-3">
            <div className="space-y-6">
              {grouped.map(([kind, list]) => (
                <div key={kind} className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {kind} ({list.length})
                  </p>
                  {list.map((item) => {
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
                            <p className="mt-1 break-words text-sm text-muted-foreground">{item.description}</p>
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
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;

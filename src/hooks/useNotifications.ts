import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type NotificationItem = {
  id: string;
  kind: "message" | "application" | "applicant" | "introduction" | "mentorship" | "credit" | "deal";
  title: string;
  description: string;
  createdAt: string | null;
  href?: string;
  tone: "default" | "success" | "warning" | "destructive";
};

const READ_KEY = "dashboard-notifications-read";

const readIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) || "[]");
  } catch {
    return [];
  }
};

const toneForStatus = (status?: string | null): NotificationItem["tone"] => {
  const s = (status ?? "").toLowerCase();
  if (["approved", "accepted", "shortlisted", "completed", "registered"].includes(s)) return "success";
  if (["rejected", "declined", "cancelled"].includes(s)) return "destructive";
  if (["reviewing", "under review", "pending"].includes(s)) return "warning";
  return "default";
};

export const useNotifications = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["my-notifications", user?.id],
    enabled: !!user?.id,
    staleTime: 60_000,
    queryFn: async (): Promise<NotificationItem[]> => {
      const uid = user!.id;
      const items: NotificationItem[] = [];

      const [messages, apps, myApps, myPosts, intros, mentorReqs, credits, claims] = await Promise.all([
        supabase.from("messages").select("id, content, created_at, is_read").eq("receiver_id", uid).eq("is_read", false).order("created_at", { ascending: false }).limit(10),
        supabase.from("applications").select("id, program, status, updated_at").eq("user_id", uid).order("updated_at", { ascending: false }).limit(10),
        supabase.from("cofounder_applications").select("id, status, updated_at, founder_notes, request_id").eq("applicant_id", uid).order("updated_at", { ascending: false }).limit(10),
        supabase.from("cofounder_requests").select("id, title").eq("user_id", uid),
        supabase.from("introduction_requests").select("id, investor_name, status, updated_at").eq("requester_id", uid).order("updated_at", { ascending: false }).limit(10),
        supabase.from("mentorship_requests").select("id, founder_name, status, created_at").eq("mentor_id", uid).eq("status", "pending").order("created_at", { ascending: false }).limit(10),
        supabase.from("cloud_credit_requests").select("id, provider, status, updated_at").eq("user_id", uid).order("updated_at", { ascending: false }).limit(10),
        supabase.from("deal_claims").select("id, deal_title, status, created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(5),
      ]);

      (messages.data ?? []).forEach((m: any) =>
        items.push({
          id: `message-${m.id}`,
          kind: "message",
          title: "New message",
          description: (m.content ?? "").slice(0, 120),
          createdAt: m.created_at,
          href: "/messages",
          tone: "default",
        }),
      );

      (apps.data ?? []).forEach((a: any) =>
        items.push({
          id: `application-${a.id}-${a.status}`,
          kind: "application",
          title: `Application ${a.status}`,
          description: `${a.program} — your submission is now marked "${a.status}".`,
          createdAt: a.updated_at,
          href: "/application-status",
          tone: toneForStatus(a.status),
        }),
      );

      (myApps.data ?? [])
        .filter((a: any) => (a.status ?? "new") !== "new")
        .forEach((a: any) =>
          items.push({
            id: `cofounder-app-${a.id}-${a.status}`,
            kind: "application",
            title: `Co-founder application ${a.status}`,
            description: a.founder_notes || "A founder updated the status of your application.",
            createdAt: a.updated_at,
            tone: toneForStatus(a.status),
          }),
        );

      const postIds = (myPosts.data ?? []).map((p: any) => p.id);
      if (postIds.length) {
        const { data: incoming } = await supabase
          .from("cofounder_applications")
          .select("id, applicant_name, status, created_at, request_id")
          .in("request_id", postIds)
          .eq("status", "new")
          .order("created_at", { ascending: false })
          .limit(10);
        (incoming ?? []).forEach((a: any) =>
          items.push({
            id: `applicant-${a.id}`,
            kind: "applicant",
            title: "New co-founder applicant",
            description: `${a.applicant_name} applied to "${(myPosts.data ?? []).find((p: any) => p.id === a.request_id)?.title ?? "your post"}".`,
            createdAt: a.created_at,
            tone: "warning",
          }),
        );
      }

      (intros.data ?? [])
        .filter((i: any) => i.status !== "pending")
        .forEach((i: any) =>
          items.push({
            id: `intro-${i.id}-${i.status}`,
            kind: "introduction",
            title: `Introduction ${i.status}`,
            description: `Your introduction request to ${i.investor_name} was ${i.status}.`,
            createdAt: i.updated_at,
            tone: toneForStatus(i.status),
          }),
        );

      (mentorReqs.data ?? []).forEach((r: any) =>
        items.push({
          id: `mentorship-${r.id}`,
          kind: "mentorship",
          title: "New mentorship request",
          description: `${r.founder_name} is waiting for your response.`,
          createdAt: r.created_at,
          tone: "warning",
        }),
      );

      (credits.data ?? [])
        .filter((c: any) => c.status !== "pending")
        .forEach((c: any) =>
          items.push({
            id: `credit-${c.id}-${c.status}`,
            kind: "credit",
            title: `Cloud credits ${c.status}`,
            description: `${c.provider} credit request is ${c.status}.`,
            createdAt: c.updated_at,
            tone: toneForStatus(c.status),
          }),
        );

      (claims.data ?? []).forEach((c: any) =>
        items.push({
          id: `deal-${c.id}-${c.status}`,
          kind: "deal",
          title: `Deal ${c.status ?? "claimed"}`,
          description: c.deal_title,
          createdAt: c.created_at,
          tone: toneForStatus(c.status),
        }),
      );

      return items.sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
      );
    },
  });

  const [read, setRead] = useState<string[]>(readIds);

  useEffect(() => {
    localStorage.setItem(READ_KEY, JSON.stringify(read.slice(-500)));
  }, [read]);

  const items = query.data ?? [];
  const unread = useMemo(() => items.filter((i) => !read.includes(i.id)), [items, read]);

  const markRead = useCallback((id: string) => setRead((prev) => (prev.includes(id) ? prev : [...prev, id])), []);
  const markAllRead = useCallback(() => setRead((prev) => Array.from(new Set([...prev, ...items.map((i) => i.id)]))), [items]);

  return {
    items,
    unreadCount: unread.length,
    isRead: (id: string) => read.includes(id),
    markRead,
    markAllRead,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};

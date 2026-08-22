import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type PointEvent = {
  id: string;
  event_key: string;
  points: number;
  source_table: string | null;
  awarded_at: string;
};

export type UserPoints = {
  total: number;
  level: number;
  levelName: string;
};

/** Level thresholds mirror public.level_for_points in the database. */
export const LEVELS = [
  { level: 1, name: "Explorer", min: 0, max: 250 },
  { level: 2, name: "Builder", min: 251, max: 750 },
  { level: 3, name: "Contender", min: 751, max: 1800 },
  { level: 4, name: "Signal", min: 1801, max: 4000 },
  { level: 5, name: "Flagship", min: 4000, max: Infinity },
] as const;

export const levelProgress = (total: number) => {
  const current = LEVELS.find((l) => total >= l.min && total <= l.max) ?? LEVELS[0];
  const next = LEVELS.find((l) => l.level === current.level + 1);
  if (!next) return { current, next: null, pct: 100, remaining: 0 };
  const span = next.min - current.min;
  const pct = Math.min(100, Math.max(0, Math.round(((total - current.min) / span) * 100)));
  return { current, next, pct, remaining: Math.max(0, next.min - total) };
};

export const EVENT_LABELS: Record<string, string> = {
  program_application: "Applied to a program",
  deal_claimed: "Claimed a deal",
  cofounder_request_posted: "Posted a co-founder request",
  cofounder_application_sent: "Applied to a co-founder role",
  mentorship_requested: "Requested mentorship",
  intro_requested: "Requested an investor intro",
  session_completed: "Completed a mentor session",
};

export const useMyPoints = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-points", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<UserPoints> => {
      const { data, error } = await supabase
        .from("user_points")
        .select("total_points, level, level_name")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return {
        total: data?.total_points ?? 0,
        level: data?.level ?? 1,
        levelName: data?.level_name ?? "Explorer",
      };
    },
  });
};

export const useMyPointEvents = (limit = 10) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-point-events", user?.id, limit],
    enabled: !!user?.id,
    queryFn: async (): Promise<PointEvent[]> => {
      const { data, error } = await supabase
        .from("point_events")
        .select("id, event_key, points, source_table, awarded_at")
        .eq("user_id", user!.id)
        .order("awarded_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });
};

/* ---------------- Phase 2: badges, streaks, quests ---------------- */

export type Badge = {
  key: string;
  name: string;
  description: string | null;
  icon: string;
  criteria_event: string;
  threshold: number;
  sort_order: number;
  earnedAt: string | null;
};

/** Full badge catalogue with the current user's earned state merged in. */
export const useMyBadges = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-badges", user?.id],
    queryFn: async (): Promise<Badge[]> => {
      const [catalogue, mine] = await Promise.all([
        supabase
          .from("badges")
          .select("key, name, description, icon, criteria_event, threshold, sort_order")
          .eq("is_active", true)
          .order("sort_order"),
        user?.id
          ? supabase.from("user_badges").select("badge_key, awarded_at").eq("user_id", user.id)
          : Promise.resolve({ data: [], error: null } as any),
      ]);
      if (catalogue.error) throw catalogue.error;
      if (mine.error) throw mine.error;
      const earned = new Map<string, string>((mine.data ?? []).map((b: any) => [b.badge_key, b.awarded_at]));
      return (catalogue.data ?? []).map((b: any) => ({ ...b, earnedAt: earned.get(b.key) ?? null }));
    },
  });
};

const startOfWeek = (d: Date) => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday-based
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x;
};

const weekKey = (iso: string) => startOfWeek(new Date(iso)).toISOString().slice(0, 10);

export type Streak = { weeks: number; activeThisWeek: boolean; graceUsed: boolean };

/** Weekly activity streak with a single one-week grace token. */
export const streakFromEvents = (events: { awarded_at: string }[]): Streak => {
  const active = new Set(events.map((e) => weekKey(e.awarded_at)));
  const cursor = startOfWeek(new Date());
  const activeThisWeek = active.has(cursor.toISOString().slice(0, 10));
  let weeks = 0;
  let graceUsed = false;
  if (!activeThisWeek) cursor.setDate(cursor.getDate() - 7);
  for (let i = 0; i < 104; i++) {
    if (active.has(cursor.toISOString().slice(0, 10))) {
      weeks += 1;
    } else if (!graceUsed && weeks > 0) {
      graceUsed = true;
    } else {
      break;
    }
    cursor.setDate(cursor.getDate() - 7);
  }
  return { weeks, activeThisWeek, graceUsed };
};

export const useMyStreak = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-streak", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<Streak> => {
      const { data, error } = await supabase
        .from("point_events")
        .select("awarded_at")
        .eq("user_id", user!.id)
        .order("awarded_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return streakFromEvents(data ?? []);
    },
  });
};

export type Quest = { id: string; label: string; description: string; points: number; href: string; done: boolean };

type QuestSpec = Omit<Quest, "done"> & { eventKey: string };

const QUEST_CATALOGUE: Record<string, QuestSpec[]> = {
  startup: [
    { id: "q-apply", eventKey: "program_application", label: "Apply to a program", description: "Hackathon, Xi Lab, Incubation or MVP Lab.", points: 30, href: "/incubation" },
    { id: "q-deal", eventKey: "deal_claimed", label: "Claim a perk deal", description: "Save on the tools you already use.", points: 20, href: "/deals" },
    { id: "q-mentor", eventKey: "mentorship_requested", label: "Request a mentor session", description: "Get unblocked on your biggest challenge.", points: 25, href: "/become-mentor" },
    { id: "q-intro", eventKey: "intro_requested", label: "Request an investor intro", description: "Warm intros beat cold outreach.", points: 20, href: "/investor-centre" },
    { id: "q-cofounder", eventKey: "cofounder_request_posted", label: "Post a co-founder requirement", description: "Find the missing piece of your team.", points: 35, href: "/meet-cofounder" },
  ],
  mentor: [
    { id: "q-session", eventKey: "session_completed", label: "Complete a mentor session", description: "Log the session once it's done.", points: 75, href: "/mentor-dashboard" },
    { id: "q-mentee", eventKey: "mentorship_requested", label: "Review incoming requests", description: "Respond within 48h to keep momentum.", points: 25, href: "/mentor-dashboard" },
    { id: "q-deal", eventKey: "deal_claimed", label: "Explore partner perks", description: "Share useful deals with your mentees.", points: 20, href: "/deals" },
  ],
  cofounder: [
    { id: "q-apply-cf", eventKey: "cofounder_application_sent", label: "Apply to a co-founder role", description: "Send a strong, specific pitch.", points: 15, href: "/meet-cofounder" },
    { id: "q-post", eventKey: "cofounder_request_posted", label: "Post what you're looking for", description: "Let founders find you.", points: 35, href: "/meet-cofounder" },
    { id: "q-deal", eventKey: "deal_claimed", label: "Claim a startup perk", description: "Tools and credits for early builders.", points: 20, href: "/deals" },
  ],
  investor: [
    { id: "q-intro", eventKey: "intro_requested", label: "Request a founder intro", description: "Reach out to a startup in the directory.", points: 20, href: "/startup-directory" },
    { id: "q-apply", eventKey: "program_application", label: "Join a program cohort", description: "Follow the next demo day cohort.", points: 30, href: "/current-cohort" },
    { id: "q-deal", eventKey: "deal_claimed", label: "Claim an ecosystem perk", description: "Available to every member.", points: 20, href: "/deals" },
  ],
};

const DEFAULT_QUESTS = QUEST_CATALOGUE.startup;

/** Rotating 3-item weekly checklist, generated from what the account has NOT done this week. */
export const useWeeklyQuests = (role?: string | null) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-quests", user?.id, role],
    enabled: !!user?.id,
    queryFn: async (): Promise<Quest[]> => {
      const since = startOfWeek(new Date()).toISOString();
      const { data, error } = await supabase
        .from("point_events")
        .select("event_key")
        .eq("user_id", user!.id)
        .gte("awarded_at", since);
      if (error) throw error;
      const doneKeys = new Set((data ?? []).map((e: any) => e.event_key));
      const specs = QUEST_CATALOGUE[role ?? ""] ?? DEFAULT_QUESTS;
      const scored = specs.map((s) => ({ ...s, done: doneKeys.has(s.eventKey) }));
      const pending = scored.filter((q) => !q.done);
      const done = scored.filter((q) => q.done);
      return [...pending, ...done].slice(0, 3).map(({ eventKey, ...q }) => q);
    },
  });
};

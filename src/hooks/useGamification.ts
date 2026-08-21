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

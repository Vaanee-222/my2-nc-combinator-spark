import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LeaderboardRow = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  role: string;
  points: number;
  events: number;
  total_points: number;
  level: number;
  level_name: string;
  badge_count: number;
  rank: number;
};

export type PublicBadge = {
  key: string;
  name: string;
  description: string | null;
  icon: string;
  awarded_at: string;
};

export type PublicProfile = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  role: string;
  total_points: number;
  level: number;
  level_name: string;
  badges: PublicBadge[];
  joined_at: string;
};

/** First day of the month, ISO date string — the leaderboard bucket key. */
export const monthKey = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);

export const recentMonths = (count = 6) => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      value: monthKey(d),
      label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
  });
};

export const ROLE_FILTERS = [
  { value: "all", label: "All members" },
  { value: "startup", label: "Startups" },
  { value: "mentor", label: "Mentors" },
  { value: "investor", label: "Investors" },
  { value: "cofounder", label: "Co-founders" },
] as const;

export const useMonthlyLeaderboard = (month: string, role: string, limit = 50) =>
  useQuery({
    queryKey: ["leaderboard", month, role, limit],
    queryFn: async (): Promise<LeaderboardRow[]> => {
      const { data, error } = await supabase.rpc("monthly_leaderboard", {
        _month: month,
        _role: role === "all" ? null : role,
        _limit: limit,
      });
      if (error) throw error;
      return (data ?? []) as LeaderboardRow[];
    },
  });

export const usePublicProfile = (userId?: string) =>
  useQuery({
    queryKey: ["public-profile", userId],
    enabled: !!userId,
    queryFn: async (): Promise<PublicProfile | null> => {
      const { data, error } = await supabase.rpc("public_gamification", { _user_id: userId! });
      if (error) throw error;
      const row = (data ?? [])[0];
      if (!row) return null;
      return { ...row, badges: (row.badges ?? []) as unknown as PublicBadge[] } as PublicProfile;
    },
  });

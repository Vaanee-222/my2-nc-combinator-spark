import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMyPoints } from "@/hooks/useGamification";

export type PerkKey =
  | "directory_boost"
  | "free_intro"
  | "top10_shortlist"
  | "featured_card"
  | "priority_mentor"
  | "credit_fast_lane"
  | "spotlight"
  | "investor_room"
  | "fee_waiver";

export type Perk = { key: PerkKey; level: number; label: string; description: string };

/** Level-gated perks — mirrors the gamification plan's ladder. */
export const PERKS: Perk[] = [
  { key: "directory_boost", level: 2, label: "Directory boost", description: "Your profile ranks above unranked members." },
  { key: "free_intro", level: 3, label: "1 free investor intro / month", description: "Skip the queue on one warm introduction each month." },
  { key: "top10_shortlist", level: 3, label: "Monthly Top 10 shortlist", description: "Eligible for the monthly startup shortlist." },
  { key: "featured_card", level: 4, label: "Featured directory card", description: "Highlighted card placement in the directory." },
  { key: "priority_mentor", level: 4, label: "Priority mentor matching", description: "Your requests are surfaced to mentors first." },
  { key: "credit_fast_lane", level: 4, label: "Cloud-credit fast lane", description: "Credit requests reviewed ahead of the queue." },
  { key: "spotlight", level: 5, label: "Homepage & cohort spotlight", description: "Featured across the public site." },
  { key: "investor_room", level: 5, label: "Closed investor rooms", description: "Invitations to private investor sessions." },
  { key: "fee_waiver", level: 5, label: "Service fee waiver", description: "One engagement with the service fee waived." },
];

/** Free monthly investor introductions granted by level. */
export const introQuotaForLevel = (level: number) => (level >= 5 ? Infinity : level >= 4 ? 3 : level >= 3 ? 1 : 0);

export const usePerks = () => {
  const { user } = useAuth();
  const { data: points, isLoading } = useMyPoints();
  const level = points?.level ?? 1;

  const introsUsed = useQuery({
    queryKey: ["intro-usage", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<number> => {
      const since = new Date();
      since.setDate(1);
      since.setHours(0, 0, 0, 0);
      const { count, error } = await supabase
        .from("introduction_requests")
        .select("id", { count: "exact", head: true })
        .eq("requester_id", user!.id)
        .gte("created_at", since.toISOString());
      if (error) throw error;
      return count ?? 0;
    },
  });

  const quota = introQuotaForLevel(level);
  const used = introsUsed.data ?? 0;

  return {
    isLoading,
    level,
    levelName: points?.levelName ?? "Explorer",
    total: points?.total ?? 0,
    perks: PERKS.map((p) => ({ ...p, unlocked: level >= p.level })),
    has: (key: PerkKey) => {
      const perk = PERKS.find((p) => p.key === key);
      return !!perk && level >= perk.level;
    },
    intro: {
      quota,
      used,
      remaining: quota === Infinity ? Infinity : Math.max(0, quota - used),
    },
  };
};

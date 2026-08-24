import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMyPoints } from "@/hooks/useGamification";
import { introQuotaForLevel } from "@/hooks/usePerks";

/**
 * Entitlement resolver — one place that answers "what can this member do?".
 * Combines: role (audience) + active subscription tier + gamification level.
 */
export type Audience = "startup" | "investor" | "mentor" | "cofounder";
export type Tier = "free" | "pro" | "premium";

export type FeatureKey =
  // startup
  | "full_deal_catalogue"
  | "credit_fast_lane"
  | "health_reports"
  | "investor_room"
  | "featured_listing"
  // mentor
  | "paid_sessions"
  | "booking_page"
  | "mentee_crm"
  | "session_analytics"
  | "advisory_listing"
  // cofounder
  | "unlimited_applications"
  | "profile_boost"
  | "verified_skills"
  | "profile_viewers"
  | "direct_message"
  | "matchmaking_concierge"
  // investor
  | "deal_alerts"
  | "portfolio_tracker"
  | "data_room"
  | "demo_day_priority"
  | "analytics_export";

const TIER_RANK: Record<Tier, number> = { free: 0, pro: 1, premium: 2 };

/** Minimum tier required per feature, per audience. */
const FEATURE_MATRIX: Record<Audience, Partial<Record<FeatureKey, Tier>>> = {
  startup: {
    full_deal_catalogue: "pro",
    credit_fast_lane: "pro",
    health_reports: "pro",
    investor_room: "premium",
    featured_listing: "premium",
  },
  mentor: {
    paid_sessions: "pro",
    booking_page: "pro",
    mentee_crm: "pro",
    session_analytics: "pro",
    advisory_listing: "premium",
  },
  cofounder: {
    unlimited_applications: "pro",
    profile_boost: "pro",
    verified_skills: "pro",
    profile_viewers: "pro",
    direct_message: "pro",
    matchmaking_concierge: "premium",
  },
  investor: {
    deal_alerts: "pro",
    portfolio_tracker: "pro",
    data_room: "premium",
    demo_day_priority: "premium",
    analytics_export: "premium",
  },
};

/** Monthly quota ladder per audience + tier. Infinity = unlimited. */
const QUOTAS: Record<Audience, Record<Tier, { applications: number; intros: number }>> = {
  startup: {
    free: { applications: 4, intros: 0 },
    pro: { applications: 12, intros: 3 },
    premium: { applications: Infinity, intros: Infinity },
  },
  mentor: {
    free: { applications: Infinity, intros: 0 },
    pro: { applications: Infinity, intros: 2 },
    premium: { applications: Infinity, intros: Infinity },
  },
  cofounder: {
    free: { applications: 3, intros: 0 },
    pro: { applications: Infinity, intros: 1 },
    premium: { applications: Infinity, intros: Infinity },
  },
  investor: {
    free: { applications: Infinity, intros: 0 },
    pro: { applications: Infinity, intros: 5 },
    premium: { applications: Infinity, intros: Infinity },
  },
};

export type PlanRow = {
  id: string;
  name: string;
  audience: string;
  tier: string | null;
  category: string | null;
  price_usd: number | null;
  billing_period: string | null;
  description: string | null;
  features: string[] | null;
  is_popular: boolean | null;
  sort_order: number | null;
};

const asAudience = (role?: string | null): Audience =>
  role === "investor" || role === "mentor" || role === "cofounder" ? role : "startup";

const monthStart = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Public plan ladder for one audience (falls back to all audiences). */
export const usePlans = (audience?: Audience | "all") =>
  useQuery({
    queryKey: ["subscription-plans", audience ?? "all"],
    queryFn: async (): Promise<PlanRow[]> => {
      let q = supabase
        .from("subscription_plans")
        .select("id,name,audience,tier,category,price_usd,billing_period,description,features,is_popular,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (audience && audience !== "all") q = q.in("audience", [audience, "all"]);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as PlanRow[];
    },
  });

export const useEntitlements = () => {
  const { user, userRole } = useAuth();
  const audience = asAudience(userRole);
  const { data: points } = useMyPoints();
  const level = points?.level ?? 1;

  const purchase = useQuery({
    queryKey: ["my-subscription", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_purchases")
        .select("plan_name,plan_id,amount_usd,status,purchased_at,expires_at")
        .eq("user_id", user!.id)
        .order("purchased_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      const now = Date.now();
      return (
        (data ?? []).find((p) => !p.expires_at || new Date(p.expires_at).getTime() > now) ?? null
      );
    },
  });

  const plans = usePlans(audience);

  const activePlan = plans.data?.find((p) => p.name === purchase.data?.plan_name) ?? null;
  const paidTier = (activePlan?.tier as Tier | undefined) ?? (purchase.data ? "pro" : "free");
  const tier: Tier = purchase.data ? (["free", "pro", "premium"].includes(paidTier) ? paidTier : "pro") : "free";

  const applicationsUsed = useQuery({
    queryKey: ["usage-applications", user?.id, audience],
    enabled: !!user?.id,
    queryFn: async (): Promise<number> => {
      const since = monthStart().toISOString();
      if (audience === "cofounder") {
        const { count, error } = await supabase
          .from("cofounder_applications")
          .select("id", { count: "exact", head: true })
          .eq("applicant_id", user!.id)
          .gte("created_at", since);
        if (error) throw error;
        return count ?? 0;
      }
      const { count, error } = await supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .gte("created_at", since);
      if (error) return 0;
      return count ?? 0;
    },
  });

  const introsUsed = useQuery({
    queryKey: ["usage-intros", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from("introduction_requests")
        .select("id", { count: "exact", head: true })
        .eq("requester_id", user!.id)
        .gte("created_at", monthStart().toISOString());
      if (error) throw error;
      return count ?? 0;
    },
  });

  const base = QUOTAS[audience][tier];
  // Gamification can substitute for a paid perk: level-based free intros stack in.
  const introLimit = Math.max(base.intros, introQuotaForLevel(level));

  const remaining = (limit: number, used: number) =>
    limit === Infinity ? Infinity : Math.max(0, limit - used);

  const appsUsed = applicationsUsed.data ?? 0;
  const intUsed = introsUsed.data ?? 0;

  return {
    isLoading: purchase.isLoading || plans.isLoading,
    audience,
    tier,
    tierRank: TIER_RANK[tier],
    level,
    planName: purchase.data?.plan_name ?? "Free",
    expiresAt: purchase.data?.expires_at ?? null,
    plans: plans.data ?? [],
    /** Does the member's tier unlock this feature? Level 4+ gets a courtesy pro unlock. */
    has: (feature: FeatureKey) => {
      const required = FEATURE_MATRIX[audience][feature];
      if (!required) return true;
      const effective = Math.max(TIER_RANK[tier], level >= 4 ? TIER_RANK.pro : 0);
      return effective >= TIER_RANK[required];
    },
    requiredTier: (feature: FeatureKey) => FEATURE_MATRIX[audience][feature] ?? null,
    quotas: {
      applications: {
        limit: base.applications,
        used: appsUsed,
        remaining: remaining(base.applications, appsUsed),
      },
      intros: {
        limit: introLimit,
        used: intUsed,
        remaining: remaining(introLimit, intUsed),
      },
    },
  };
};

/** Increment a server-side monthly counter (for perks with no source table). */
export const bumpUsage = async (counterKey: string, delta = 1) => {
  const { error } = await (supabase as any).rpc("increment_usage_counter", {
    _counter_key: counterKey,
    _delta: delta,
  });
  return !error;
};

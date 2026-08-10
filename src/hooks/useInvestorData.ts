import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const PIPELINE_STAGES = [
  "Sourced",
  "Screening",
  "Due Diligence",
  "Term Sheet",
  "Closed",
  "Passed",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const progressForStage = (stage: string) => {
  switch (stage) {
    case "Sourced":
      return 10;
    case "Screening":
      return 35;
    case "Due Diligence":
      return 60;
    case "Term Sheet":
      return 85;
    case "Closed":
      return 100;
    case "Passed":
      return 100;
    default:
      return 10;
  }
};

export const num = (value: unknown) => Number(value ?? 0) || 0;

export const useMyPortfolio = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["investor-portfolio", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investor_portfolio")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useMyDeals = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["investor-deals", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investor_deals")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useInvestorPreferences = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["investor-preferences", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investor_preferences")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

/** Live startups from the directory, used as sourceable deal flow. */
export const useSourceableStartups = () =>
  useQuery({
    queryKey: ["sourceable-startups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("startups")
        .select("id, name, slug, sector, stage, description, country, team_size, founded_year, logo_url")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .limit(60);
      if (error) throw error;
      return data ?? [];
    },
  });

/** Introduction requests raised toward this investor. */
export const useIncomingIntroductions = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["investor-introductions", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("introduction_requests")
        .select("*")
        .eq("investor_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const portfolioMetrics = (rows: any[]) => {
  const invested = rows.reduce((sum, r) => sum + num(r.amount_invested), 0);
  const value = rows.reduce((sum, r) => sum + num(r.current_valuation), 0);
  const exits = rows.filter((r) => r.status === "exited").length;
  const active = rows.filter((r) => r.status === "active").length;
  const winners = rows.filter((r) => num(r.current_valuation) > num(r.amount_invested)).length;
  return {
    invested,
    value,
    exits,
    active,
    total: rows.length,
    roi: invested > 0 ? Math.round((value / invested) * 100) : 0,
    successRate: rows.length > 0 ? Math.round((winners / rows.length) * 100) : 0,
  };
};

export const growthPct = (row: any) => {
  const invested = num(row.amount_invested);
  if (invested <= 0) return null;
  return Math.round(((num(row.current_valuation) - invested) / invested) * 100);
};

export const toCsv = (rows: Record<string, any>[], filename: string) => {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

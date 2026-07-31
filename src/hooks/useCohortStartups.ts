import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { monthlyTop10, quarterlyTop5, type CohortStartup } from "@/data/cohorts";

export type CohortRow = Tables<"cohort_startups">;

const toCohortStartup = (r: CohortRow): CohortStartup => ({
  id: r.external_id ?? r.id,
  name: r.name,
  founder: r.founder ?? "",
  category: r.category ?? "",
  description: r.description ?? "",
  stage: r.stage ?? "",
  traction: r.traction ?? "",
  status: (r.status as CohortStartup["status"]) ?? "Selected",
  period: r.period,
  highlight: r.highlight ?? undefined,
});

/** DB-driven cohort listings with the static seed as fallback. */
export const useCohortStartups = (cohortType: "monthly" | "quarterly") =>
  useQuery({
    queryKey: ["cohort-startups", cohortType],
    queryFn: async (): Promise<CohortStartup[]> => {
      const { data, error } = await supabase
        .from("cohort_startups")
        .select("*")
        .eq("cohort_type", cohortType)
        .eq("is_visible", true)
        .order("period", { ascending: false })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data?.length) return cohortType === "monthly" ? monthlyTop10 : quarterlyTop5;
      return data.map(toCohortStartup);
    },
    staleTime: 5 * 60 * 1000,
  });

export const uniquePeriods = (rows: CohortStartup[]) =>
  Array.from(new Set(rows.map((r) => r.period))).sort().reverse();

export const uniqueCategories = (rows: CohortStartup[]) => [
  "All",
  ...Array.from(new Set(rows.map((r) => r.category).filter(Boolean))).sort(),
];

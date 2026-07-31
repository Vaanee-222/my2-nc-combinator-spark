import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { advisoryBoard, type Advisor, type AdvisorTier } from "@/data/advisoryBoard";

export type AdvisorRow = Tables<"advisors">;

const toAdvisor = (r: AdvisorRow): Advisor => ({
  name: r.name,
  role: r.role ?? "",
  company: r.company ?? "",
  country: r.country ?? "",
  expertise: r.expertise ?? "",
  description: r.description ?? "",
  linkedin: r.linkedin_url ?? "#",
  tier: (r.tier as AdvisorTier) ?? "Strategic Advisors",
});

/** DB-driven advisory board with the static seed as fallback. */
export const useAdvisors = () =>
  useQuery({
    queryKey: ["advisors", "public"],
    queryFn: async (): Promise<Advisor[]> => {
      const { data, error } = await supabase
        .from("advisors")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data?.length) return advisoryBoard;
      return data.map(toAdvisor);
    },
    staleTime: 5 * 60 * 1000,
  });

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type MyApplication = {
  id: string;
  source: string;
  program: string;
  status: string;
  submittedAt: string | null;
  notes?: string | null;
};

const STAGE_PROGRESS: Record<string, number> = {
  submitted: 25,
  pending: 25,
  reviewing: 60,
  "under review": 60,
  shortlisted: 80,
  approved: 100,
  accepted: 100,
  registered: 100,
  rejected: 100,
  declined: 100,
};

export const progressForStatus = (status?: string | null) =>
  STAGE_PROGRESS[(status ?? "").toLowerCase()] ?? 25;

export const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "—";

export const useMyProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useMyApplications = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-applications", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<MyApplication[]> => {
      const uid = user!.id;
      const [apps, inclab, incubation, hack, grants, credits, consults, intros] = await Promise.all([
        supabase.from("applications").select("id, program, status, created_at, review_notes").eq("user_id", uid),
        supabase.from("inclab_applications").select("id, startup_name, status, created_at, admin_notes").eq("user_id", uid),
        supabase.from("incubation_applications").select("id, startup_name, status, created_at").eq("user_id", uid),
        supabase.from("hackathon_registrations").select("id, status, created_at").eq("user_id", uid),
        supabase.from("grant_applications").select("id, grant_name, status, created_at, admin_notes").eq("user_id", uid),
        supabase.from("cloud_credit_requests").select("id, provider, status, created_at, admin_notes").eq("user_id", uid),
        supabase.from("consultation_bookings").select("id, consultation_type, status, created_at, admin_notes").eq("user_id", uid),
        supabase.from("introduction_requests").select("id, investor_name, status, created_at, admin_notes").eq("requester_id", uid),
      ]);

      const rows: MyApplication[] = [
        ...(apps.data ?? []).map((r: any) => ({ id: r.id, source: "Program", program: r.program, status: r.status, submittedAt: r.created_at, notes: r.review_notes })),
        ...(inclab.data ?? []).map((r: any) => ({ id: r.id, source: "Xi Lab", program: r.startup_name ? `Xi Lab — ${r.startup_name}` : "Xi Lab", status: r.status, submittedAt: r.created_at, notes: r.admin_notes })),
        ...(incubation.data ?? []).map((r: any) => ({ id: r.id, source: "Incubation", program: r.startup_name ? `Incubation — ${r.startup_name}` : "Incubation", status: r.status, submittedAt: r.created_at })),
        ...(hack.data ?? []).map((r: any) => ({ id: r.id, source: "Hackathon", program: "Hackathon Registration", status: r.status, submittedAt: r.created_at })),
        ...(grants.data ?? []).map((r: any) => ({ id: r.id, source: "Grant", program: r.grant_name, status: r.status, submittedAt: r.created_at, notes: r.admin_notes })),
        ...(credits.data ?? []).map((r: any) => ({ id: r.id, source: "Cloud Credits", program: `${r.provider} credits`, status: r.status, submittedAt: r.created_at, notes: r.admin_notes })),
        ...(consults.data ?? []).map((r: any) => ({ id: r.id, source: "Consultation", program: r.consultation_type, status: r.status, submittedAt: r.created_at, notes: r.admin_notes })),
        ...(intros.data ?? []).map((r: any) => ({ id: r.id, source: "Introduction", program: `Intro — ${r.investor_name}`, status: r.status, submittedAt: r.created_at, notes: r.admin_notes })),
      ];

      return rows.sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""));
    },
  });
};

export const useUpcomingPrograms = () =>
  useQuery({
    queryKey: ["upcoming-programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data ?? [];
    },
  });

export const useOpenCofounderPosts = () =>
  useQuery({
    queryKey: ["open-cofounder-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cofounder_requests")
        .select("id, title, description, skills_needed, equity_offered, commitment, location, created_at")
        .eq("review_status", "approved")
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data ?? [];
    },
  });

export const useMyCofounderPosts = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-cofounder-posts", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cofounder_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useActiveDeals = () =>
  useQuery({
    queryKey: ["active-deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_offers")
        .select("id, title, company_name, offer_value, discount, valid_until, status, redemption_url")
        .eq("status", "approved")
        .order("is_featured", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data ?? [];
    },
  });

export const useMyCloudCredits = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-cloud-credits", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cloud_credit_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useMyInvestorInquiries = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-investor-inquiries", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investor_inquiries")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useLearningResources = () =>
  useQuery({
    queryKey: ["learning-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, excerpt, category, read_time_minutes")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

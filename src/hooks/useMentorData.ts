import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type Mentorship = {
  id: string;
  mentor_id: string;
  mentee_id: string | null;
  mentee_name: string;
  mentee_email: string | null;
  startup_name: string | null;
  sector: string | null;
  stage: string | null;
  current_focus: string | null;
  sessions_completed: number;
  next_session_on: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

export type MentorSession = {
  id: string;
  mentor_id: string;
  mentorship_id: string | null;
  mentee_name: string;
  topic: string;
  session_type: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_url: string | null;
  status: string;
  notes: string | null;
};

export type MentorshipRequest = {
  id: string;
  mentor_id: string | null;
  requester_id: string;
  founder_name: string;
  contact_email: string;
  startup_name: string | null;
  sector: string | null;
  stage: string | null;
  challenge: string;
  match_score: number;
  status: string;
  mentor_notes: string | null;
  created_at: string;
};

export const useMentorProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["mentor-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentor_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useMentorships = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["mentorships", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentorships")
        .select("*")
        .eq("mentor_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Mentorship[];
    },
  });
};

export const useMentorSessions = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["mentor-sessions", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentor_sessions")
        .select("*")
        .eq("mentor_id", user!.id)
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MentorSession[];
    },
  });
};

export const useMentorshipRequests = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["mentorship-requests", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentorship_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as MentorshipRequest[];
    },
  });
};

export const useMentorMutations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const invalidate = () => {
    ["mentor-profile", "mentorships", "mentor-sessions", "mentorship-requests"].forEach((k) =>
      qc.invalidateQueries({ queryKey: [k, user?.id] }),
    );
  };

  const handleError = (error: unknown) =>
    toast({
      title: "Something went wrong",
      description: error instanceof Error ? error.message : "Please try again.",
      variant: "destructive",
    });

  const saveProfile = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase
        .from("mentor_profiles")
        .upsert({ ...values, user_id: user!.id } as never, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Profile saved" });
    },
    onError: handleError,
  });

  const saveMentee = useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: Record<string, unknown> }) => {
      if (id) {
        const { error } = await supabase.from("mentorships").update(values as never).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("mentorships")
          .insert({ ...values, mentor_id: user!.id } as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Mentee saved" });
    },
    onError: handleError,
  });

  const deleteMentee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("mentorships").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Mentee removed" });
    },
    onError: handleError,
  });

  const saveSession = useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: Record<string, unknown> }) => {
      if (id) {
        const { error } = await supabase.from("mentor_sessions").update(values as never).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("mentor_sessions")
          .insert({ ...values, mentor_id: user!.id } as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Session saved" });
    },
    onError: handleError,
  });

  const deleteSession = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("mentor_sessions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Session cancelled" });
    },
    onError: handleError,
  });

  const completeSession = useMutation({
    mutationFn: async (session: MentorSession) => {
      const { error } = await supabase
        .from("mentor_sessions")
        .update({ status: "completed" })
        .eq("id", session.id);
      if (error) throw error;
      if (session.mentorship_id) {
        const { data } = await supabase
          .from("mentorships")
          .select("sessions_completed")
          .eq("id", session.mentorship_id)
          .maybeSingle();
        await supabase
          .from("mentorships")
          .update({ sessions_completed: (data?.sessions_completed ?? 0) + 1 })
          .eq("id", session.mentorship_id);
      }
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Session marked complete" });
    },
    onError: handleError,
  });

  const respondToRequest = useMutation({
    mutationFn: async ({
      request,
      status,
      notes,
    }: {
      request: MentorshipRequest;
      status: "accepted" | "declined";
      notes?: string;
    }) => {
      const { error } = await supabase
        .from("mentorship_requests")
        .update({ status, mentor_notes: notes ?? request.mentor_notes, mentor_id: user!.id })
        .eq("id", request.id);
      if (error) throw error;

      if (status === "accepted") {
        const { error: insertError } = await supabase.from("mentorships").insert({
          mentor_id: user!.id,
          mentee_id: request.requester_id,
          mentee_name: request.founder_name,
          mentee_email: request.contact_email,
          startup_name: request.startup_name,
          sector: request.sector,
          stage: request.stage,
          current_focus: request.challenge,
          status: "active",
        } as never);
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Request updated" });
    },
    onError: handleError,
  });

  return {
    saveProfile,
    saveMentee,
    deleteMentee,
    saveSession,
    deleteSession,
    completeSession,
    respondToRequest,
  };
};

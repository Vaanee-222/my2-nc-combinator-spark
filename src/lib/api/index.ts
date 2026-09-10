/**
 * Xi Combinator — Unified API package
 * ------------------------------------
 * A single typed entry point for every backend read/write in the platform.
 * Prefer these functions over calling `supabase` directly from components so
 * that audit logging, validation and error shapes stay consistent.
 *
 * Usage:
 *   import { api } from "@/lib/api";
 *   const { data, error } = await api.cofounders.list({ reviewStatus: "pending" });
 *
 * Versioning: bump API_VERSION whenever a breaking change is made to any
 * exported signature, and document it in docs/API_REFERENCE.md.
 */
import { supabase } from "@/integrations/supabase/client";
import { logAudit, type AuditAction } from "@/lib/audit";

export const API_VERSION = "1.2.0";

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

const ok = <T,>(data: T): ApiResult<T> => ({ data, error: null });
const fail = <T,>(error: unknown): ApiResult<T> => ({
  data: null,
  error: error instanceof Error ? error.message : String(error),
});

/* ------------------------------------------------------------------ */
/* Audit                                                               */
/* ------------------------------------------------------------------ */
export const auditApi = {
  /** Record an admin action. Fire-and-forget, never throws. */
  record: (action: AuditAction, table: string, recordId?: string | null, details?: Record<string, any>) =>
    logAudit({ action, table, recordId, details }),

  /** Full audit history for one record, newest first. */
  async history(table: string, recordId: string): Promise<ApiResult<any[]>> {
    const { data, error } = await supabase
      .from("admin_audit_log")
      .select("*")
      .eq("table_name", table)
      .eq("record_id", recordId)
      .order("created_at", { ascending: false });
    return error ? fail(error) : ok(data ?? []);
  },

  async list(limit = 2000): Promise<ApiResult<any[]>> {
    const { data, error } = await supabase
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return error ? fail(error) : ok(data ?? []);
  },
};

/* ------------------------------------------------------------------ */
/* Notifications (email)                                               */
/* ------------------------------------------------------------------ */
export type NotificationEvent =
  | "introduction_approved"
  | "introduction_rejected"
  | "introduction_updated"
  | "cofounder_approved"
  | "cofounder_rejected"
  | "cofounder_updated"
  | "record_approved"
  | "record_rejected"
  | "record_updated";

export const notificationsApi = {
  /**
   * Send a transactional email through the `send-notification` edge function.
   * Degrades gracefully: if no email provider is configured the function
   * records the attempt and returns `{ delivered: false }`.
   */
  async send(params: {
    event: NotificationEvent;
    to: string;
    recipientName?: string | null;
    subjectContext?: string | null;
    notes?: string | null;
    recordId?: string | null;
    label?: string | null;
    status?: string | null;
  }): Promise<ApiResult<{ delivered: boolean; reason?: string }>> {
    try {
      const { data, error } = await supabase.functions.invoke("send-notification", { body: params });
      if (error) throw error;
      return ok(data as { delivered: boolean; reason?: string });
    } catch (e) {
      return fail(e);
    }
  },
};

/* ------------------------------------------------------------------ */
/* Co-founder requests                                                 */
/* ------------------------------------------------------------------ */
export type ReviewStatus = "pending" | "approved" | "rejected";

export const cofoundersApi = {
  async list(filters?: { reviewStatus?: ReviewStatus | "all"; status?: string | "all" }): Promise<ApiResult<any[]>> {
    let q = supabase.from("cofounder_requests").select("*").order("created_at", { ascending: false });
    if (filters?.reviewStatus && filters.reviewStatus !== "all") q = q.eq("review_status", filters.reviewStatus);
    if (filters?.status && filters.status !== "all") q = q.eq("status", filters.status);
    const { data, error } = await q;
    return error ? fail(error) : ok(data ?? []);
  },

  /** Approve / reject / re-open a single post and write an audit entry. */
  async review(id: string, review_status: ReviewStatus, review_notes?: string | null): Promise<ApiResult<true>> {
    const payload: Record<string, any> = { review_status, reviewed_at: new Date().toISOString() };
    if (review_notes !== undefined) payload.review_notes = review_notes || null;
    const { error } = await supabase.from("cofounder_requests").update(payload as any).eq("id", id);
    if (error) return fail(error);
    await auditApi.record(
      review_status === "approved" ? "status_change" : review_status === "rejected" ? "status_change" : "update",
      "cofounder_requests",
      id,
      { review_status, review_notes: review_notes ?? undefined },
    );
    return ok(true as const);
  },

  /** Bulk approve/reject. Returns the ids that succeeded. */
  async bulkReview(ids: string[], review_status: ReviewStatus, review_notes?: string | null): Promise<ApiResult<string[]>> {
    if (!ids.length) return ok([]);
    const payload: Record<string, any> = { review_status, reviewed_at: new Date().toISOString() };
    if (review_notes) payload.review_notes = review_notes;
    const { error } = await supabase.from("cofounder_requests").update(payload as any).in("id", ids);
    if (error) return fail(error);
    await auditApi.record("bulk_update", "cofounder_requests", null, {
      ids,
      count: ids.length,
      review_status,
      review_notes: review_notes ?? undefined,
    });
    return ok(ids);
  },

  async update(id: string, patch: Record<string, any>): Promise<ApiResult<true>> {
    const { error } = await supabase.from("cofounder_requests").update(patch as any).eq("id", id);
    if (error) return fail(error);
    await auditApi.record("update", "cofounder_requests", id, patch);
    return ok(true as const);
  },

  async remove(id: string): Promise<ApiResult<true>> {
    const { error } = await supabase.from("cofounder_requests").delete().eq("id", id);
    if (error) return fail(error);
    await auditApi.record("delete", "cofounder_requests", id, {});
    return ok(true as const);
  },
};

/* ------------------------------------------------------------------ */
/* Introduction requests                                               */
/* ------------------------------------------------------------------ */
export const introductionsApi = {
  async list(status?: ReviewStatus | "all"): Promise<ApiResult<any[]>> {
    let q = supabase.from("introduction_requests").select("*").order("created_at", { ascending: false });
    if (status && status !== "all") q = q.eq("status", status);
    const { data, error } = await q;
    return error ? fail(error) : ok(data ?? []);
  },

  async mine(): Promise<ApiResult<any[]>> {
    const { data, error } = await supabase
      .from("introduction_requests")
      .select("*")
      .order("created_at", { ascending: false });
    return error ? fail(error) : ok(data ?? []);
  },

  /** Change status, audit it, and email the requester. */
  async setStatus(row: any, status: ReviewStatus): Promise<ApiResult<true>> {
    const { error } = await supabase
      .from("introduction_requests")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) return fail(error);
    await auditApi.record("status_change", "introduction_requests", row.id, { status, investor: row.investor_name });
    if (row.contact_email && status !== "pending") {
      await notificationsApi.send({
        event: status === "approved" ? "introduction_approved" : "introduction_rejected",
        to: row.contact_email,
        recipientName: row.requester_name,
        subjectContext: row.investor_name,
        notes: row.admin_notes,
        recordId: row.id,
      });
    }
    return ok(true as const);
  },

  async setNotes(row: any, admin_notes: string | null): Promise<ApiResult<true>> {
    const { error } = await supabase.from("introduction_requests").update({ admin_notes }).eq("id", row.id);
    if (error) return fail(error);
    await auditApi.record("note", "introduction_requests", row.id, { admin_notes });
    if (row.contact_email) {
      await notificationsApi.send({
        event: "introduction_updated",
        to: row.contact_email,
        recipientName: row.requester_name,
        subjectContext: row.investor_name,
        notes: admin_notes,
        recordId: row.id,
      });
    }
    return ok(true as const);
  },
};

/* ------------------------------------------------------------------ */
/* Generic table helpers (applications, blogs, news, partners, …)      */
/* ------------------------------------------------------------------ */
export const tableApi = {
  async list(table: string, orderBy = "created_at"): Promise<ApiResult<any[]>> {
    const { data, error } = await (supabase as any).from(table).select("*").order(orderBy, { ascending: false });
    return error ? fail(error) : ok(data ?? []);
  },
  async create(table: string, values: Record<string, any>): Promise<ApiResult<any>> {
    const { data, error } = await (supabase as any).from(table).insert(values).select().single();
    if (error) return fail(error);
    await auditApi.record("create", table, data?.id ?? null, values);
    return ok(data);
  },
  async update(table: string, id: string, patch: Record<string, any>): Promise<ApiResult<true>> {
    const { error } = await (supabase as any).from(table).update(patch).eq("id", id);
    if (error) return fail(error);
    await auditApi.record("update", table, id, patch);
    return ok(true as const);
  },
  async remove(table: string, id: string): Promise<ApiResult<true>> {
    const { error } = await (supabase as any).from(table).delete().eq("id", id);
    if (error) return fail(error);
    await auditApi.record("delete", table, id, {});
    return ok(true as const);
  },
};

/* ------------------------------------------------------------------ */
/* Gamification (points, levels, badges, leaderboards)                 */
/* ------------------------------------------------------------------ */
export const gamificationApi = {
  /** Totals + level for one user (defaults to the signed-in user). */
  async points(userId: string): Promise<ApiResult<any>> {
    const { data, error } = await supabase.from("user_points").select("*").eq("user_id", userId).maybeSingle();
    return error ? fail(error) : ok(data);
  },
  /** Immutable XP ledger for one user, newest first. */
  async events(userId: string, limit = 100): Promise<ApiResult<any[]>> {
    const { data, error } = await supabase
      .from("point_events")
      .select("*")
      .eq("user_id", userId)
      .order("awarded_at", { ascending: false })
      .limit(limit);
    return error ? fail(error) : ok(data ?? []);
  },
  async badges(userId: string): Promise<ApiResult<any[]>> {
    const { data, error } = await supabase.from("user_badges").select("*").eq("user_id", userId);
    return error ? fail(error) : ok(data ?? []);
  },
  /** Monthly leaderboard RPC. `month` is any date inside the month. */
  async leaderboard(month: string, role?: string | null, limit = 50): Promise<ApiResult<any[]>> {
    const { data, error } = await (supabase as any).rpc("monthly_leaderboard", {
      _month: month,
      _role: role ?? null,
      _limit: limit,
    });
    return error ? fail(error) : ok(data ?? []);
  },
  /** Public, RLS-safe profile card (points, level, badges) for /member/:id. */
  async publicProfile(userId: string): Promise<ApiResult<any>> {
    const { data, error } = await (supabase as any).rpc("public_gamification", { _user_id: userId });
    return error ? fail(error) : ok(Array.isArray(data) ? data[0] ?? null : data);
  },
  /** Admin: grant or deduct XP with an audit trail. */
  async adjustPoints(userId: string, points: number, reason: string): Promise<ApiResult<string>> {
    const { data, error } = await (supabase as any).rpc("admin_adjust_points", {
      _user_id: userId,
      _points: points,
      _reason: reason,
    });
    if (error) return fail(error);
    await auditApi.record("update", "point_events", data ?? null, { user_id: userId, points, reason });
    return ok(data);
  },
  /** Admin: void a previously awarded ledger entry. */
  async voidEvent(eventId: string): Promise<ApiResult<string>> {
    const { data, error } = await (supabase as any).rpc("admin_void_point_event", { _event_id: eventId });
    if (error) return fail(error);
    await auditApi.record("delete", "point_events", eventId, {});
    return ok(data);
  },
  /** Admin: searchable directory of members with their totals. */
  async directory(search?: string | null, limit = 50): Promise<ApiResult<any[]>> {
    const { data, error } = await (supabase as any).rpc("admin_points_directory", {
      _search: search ?? null,
      _limit: limit,
    });
    return error ? fail(error) : ok(data ?? []);
  },
};

/* ------------------------------------------------------------------ */
/* Subscriptions, plans and usage quotas                               */
/* ------------------------------------------------------------------ */
export const subscriptionsApi = {
  /** Active plans, optionally narrowed to one audience (startup, investor, …). */
  async plans(audience?: string | null): Promise<ApiResult<any[]>> {
    let q = supabase.from("subscription_plans").select("*").eq("is_active", true).order("sort_order");
    if (audience) q = q.eq("audience", audience);
    const { data, error } = await q;
    return error ? fail(error) : ok(data ?? []);
  },
  /** Purchases visible to the signed-in user (RLS scoped). */
  async myPurchases(): Promise<ApiResult<any[]>> {
    const { data, error } = await supabase
      .from("subscription_purchases")
      .select("*")
      .order("purchased_at", { ascending: false });
    return error ? fail(error) : ok(data ?? []);
  },
  /** Increment a monthly quota counter and get the new value back. */
  async useQuota(counterKey: string, delta = 1): Promise<ApiResult<number>> {
    const { data, error } = await (supabase as any).rpc("increment_usage_counter", {
      _counter_key: counterKey,
      _delta: delta,
    });
    return error ? fail(error) : ok(Number(data ?? 0));
  },
  async counters(): Promise<ApiResult<any[]>> {
    const { data, error } = await supabase.from("usage_counters").select("*");
    return error ? fail(error) : ok(data ?? []);
  },
};

/* ------------------------------------------------------------------ */
/* Generic review workflow (applications, grants, deals, inquiries, …) */
/* ------------------------------------------------------------------ */
export const recordsApi = {
  /**
   * Change a record's `status`, write an audit entry and — when a contact
   * email is supplied — notify the submitter through `send-notification`.
   */
  async setStatus(
    table: string,
    row: any,
    status: string,
    opts?: { label?: string; notes?: string | null; emailField?: string; nameField?: string; contextField?: string },
  ): Promise<ApiResult<true>> {
    const patch: Record<string, any> = { status };
    if (opts?.notes !== undefined) patch.admin_notes = opts.notes;
    const { error } = await (supabase as any).from(table).update(patch).eq("id", row.id);
    if (error) return fail(error);
    await auditApi.record("status_change", table, row.id, patch);
    const to = row[opts?.emailField ?? "email"];
    if (to) {
      await notificationsApi.send({
        event: status === "approved" ? "record_approved" : status === "rejected" ? "record_rejected" : "record_updated",
        to,
        recipientName: row[opts?.nameField ?? "applicant_name"] ?? row.full_name ?? row.name ?? null,
        subjectContext: row[opts?.contextField ?? "startup_name"] ?? opts?.label ?? null,
        notes: opts?.notes ?? row.admin_notes ?? null,
        recordId: row.id,
        label: opts?.label ?? null,
        status,
      });
    }
    return ok(true as const);
  },
};

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */
export const newsletterApi = {
  /** Public subscribe. Duplicate addresses resolve to `{ duplicate: true }`. */
  async subscribe(email: string): Promise<ApiResult<{ duplicate: boolean }>> {
    const clean = email.trim().toLowerCase();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: clean });
    if (error) {
      if ((error as any).code === "23505") return ok({ duplicate: true });
      return fail(error);
    }
    return ok({ duplicate: false });
  },
  /** Admin list of subscribers, newest first. */
  async list(status?: string | null): Promise<ApiResult<any[]>> {
    let q = supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    return error ? fail(error) : ok(data ?? []);
  },
  /** Admin: unsubscribe / re-activate an address. */
  async setStatus(id: string, status: string): Promise<ApiResult<true>> {
    const { error } = await supabase.from("newsletter_subscribers").update({ status }).eq("id", id);
    if (error) return fail(error);
    await auditApi.record("status_change", "newsletter_subscribers", id, { status });
    return ok(true as const);
  },
};

/* ------------------------------------------------------------------ */
/* Site settings (CMS)                                                 */
/* ------------------------------------------------------------------ */
export const settingsApi = {
  /** The single site_settings row (branding, SEO, contact, socials). */
  async get(): Promise<ApiResult<any>> {
    const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
    return error ? fail(error) : ok(data);
  },
  /** Admin: patch the live settings row and audit the change. */
  async update(id: string, patch: Record<string, any>): Promise<ApiResult<true>> {
    const { error } = await supabase.from("site_settings").update(patch as any).eq("id", id);
    if (error) return fail(error);
    await auditApi.record("update", "site_settings", id, patch);
    return ok(true as const);
  },
  /** Admin: stash an unpublished draft without touching the live values. */
  async saveDraft(id: string, draft: Record<string, any>): Promise<ApiResult<true>> {
    const { error } = await supabase
      .from("site_settings")
      .update({ draft_settings: draft as any, has_draft: true })
      .eq("id", id);
    if (error) return fail(error);
    await auditApi.record("update", "site_settings", id, { draft: true });
    return ok(true as const);
  },
  /** Admin: promote the stored draft to live and clear it. */
  async publishDraft(id: string, draft: Record<string, any>): Promise<ApiResult<true>> {
    const { error } = await supabase
      .from("site_settings")
      .update({ ...(draft as any), draft_settings: null, has_draft: false })
      .eq("id", id);
    if (error) return fail(error);
    await auditApi.record("status_change", "site_settings", id, { published: true });
    return ok(true as const);
  },
};

/* ------------------------------------------------------------------ */
/* Direct messages                                                     */
/* ------------------------------------------------------------------ */
export const messagesApi = {
  /** Every message the signed-in user can see (RLS scoped), oldest first. */
  async inbox(limit = 500): Promise<ApiResult<any[]>> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(limit);
    return error ? fail(error) : ok(data ?? []);
  },
  /** One conversation between the signed-in user and `otherUserId`. */
  async thread(userId: string, otherUserId: string, limit = 200): Promise<ApiResult<any[]>> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`,
      )
      .order("created_at", { ascending: true })
      .limit(limit);
    return error ? fail(error) : ok(data ?? []);
  },
  async send(senderId: string, receiverId: string, content: string): Promise<ApiResult<any>> {
    const body = content.trim();
    if (!body) return fail("Message cannot be empty");
    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: senderId, receiver_id: receiverId, content: body })
      .select()
      .single();
    return error ? fail(error) : ok(data);
  },
  /** Mark every message received from one sender as read. */
  async markRead(userId: string, otherUserId: string): Promise<ApiResult<true>> {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("receiver_id", userId)
      .eq("sender_id", otherUserId)
      .eq("is_read", false);
    return error ? fail(error) : ok(true as const);
  },
  async unreadCount(userId: string): Promise<ApiResult<number>> {
    const { count, error } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", userId)
      .eq("is_read", false);
    return error ? fail(error) : ok(count ?? 0);
  },
};

/* ------------------------------------------------------------------ */
/* Media library (storage-backed assets)                               */
/* ------------------------------------------------------------------ */
export const mediaApi = {
  async list(): Promise<ApiResult<any[]>> {
    const { data, error } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });
    return error ? fail(error) : ok(data ?? []);
  },
  /** Upload to the `partner-logos` bucket and register the asset row. */
  async upload(file: File, folder = "general", bucket = "partner-logos"): Promise<ApiResult<any>> {
    try {
      const safeName = file.name.replace(/[^\w.-]+/g, "-");
      const path = `media/${folder}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("media_assets")
        .insert({
          file_name: file.name,
          folder,
          storage_path: path,
          url: pub.publicUrl,
          mime_type: file.type || null,
          size_bytes: file.size,
          uploaded_by: auth?.user?.id ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      await auditApi.record("create", "media_assets", data?.id ?? null, { name: file.name });
      return ok(data);
    } catch (e) {
      return fail(e);
    }
  },
  async remove(id: string): Promise<ApiResult<true>> {
    const { error } = await supabase.from("media_assets").delete().eq("id", id);
    if (error) return fail(error);
    await auditApi.record("delete", "media_assets", id, {});
    return ok(true as const);
  },
};

export const api = {
  version: API_VERSION,
  audit: auditApi,
  cofounders: cofoundersApi,
  introductions: introductionsApi,
  notifications: notificationsApi,
  gamification: gamificationApi,
  subscriptions: subscriptionsApi,
  records: recordsApi,
  newsletter: newsletterApi,
  settings: settingsApi,
  messages: messagesApi,
  media: mediaApi,
  table: tableApi,
};

export default api;

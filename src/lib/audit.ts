import { supabase } from "@/integrations/supabase/client";

export type AuditAction = "create" | "update" | "delete" | "bulk_update" | "bulk_delete" | "note" | "status_change" | "password_change";

interface AuditEntry {
  action: AuditAction;
  table: string;
  recordId?: string | null;
  details?: Record<string, any>;
}

/**
 * Fire-and-forget audit log writer. Silently no-ops if user isn't an admin
 * (RLS will reject). Never throws to the caller.
 */
export async function logAudit({ action, table, recordId, details }: AuditEntry) {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;
    await supabase.from("admin_audit_log").insert({
      admin_user_id: user.id,
      admin_email: user.email ?? null,
      action_type: action,
      table_name: table,
      record_id: recordId ? String(recordId) : null,
      details: details ?? null,
    } as any);
  } catch {
    // ignore
  }
}

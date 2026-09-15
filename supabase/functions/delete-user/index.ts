import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const uuidSchema = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) throw new Error("Authentication required");

    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anonKey || !serviceKey) throw new Error("Server configuration unavailable");

    const callerClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await callerClient.auth.getUser();
    if (userError || !userData.user) throw new Error("Invalid session");

    const { data: isAdmin, error: roleError } = await callerClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleError || !isAdmin) throw new Error("Admin access required");

    const body = await req.json();
    const userIds = Array.isArray(body?.userIds) ? body.userIds : [];
    if (userIds.length === 0 || userIds.length > 100 || userIds.some((id: unknown) => typeof id !== "string" || !uuidSchema.test(id))) {
      throw new Error("Provide between 1 and 100 valid user IDs");
    }
    if (userIds.includes(userData.user.id)) throw new Error("You cannot delete your own account");

    const admin = createClient(url, serviceKey);
    const { data: adminRows, error: adminRowsError } = await admin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    if (adminRowsError) throw adminRowsError;
    const adminIds = new Set((adminRows ?? []).map((row) => row.user_id));
    const adminsBeingDeleted = userIds.filter((id: string) => adminIds.has(id)).length;
    if (adminIds.size - adminsBeingDeleted < 1) throw new Error("At least one administrator must remain");

    const deleted: string[] = [];
    for (const userId of userIds) {
      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) throw error;
      deleted.push(userId);
    }

    await admin.from("admin_audit_log").insert({
      admin_user_id: userData.user.id,
      admin_email: userData.user.email ?? null,
      action_type: deleted.length > 1 ? "bulk_delete" : "delete",
      table_name: "auth.users",
      details: { count: deleted.length, user_ids: deleted },
    });

    return new Response(JSON.stringify({ deleted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete user";
    const status = message.includes("access") || message.includes("session") || message.includes("Authentication") ? 403 : 400;
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
// Transactional email notifications for admin review actions.
// Sends via Resend when RESEND_API_KEY is configured; otherwise records the
// attempt and returns { delivered: false } so the UI can degrade gracefully.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Event =
  | "introduction_approved"
  | "introduction_rejected"
  | "introduction_updated"
  | "cofounder_approved"
  | "cofounder_rejected"
  | "cofounder_updated"
  | "record_approved"
  | "record_rejected"
  | "record_updated";

const TEMPLATES: Record<Event, (ctx: Ctx) => { subject: string; html: string }> = {
  introduction_approved: (c) => ({
    subject: `Your introduction request to ${c.context} was approved`,
    html: body(c, `Good news, ${c.name}! Your introduction request to <b>${c.context}</b> has been <b>approved</b>. Our team will connect you over email shortly.`),
  }),
  introduction_rejected: (c) => ({
    subject: `Update on your introduction request to ${c.context}`,
    html: body(c, `Hi ${c.name}, after review your introduction request to <b>${c.context}</b> was <b>not approved</b> at this time. You're welcome to apply again with more traction details.`),
  }),
  introduction_updated: (c) => ({
    subject: `Your introduction request to ${c.context} was updated`,
    html: body(c, `Hi ${c.name}, an admin updated the review of your introduction request to <b>${c.context}</b>.`),
  }),
  cofounder_approved: (c) => ({
    subject: `Your co-founder post is now live`,
    html: body(c, `Hi ${c.name}, your co-founder post <b>${c.context}</b> was <b>approved</b> and is now visible on the public Community Posts page.`),
  }),
  cofounder_rejected: (c) => ({
    subject: `Your co-founder post needs changes`,
    html: body(c, `Hi ${c.name}, your co-founder post <b>${c.context}</b> was <b>not approved</b>. Please review the notes below and resubmit.`),
  }),
  cofounder_updated: (c) => ({
    subject: `Your co-founder post was updated by a reviewer`,
    html: body(c, `Hi ${c.name}, a reviewer updated your co-founder post <b>${c.context}</b>.`),
  }),
  record_approved: (c) => ({
    subject: `${c.label ?? "Your submission"} was approved`,
    html: body(c, `Hi ${c.name}, your ${(c.label ?? "submission").toLowerCase()} <b>${c.context}</b> has been <b>approved</b>. Our team will follow up with next steps.`),
  }),
  record_rejected: (c) => ({
    subject: `Update on your ${(c.label ?? "submission").toLowerCase()}`,
    html: body(c, `Hi ${c.name}, after review your ${(c.label ?? "submission").toLowerCase()} <b>${c.context}</b> was <b>not approved</b> at this time.`),
  }),
  record_updated: (c) => ({
    subject: `Your ${(c.label ?? "submission").toLowerCase()} status changed to ${c.status ?? "updated"}`,
    html: body(c, `Hi ${c.name}, the status of your ${(c.label ?? "submission").toLowerCase()} <b>${c.context}</b> is now <b>${c.status ?? "updated"}</b>.`),
  }),
};

interface Ctx { name: string; context: string; notes?: string | null; label?: string | null; status?: string | null }

function body(c: Ctx, message: string) {
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#0b0b0d;color:#e8e8ea;padding:32px">
    <h2 style="color:#f97316;margin:0 0 16px">Xi Combinator</h2>
    <p style="line-height:1.6">${message}</p>
    ${c.notes ? `<div style="margin-top:16px;padding:12px 16px;border-left:3px solid #f97316;background:#141417"><b>Reviewer notes</b><br/>${c.notes}</div>` : ""}
    <p style="margin-top:24px;font-size:12px;color:#8a8a92">This is an automated message from the Xi Combinator platform.</p>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { event, to, recipientName, subjectContext, notes, recordId } = await req.json();
    if (!event || !to) throw new Error("event and to are required");
    const tpl = TEMPLATES[event as Event];
    if (!tpl) throw new Error(`Unknown event: ${event}`);

    const { subject, html } = tpl({
      name: recipientName || "there",
      context: subjectContext || "your request",
      notes,
    });

    const apiKey = Deno.env.get("RESEND_API_KEY");
    let delivered = false;
    let reason: string | undefined;

    if (apiKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: Deno.env.get("NOTIFY_FROM_EMAIL") || "Xi Combinator <onboarding@resend.dev>",
          to: [to],
          subject,
          html,
        }),
      });
      delivered = res.ok;
      if (!res.ok) reason = await res.text();
    } else {
      reason = "No email provider configured (RESEND_API_KEY missing) — notification logged only.";
    }

    // Best-effort delivery record
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      await supabase.from("admin_audit_log").insert({
        action_type: "note",
        table_name: "email_notifications",
        record_id: recordId ?? null,
        details: { event, to, subject, delivered, reason },
      });
    } catch (_) { /* non-fatal */ }

    console.log("notification", { event, to, delivered, reason });
    return new Response(JSON.stringify({ delivered, reason, subject }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-notification error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

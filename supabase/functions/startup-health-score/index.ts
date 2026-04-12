import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { startup_name, founder_name, industry, stage, description, team_size, funding_status } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Analyze this startup and return a JSON health score assessment.

Startup: ${startup_name}
Founder: ${founder_name}
Industry: ${industry}
Stage: ${stage}
Description: ${description}
Team Size: ${team_size}
Funding Status: ${funding_status}

Return ONLY valid JSON with this structure:
{
  "overallScore": <number 0-100>,
  "category": <"Launch Ready"|"Promising"|"Needs Work"|"Early Stage">,
  "dimensions": [
    {"name": "Market Opportunity", "score": <0-100>, "feedback": "<1 sentence>"},
    {"name": "Team Strength", "score": <0-100>, "feedback": "<1 sentence>"},
    {"name": "Product Readiness", "score": <0-100>, "feedback": "<1 sentence>"},
    {"name": "Business Model", "score": <0-100>, "feedback": "<1 sentence>"},
    {"name": "Fundability", "score": <0-100>, "feedback": "<1 sentence>"}
  ],
  "recommendations": ["<actionable tip 1>", "<actionable tip 2>", "<actionable tip 3>"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a startup analyst. Return only valid JSON, no markdown." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response (handle potential markdown wrapping)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse AI response");
    
    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("startup-health-score error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

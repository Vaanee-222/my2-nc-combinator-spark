import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const demoUsers = [
    { email: "admin@incombinator.com", password: "Demo@1234", fullName: "Admin User", role: "admin" },
    { email: "startup@incombinator.com", password: "Demo@1234", fullName: "Priya Sharma", role: "startup" },
    { email: "investor@incombinator.com", password: "Demo@1234", fullName: "Rahul Verma", role: "investor" },
    { email: "mentor@incombinator.com", password: "Demo@1234", fullName: "Dr. Anita Singh", role: "mentor" },
    { email: "cofounder@incombinator.com", password: "Demo@1234", fullName: "Vikram Patel", role: "cofounder" },
  ];

  const results: string[] = [];

  for (const u of demoUsers) {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const exists = existingUsers?.users?.find((eu: any) => eu.email === u.email);
    if (exists) {
      // Ensure role exists
      await supabase.from("user_roles").upsert(
        { user_id: exists.id, role: u.role },
        { onConflict: "user_id,role" }
      );
      results.push(`${u.email} already exists`);
      continue;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.fullName },
    });

    if (error) {
      results.push(`${u.email}: ERROR - ${error.message}`);
      continue;
    }

    if (data.user) {
      await supabase.from("user_roles").insert({
        user_id: data.user.id,
        role: u.role,
      });
      results.push(`${u.email}: Created (${u.role})`);
    }
  }

  // Seed demo applications
  const { data: startupUser } = await supabase.auth.admin.listUsers();
  const startupId = startupUser?.users?.find((u: any) => u.email === "startup@incombinator.com")?.id;

  if (startupId) {
    const { data: existingApps } = await supabase.from("applications").select("id").eq("user_id", startupId);
    if (!existingApps?.length) {
      await supabase.from("applications").insert([
        { user_id: startupId, program: "MVP Lab", applicant_name: "Priya Sharma", email: "startup@incombinator.com", startup_name: "AI Healthcare Solutions", description: "AI-powered diagnostic platform for rural healthcare", status: "pending" },
        { user_id: startupId, program: "INC Lab", applicant_name: "Priya Sharma", email: "startup@incombinator.com", startup_name: "AI Healthcare Solutions", description: "Full incubation program application", status: "under_review" },
      ]);
      results.push("Demo applications seeded");
    }

    const { data: existingHack } = await supabase.from("hackathon_registrations").select("id").eq("user_id", startupId);
    if (!existingHack?.length) {
      await supabase.from("hackathon_registrations").insert({
        user_id: startupId, full_name: "Priya Sharma", email: "startup@incombinator.com",
        phone: "+91-9876543210", age: "28", city: "Bangalore", college: "IIT Bangalore",
        graduation: "2020", programming_languages: "Python, JavaScript, TypeScript",
        experience: "5 years", frameworks: "React, TensorFlow, FastAPI",
        specialization: "AI/ML", github_profile: "https://github.com/priyasharma",
        status: "pending",
      });
      results.push("Demo hackathon registration seeded");
    }

    const { data: existingInc } = await supabase.from("incubation_applications").select("id").eq("user_id", startupId);
    if (!existingInc?.length) {
      await supabase.from("incubation_applications").insert({
        user_id: startupId, founder_name: "Priya Sharma", email: "startup@incombinator.com",
        phone: "+91-9876543210", startup_name: "AI Healthcare Solutions",
        industry: "HealthTech", stage: "MVP", description: "AI diagnostic platform revolutionizing rural healthcare access",
        team_size: "5", funding_status: "Pre-Seed", status: "pending",
      });
      results.push("Demo incubation application seeded");
    }

    const { data: existingCofound } = await supabase.from("cofounder_requests").select("id").eq("user_id", startupId);
    if (!existingCofound?.length) {
      await supabase.from("cofounder_requests").insert({
        user_id: startupId, title: "Looking for CTO - AI HealthTech Startup",
        description: "Seeking a technical co-founder with AI/ML expertise to build our diagnostic platform",
        skills_needed: "AI/ML, Python, System Architecture", equity_offered: "15-20%",
        commitment: "Full-time", location: "Bangalore / Remote",
        contact_email: "startup@incombinator.com", status: "active",
      });
      results.push("Demo cofounder request seeded");
    }
  }

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

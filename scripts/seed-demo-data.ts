/**
 * One-off seed: pushes the repo's demo/seed data into the database so every
 * listing on the website is DB-driven and manageable from the admin dashboard.
 * Run with: bun run scripts/seed-demo-data.ts
 */
import { createClient } from "@supabase/supabase-js";
import { GLOBAL_STARTUPS } from "../src/data/globalStartups";
import { BLOGS_2026 } from "../src/data/blogs2026";
import { NEWS_2026 } from "../src/data/news2026";
import { monthlyTop10, quarterlyTop5 } from "../src/data/cohorts";
import { advisoryBoard } from "../src/data/advisoryBoard";
import { featuredInvestors } from "../src/data/investors";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const db = createClient(url, key, { auth: { persistSession: false } });

const report = (label: string, error: unknown, count: number) =>
  console.log(`${label}: ${error ? `ERROR ${JSON.stringify(error)}` : `${count} rows`}`);

async function main() {
  // Startup directory
  {
    const rows = GLOBAL_STARTUPS.map((s, i) => ({ ...s, sort_order: i, is_active: true }));
    const { error } = await db.from("startups").upsert(rows, { onConflict: "slug" });
    report("startups", error, rows.length);
  }

  // Blogs
  {
    const rows = BLOGS_2026.map((b) => ({
      ...b,
      is_published: true,
      meta_title: b.title,
      meta_description: b.excerpt,
    }));
    const { error } = await db.from("blogs").upsert(rows, { onConflict: "slug" });
    report("blogs", error, rows.length);
  }

  // News
  {
    const rows = NEWS_2026.map((n) => ({
      ...n,
      is_published: true,
      meta_title: n.title,
      meta_description: n.excerpt,
    }));
    const { error } = await db.from("news").upsert(rows, { onConflict: "slug" });
    report("news", error, rows.length);
  }

  // Cohort startups (monthly top 10 + quarterly top 5)
  {
    const rows = [
      ...monthlyTop10.map((c, i) => ({ cohort_type: "monthly", sort_order: i, ...c })),
      ...quarterlyTop5.map((c, i) => ({ cohort_type: "quarterly", sort_order: i, ...c })),
    ].map(({ id, ...rest }) => ({ external_id: id, is_visible: true, ...rest }));
    const { error } = await db.from("cohort_startups").upsert(rows, { onConflict: "external_id" });
    report("cohort_startups", error, rows.length);
  }

  // Advisory board
  {
    const { data: existing } = await db.from("advisors").select("id");
    if (!existing?.length) {
      const rows = advisoryBoard.map((a, i) => ({
        name: a.name,
        role: a.role,
        company: a.company,
        country: a.country,
        expertise: a.expertise,
        description: a.description,
        linkedin_url: a.linkedin,
        tier: a.tier,
        sort_order: i,
        is_active: true,
      }));
      const { error } = await db.from("advisors").insert(rows);
      report("advisors", error, rows.length);
    } else {
      console.log(`advisors: skipped (${existing.length} existing rows)`);
    }
  }

  // Investors
  {
    const { data: existing } = await db.from("investors").select("name");
    const have = new Set((existing ?? []).map((r: { name: string }) => r.name));
    const rows = featuredInvestors
      .filter((i) => !have.has(i.name))
      .map((i) => ({
        name: i.name,
        check_size: i.checkSize,
        portfolio_count: i.portfolio ?? 0,
        stage: i.stage ?? null,
        status: "Active",
        website_url: i.website ? `https://${i.website}` : null,
        notes: i.description ?? null,
      }));
    if (rows.length) {
      const { error } = await db.from("investors").insert(rows);
      report("investors", error, rows.length);
    } else {
      console.log("investors: nothing new");
    }
  }
}

main();

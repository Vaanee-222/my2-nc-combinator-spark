// Resolves startup profile data by id across the demo data sources:
// WeeklyShowcase (ids "1","2","3"), monthlyTop10 (ids like "2026-05-1"),
// quarterlyTop5, and GLOBAL_STARTUPS (matched by slug or index).

import { monthlyTop10, quarterlyTop5 } from "./cohorts";
import { GLOBAL_STARTUPS } from "./globalStartups";

export type StartupProfile = {
  id: string;
  name: string;
  founder: string;
  coFounders: string[];
  category: string;
  description: string;
  longDescription: string;
  stage: string;
  funding: string;
  valuation: string;
  impact: string;
  location: string;
  team: number;
  founded: string;
  website: string;
  email: string;
  phone: string;
  logo: string;
  metrics: { revenue: string; growth: string; customers: string; retention: string };
  milestones: { date: string; title: string; description: string }[];
  investors: string[];
  technologies: string[];
};

const weeklyShowcase: Record<string, Partial<StartupProfile>> = {
  "1": {
    name: "AgriTech Solutions",
    founder: "Rajesh Kumar",
    coFounders: ["Priya Sharma", "Amit Patel"],
    category: "Agriculture",
    description: "AI-powered crop monitoring system helping farmers increase yield by 40%.",
    stage: "Seed",
    funding: "$250K raised",
    valuation: "$1.8M",
    impact: "50,000+ farmers impacted",
    location: "Bangalore, India",
    team: 12,
    founded: "2022",
    website: "https://agritechsolutions.example.com",
    technologies: ["Python", "TensorFlow", "AWS", "IoT"],
  },
  "2": {
    name: "HealthBridge",
    founder: "Dr. Sneha Reddy",
    coFounders: ["Vikram Iyer"],
    category: "Healthcare",
    description: "Telemedicine platform connecting rural patients with urban specialists.",
    stage: "Series A",
    funding: "$1.8M raised",
    valuation: "$12M",
    impact: "1M+ consultations",
    location: "Hyderabad, India",
    team: 48,
    founded: "2020",
    website: "https://healthbridge.example.com",
    technologies: ["React Native", "Node.js", "GCP", "WebRTC"],
  },
  "3": {
    name: "EduTech Pro",
    founder: "Karan Mehta",
    coFounders: ["Anita Joshi"],
    category: "Education",
    description: "Vernacular language learning platform for skill development.",
    stage: "Pre-seed",
    funding: "$60K raised",
    valuation: "$600K",
    impact: "200K+ students",
    location: "Pune, India",
    team: 8,
    founded: "2023",
    website: "https://edutechpro.example.com",
    technologies: ["Next.js", "Postgres", "Supabase", "AI"],
  },
};

function fillDefaults(base: Partial<StartupProfile>, id: string): StartupProfile {
  const name = base.name ?? "Startup";
  return {
    id,
    name,
    founder: base.founder ?? "Founder",
    coFounders: base.coFounders ?? [],
    category: base.category ?? "Technology",
    description: base.description ?? "Innovative company solving real problems.",
    longDescription:
      base.longDescription ??
      `${name} is building differentiated technology in the ${base.category ?? "technology"} space with a strong founding team and growing customer traction.`,
    stage: base.stage ?? "Seed",
    funding: base.funding ?? "Undisclosed",
    valuation: base.valuation ?? "N/A",
    impact: base.impact ?? "Emerging traction",
    location: base.location ?? "Global",
    team: base.team ?? 10,
    founded: base.founded ?? "2023",
    website: base.website ?? "https://example.com",
    email: base.email ?? `hello@${(name || "startup").toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    phone: base.phone ?? "+1-000-000-0000",
    logo: base.logo ?? "/placeholder.svg",
    metrics: base.metrics ?? { revenue: "$100K ARR", growth: "200% YoY", customers: "1K+", retention: "90%" },
    milestones:
      base.milestones ?? [
        { date: "2026-01", title: "Milestone", description: `Key milestone for ${name}.` },
        { date: "2025-06", title: "Launch", description: `Public launch of ${name}.` },
      ],
    investors: base.investors ?? ["Angel investors", "Ecosystem partners"],
    technologies: base.technologies ?? ["React", "Node.js", "Postgres"],
  };
}

export function resolveStartupProfile(id: string | undefined): StartupProfile {
  const key = id ?? "1";

  // 1) WeeklyShowcase demo entries
  if (weeklyShowcase[key]) return fillDefaults(weeklyShowcase[key]!, key);

  // 2) Cohort startups (monthly / quarterly)
  const cohort = [...monthlyTop10, ...quarterlyTop5].find((s) => s.id === key);
  if (cohort) {
    return fillDefaults(
      {
        name: cohort.name,
        founder: cohort.founder,
        category: cohort.category,
        description: cohort.description,
        stage: cohort.stage,
        impact: cohort.traction,
      },
      key,
    );
  }

  // 3) Global startups seed (by slug)
  const g = GLOBAL_STARTUPS.find((s) => s.slug === key);
  if (g) {
    return fillDefaults(
      {
        name: g.name,
        founder: `${g.name} Founding Team`,
        category: g.sector,
        description: g.description,
        stage: g.stage,
        location: `${g.headquarters}, ${g.country}`,
        founded: String(g.founded_year),
        website: `https://${g.website}`,
        technologies: g.tags,
      },
      key,
    );
  }

  // 4) Fallback
  return fillDefaults({ name: `Startup #${key}` }, key);
}

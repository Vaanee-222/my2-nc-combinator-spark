export type CohortStartup = {
  id: string;
  name: string;
  founder: string;
  category: string;
  description: string;
  stage: string;
  traction: string;
  status: "Selected" | "Under Review" | "Advanced";
  period: string; // YYYY-MM for monthly, YYYY-Q# for quarterly
  highlight?: string;
};

const months = ["2026-05", "2026-04", "2026-03", "2026-02", "2026-01", "2025-12"];

const categories = ["FinTech", "HealthTech", "EdTech", "CleanTech", "AgriTech", "Logistics", "SaaS", "DeepTech"];
const stages = ["Pre-Seed", "Seed", "Series A"];

const sampleNames = [
  ["NeoFinance", "Rahul Sharma", "Digital banking for rural India"],
  ["GreenEnergy Solutions", "Priya Patel", "Solar panel leasing platform"],
  ["LogiChain", "Arjun Singh", "AI-powered supply chain optimization"],
  ["MedAssist", "Dr. Sneha Reddy", "AI diagnosis assistant for rural clinics"],
  ["SkillBridge", "Vikash Kumar", "Vocational training in vernacular languages"],
  ["FarmIQ", "Anita Joshi", "IoT-driven precision agriculture"],
  ["EduSpark", "Karan Mehta", "K-12 personalized learning"],
  ["PayWave", "Neha Kapoor", "Cross-border payments for SMBs"],
  ["BuildOps", "Sahil Khan", "Construction project SaaS"],
  ["HealthLoop", "Dr. Ayesha Iyer", "Remote patient monitoring"],
  ["GridSmart", "Manoj Verma", "Smart-grid analytics"],
  ["AgriBazaar", "Sunita Rao", "Direct-to-mandi marketplace"],
];

export const monthlyTop10: CohortStartup[] = months.flatMap((m, mi) =>
  sampleNames.slice(0, 10).map((n, i): CohortStartup => ({
    id: `${m}-${i + 1}`,
    name: n[0],
    founder: n[1],
    description: n[2],
    category: categories[(i + mi) % categories.length],
    stage: stages[i % stages.length],
    traction: ["$10L MRR", "5K users", "12 pilots", "$50L ARR", "2K paying users"][i % 5],
    status: i < 5 ? "Selected" : "Under Review",
    period: m,
  }))
);

const quarters = ["2026-Q2", "2026-Q1", "2025-Q4", "2025-Q3"];

export const quarterlyTop5: CohortStartup[] = quarters.flatMap((q, qi) =>
  sampleNames.slice(0, 5).map((n, i): CohortStartup => ({
    id: `${q}-${i + 1}`,
    name: n[0],
    founder: n[1],
    description: n[2],
    category: categories[(i + qi * 2) % categories.length],
    stage: stages[(i + 1) % stages.length],
    traction: ["$1Cr ARR", "50K users", "100+ enterprise customers", "$2Cr GMV", "30 active pilots"][i],
    status: "Advanced",
    period: q,
    highlight: ["10x QoQ", "Profitable", "Backed by 3 VCs", "Govt. tender win", "Featured in YourStory"][i],
  }))
);

export const availableMonths = months;
export const availableQuarters = quarters;
export const availableCategories = ["All", ...categories];

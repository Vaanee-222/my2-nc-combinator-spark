// 2026 thought-leadership articles seeded into the `blogs` table.
export type BlogSeed = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: "Funding Analysis" | "Founder Playbook" | "Ecosystem Insights" | "Market Commentary" | "AI & Tech";
  tags: string[];
  read_time_minutes: number;
  published_at: string; // ISO
  is_featured?: boolean;
};

const long = (s: string) => s.trim();

export const BLOGS_2026: BlogSeed[] = [
  {
    slug: "why-mistral-raised-1b-2026",
    title: "Why Mistral AI Raised $1B at a $14B Valuation in 2026",
    excerpt: "Europe's open-weight LLM bet just got bigger. Here's what made the deal happen and what it means for global AI competition.",
    content: long(`Mistral AI's latest round signals a structural shift in how investors price open-weight model providers. We break down the deal mechanics, the strategic backing from sovereign funds, and three lessons founders should take from the cap-table strategy.`),
    author: "Xi Combinator Research",
    category: "Funding Analysis",
    tags: ["AI", "Europe", "Mega Round"],
    read_time_minutes: 9,
    published_at: "2026-05-22T09:00:00Z",
    is_featured: true,
  },
  {
    slug: "founder-playbook-distribution-first-2026",
    title: "The Distribution-First Founder Playbook",
    excerpt: "Product-led growth alone no longer wins. Modern founders win on distribution. A field guide for 2026.",
    content: long(`We profile six breakout founders who treated GTM as the product, including their first-100-customer motions, partnership leverage, and content engines.`),
    author: "Priya Sharma",
    category: "Founder Playbook",
    tags: ["GTM", "Distribution", "Growth"],
    read_time_minutes: 12,
    published_at: "2026-05-15T09:00:00Z",
  },
  {
    slug: "indian-saas-global-from-day-one-2026",
    title: "Indian SaaS, Global From Day One: 2026 State of the Union",
    excerpt: "How a new wave of Indian SaaS startups skips the domestic-first playbook entirely.",
    content: long(`Analysis of 47 Indian SaaS companies founded since 2024 that landed their first 50 customers outside India. We cover pricing, hiring, and stack choices.`),
    author: "Ravi Kumar",
    category: "Ecosystem Insights",
    tags: ["SaaS", "India", "Global"],
    read_time_minutes: 10,
    published_at: "2026-05-08T09:00:00Z",
  },
  {
    slug: "agent-economy-2026",
    title: "The Agent Economy Is Here — What It Means For Builders",
    excerpt: "Autonomous AI agents are no longer demos. They're moving real money and creating new platform risk.",
    content: long(`A founder-grade overview of agent stacks, monetization patterns, and the open questions about liability and safety.`),
    author: "Sunny Ahlawat",
    category: "AI & Tech",
    tags: ["AI", "Agents", "Platforms"],
    read_time_minutes: 11,
    published_at: "2026-04-30T09:00:00Z",
    is_featured: true,
  },
  {
    slug: "seed-rounds-shrink-series-a-bar-rises-2026",
    title: "Seed Rounds Are Shrinking. The Series A Bar Just Rose Again.",
    excerpt: "Median seed size dropped 18% YoY. Median ARR at Series A climbed to $2.4M. Here's the data.",
    content: long(`Quarterly funding data across 1,200 deals shows a tightening seed market and a sharply higher bar for Series A. We compare across regions and sectors.`),
    author: "Xi Combinator Research",
    category: "Market Commentary",
    tags: ["VC", "Funding", "Data"],
    read_time_minutes: 8,
    published_at: "2026-04-22T09:00:00Z",
  },
  {
    slug: "your-first-10-enterprise-customers-2026",
    title: "Your First 10 Enterprise Customers: A Tactical Guide",
    excerpt: "From procurement loops to security questionnaires, here's the operational playbook.",
    content: long(`Co-written with three Xi Combinator alumni who landed Fortune 500 customers in their first 12 months.`),
    author: "Amit Singh",
    category: "Founder Playbook",
    tags: ["Sales", "Enterprise", "GTM"],
    read_time_minutes: 14,
    published_at: "2026-04-15T09:00:00Z",
  },
  {
    slug: "mena-fintech-rising-2026",
    title: "MENA FinTech Is Quietly Becoming the Most Interesting Region",
    excerpt: "Regulation, demographics, and capital alignment are stacking in Gulf founders' favor.",
    content: long(`We map 38 MENA fintech companies that crossed $10M ARR in the last 18 months and what makes the region's playbook unique.`),
    author: "Xi Combinator Research",
    category: "Ecosystem Insights",
    tags: ["MENA", "FinTech", "Emerging"],
    read_time_minutes: 9,
    published_at: "2026-04-08T09:00:00Z",
  },
  {
    slug: "why-anthropic-claude-3-7-changes-things-2026",
    title: "Why Claude's Latest Release Changes The Builder Stack",
    excerpt: "Long-context plus tool-use reliability is finally good enough to replace whole product features.",
    content: long(`A benchmark-backed look at when to swap homegrown logic for a frontier model call, and where it still fails.`),
    author: "Sunny Ahlawat",
    category: "AI & Tech",
    tags: ["AI", "LLM", "Engineering"],
    read_time_minutes: 7,
    published_at: "2026-03-30T09:00:00Z",
  },
  {
    slug: "climate-tech-funding-rebound-2026",
    title: "Climate Tech Funding Rebounds — But Only For Hard Tech",
    excerpt: "Software wrappers are out. Capex-heavy hard tech is back in fashion with new infrastructure-style capital.",
    content: long(`A look at the new pools of patient capital and the founder profiles that win them.`),
    author: "Xi Combinator Research",
    category: "Funding Analysis",
    tags: ["Climate", "DeepTech", "VC"],
    read_time_minutes: 10,
    published_at: "2026-03-22T09:00:00Z",
  },
  {
    slug: "founder-mental-health-2026",
    title: "The Founder Mental-Health Crisis Nobody Talks About",
    excerpt: "Honest field notes from 40 founders on burnout, isolation, and the protocols that actually help.",
    content: long(`A candid essay drawing on cohort interviews. Includes a practical 12-week reset framework.`),
    author: "Neha Gupta",
    category: "Founder Playbook",
    tags: ["Founders", "Wellbeing"],
    read_time_minutes: 8,
    published_at: "2026-03-15T09:00:00Z",
  },
  {
    slug: "second-time-founders-have-edge-but-2026",
    title: "Second-Time Founders Have An Edge — But Not The One You Think",
    excerpt: "It's not the network. It's the willingness to kill things faster.",
    content: long(`Interviews with 22 repeat founders surface a counterintuitive pattern: their advantage is editorial, not operational.`),
    author: "Vikram Singh",
    category: "Founder Playbook",
    tags: ["Founders", "Strategy"],
    read_time_minutes: 6,
    published_at: "2026-03-08T09:00:00Z",
  },
  {
    slug: "2026-q1-startup-market-snapshot",
    title: "Q1 2026 Global Startup Market Snapshot",
    excerpt: "Funding totals, top sectors, and regional movement — the data behind the headlines.",
    content: long(`Our quarterly data drop covering deal counts, median sizes, exit activity, and sector rotation.`),
    author: "Xi Combinator Research",
    category: "Market Commentary",
    tags: ["Data", "VC", "Quarterly"],
    read_time_minutes: 11,
    published_at: "2026-04-02T09:00:00Z",
  },
];

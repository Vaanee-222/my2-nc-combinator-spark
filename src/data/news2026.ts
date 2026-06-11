// 2026 startup news items seeded into the `news` table.
export type NewsSeed = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Funding" | "M&A" | "Policy" | "Market" | "Ecosystem" | "AI" | "Product";
  source: string;
  source_url?: string;
  impact?: "Low" | "Medium" | "High";
  published_at: string;
  is_breaking?: boolean;
};

export const NEWS_2026: NewsSeed[] = [
  { slug: "global-vc-funding-q1-2026", title: "Global Startup Funding Hits $94B in Q1 2026, Led By AI", excerpt: "AI takes 38% of all VC dollars deployed worldwide this quarter.", content: "Quarterly data from PitchBook and Crunchbase shows AI capturing a record share of venture capital in Q1 2026.", category: "Market", source: "Xi Combinator Research", impact: "High", published_at: "2026-04-05T09:00:00Z", is_breaking: true },
  { slug: "anthropic-secures-10b-amazon-2026", title: "Anthropic Closes Additional $10B Investment from Amazon", excerpt: "The deal makes Anthropic one of the most valuable private AI companies globally.", content: "Amazon and Anthropic deepen their partnership with infrastructure and capital commitments.", category: "Funding", source: "TechCrunch", impact: "High", published_at: "2026-05-12T09:00:00Z" },
  { slug: "stripe-acquires-bridge-stablecoin-expansion-2026", title: "Stripe Expands Stablecoin Stack With Second Major Acquisition", excerpt: "Stripe deepens its bet on programmable money infrastructure.", content: "Following Bridge in 2024, Stripe acquires a second stablecoin-native team to ship issuance and settlement primitives.", category: "M&A", source: "The Information", impact: "Medium", published_at: "2026-05-03T09:00:00Z" },
  { slug: "india-startup-tax-relief-2026", title: "India Extends Tax Holiday For Startups To 5 Years", excerpt: "Eligible DPIIT-recognized startups get extended income-tax relief through 2030.", content: "A new amendment broadens both eligibility and duration of the startup tax holiday.", category: "Policy", source: "Economic Times", impact: "High", published_at: "2026-04-18T09:00:00Z" },
  { slug: "mistral-1b-round-2026", title: "Mistral AI Raises $1B at $14B Valuation", excerpt: "Europe's open-weight champion lands its largest round yet.", content: "Sovereign and strategic investors lead a round that puts Mistral firmly in the global LLM race.", category: "Funding", source: "Reuters", impact: "High", published_at: "2026-05-22T09:00:00Z", is_breaking: true },
  { slug: "openai-agents-platform-2026", title: "OpenAI Launches General-Purpose Agents Platform", excerpt: "New developer tools let agents take actions across SaaS apps with structured permissions.", content: "OpenAI's agent platform brings tool-use, memory, and safety scaffolding into a single deployable runtime.", category: "AI", source: "OpenAI Blog", impact: "High", published_at: "2026-05-18T09:00:00Z" },
  { slug: "saudi-pif-launches-2b-startup-fund-2026", title: "Saudi PIF Launches $2B Fund For Emerging-Market Startups", excerpt: "New vehicle targets Series B+ companies across MENA, South Asia, and Africa.", content: "The fund will deploy capital alongside regional co-investors to back scaling companies.", category: "Funding", source: "Bloomberg", impact: "Medium", published_at: "2026-04-25T09:00:00Z" },
  { slug: "ec-ai-act-phase-2-2026", title: "EU AI Act Phase-2 Obligations Take Effect", excerpt: "High-risk AI systems must now meet stricter transparency and audit rules.", content: "Companies building or deploying high-risk AI in the EU face new compliance requirements.", category: "Policy", source: "European Commission", impact: "High", published_at: "2026-02-01T09:00:00Z" },
  { slug: "nubank-mexico-public-listing-2026", title: "Nubank's Mexico Arm Files For Independent Listing", excerpt: "LATAM's largest digital bank moves to unlock value in its second-largest market.", content: "The structure mirrors recent LatAm-focused spin-offs and could set a template for the region.", category: "M&A", source: "Bloomberg", impact: "Medium", published_at: "2026-03-28T09:00:00Z" },
  { slug: "y-combinator-spring-26-batch", title: "Y Combinator's Spring '26 Batch: Three Themes Dominate", excerpt: "Agents, vertical AI, and developer infra make up over 60% of the batch.", content: "Our breakdown of the latest YC batch and what it tells us about the next wave.", category: "Ecosystem", source: "Xi Combinator Research", impact: "Low", published_at: "2026-04-12T09:00:00Z" },
  { slug: "uae-golden-visa-startup-tier-2026", title: "UAE Introduces Golden Visa Tier For Pre-Seed Founders", excerpt: "Lower bar designed to attract very-early-stage founders to Dubai and Abu Dhabi.", content: "A new visa category targets founders raising their first institutional round.", category: "Policy", source: "Khaleej Times", impact: "Medium", published_at: "2026-03-20T09:00:00Z" },
  { slug: "global-down-rounds-decline-2026", title: "Down Rounds Decline For Third Straight Quarter", excerpt: "Valuation resets appear to have largely worked through the late-stage market.", content: "Carta's quarterly data shows down rounds falling to 14% of all priced rounds.", category: "Market", source: "Carta", impact: "Medium", published_at: "2026-04-10T09:00:00Z" },
];

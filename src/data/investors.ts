// Shared investor seed data used by InvestorCentre & InvestorProfile pages.

export type Investor = {
  id: number;
  name: string;
  type: string;
  checkSize: string;
  stage?: string;
  portfolio?: number;
  sectors: string[];
  description?: string;
  recentInvestments?: string[];
  website?: string;
  linkedin?: string;
  founded?: string;
  location?: string;
  aum?: string;
  logo?: string;
  investments?: string;
  notable?: string[];
};

export const featuredInvestors: Investor[] = [
  {
    id: 1,
    name: "Sequoia Capital India",
    type: "Venture Capital",
    checkSize: "$600K - $6M",
    stage: "Series A, Series B, Series C",
    portfolio: 45,
    sectors: ["FinTech", "HealthTech", "Enterprise Software"],
    description: "Leading venture capital firm with a strong track record of backing category-defining companies globally.",
    recentInvestments: ["Zomato", "Byju's", "Ola"],
    website: "sequoiacap.com",
    linkedin: "linkedin.com/company/sequoia-capital",
    founded: "2006",
    location: "Bangalore, Mumbai",
    aum: "$1.35B",
  },
  {
    id: 2,
    name: "Accel Partners",
    type: "Venture Capital",
    checkSize: "$250K - $3M",
    stage: "Seed, Series A, Series B",
    portfolio: 38,
    sectors: ["SaaS", "Mobility", "Consumer Internet"],
    description: "Global venture capital firm focused on partnering with exceptional entrepreneurs and companies.",
    recentInvestments: ["Flipkart", "Swiggy", "Freshworks"],
    website: "accel.com",
    linkedin: "linkedin.com/company/accel-partners",
    founded: "2008",
    location: "Bangalore",
    aum: "$650M",
  },
  {
    id: 3,
    name: "Matrix Partners",
    type: "Venture Capital",
    checkSize: "$125K - $1.8M",
    stage: "Pre-Seed, Seed, Series A",
    portfolio: 52,
    sectors: ["B2B SaaS", "FinTech", "HealthTech"],
    description: "Early-stage venture capital firm committed to helping entrepreneurs build companies of consequence.",
    recentInvestments: ["Razorpay", "Ola Electric", "Cure.fit"],
    website: "matrixpartners.in",
    linkedin: "linkedin.com/company/matrix-partners-india",
    founded: "2010",
    location: "Bangalore, Delhi",
    aum: "$450M",
  },
];

export const allInvestors: Investor[] = [
  { id: 4, name: "Blume Ventures", type: "Early Stage VC", checkSize: "$60K - $1.2M", stage: "Pre-Seed, Seed", portfolio: 156, sectors: ["Consumer", "Enterprise", "Gaming"], location: "Mumbai, Bangalore", description: "Early-stage fund backing founders across India & SEA." },
  { id: 5, name: "Kalaari Capital", type: "Venture Capital", checkSize: "$125K - $2.5M", stage: "Seed, Series A", portfolio: 68, sectors: ["SaaS", "FinTech", "DeepTech"], location: "Bangalore", description: "Early-stage tech-focused VC fund." },
  { id: 6, name: "Nexus Venture Partners", type: "Venture Capital", checkSize: "$250K - $3.6M", stage: "Series A, Series B", portfolio: 42, sectors: ["Enterprise", "Consumer", "Healthcare"], location: "Mumbai, Bangalore", description: "Cross-border venture firm investing in the US and India." },
  { id: 7, name: "Lightspeed", type: "Venture Capital", checkSize: "$360K - $5M", stage: "Series A, Series B, Series C", portfolio: 35, sectors: ["Enterprise", "Consumer", "FinTech"], location: "Bangalore, Delhi", description: "Multi-stage global VC fund." },
  { id: 8, name: "Elevation Capital", type: "Venture Capital", checkSize: "$600K - $6M", stage: "Series A, Series B, Growth", portfolio: 28, sectors: ["Consumer Internet", "SaaS", "FinTech"], location: "Bangalore, Delhi", description: "Growth-stage venture partner." },
];

export const angelInvestors: Investor[] = [
  { id: 9, name: "Naval Ravikant", type: "Angel Investor", checkSize: "$30K - $250K", sectors: ["Consumer", "Marketplaces", "Web3"], investments: "200+", notable: ["Twitter", "Uber", "Notion"], description: "AngelList founder and prolific seed investor." },
  { id: 10, name: "Kunal Bahl", type: "Angel Investor", checkSize: "$12K - $125K", sectors: ["E-commerce", "B2B", "Consumer"], investments: "50+", notable: ["Snapdeal Co-founder", "Titan Capital"], description: "Founder-turned-investor via Titan Capital." },
  { id: 11, name: "Binny Bansal", type: "Angel Investor", checkSize: "$18K - $180K", sectors: ["E-commerce", "Logistics", "B2B"], investments: "40+", notable: ["Flipkart Co-founder", "xto10x"], description: "Flipkart co-founder, investing across commerce & SaaS." },
];

export const allInvestorsCombined: Investor[] = [
  ...featuredInvestors,
  ...allInvestors,
  ...angelInvestors,
];

export function getInvestorById(id: string | number | undefined): Investor | undefined {
  if (id == null) return undefined;
  const n = Number(id);
  return allInvestorsCombined.find((i) => i.id === n);
}

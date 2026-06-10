export type AdvisorTier = "Founding Advisors" | "Strategic Advisors" | "Regional Partners" | "Industry Experts";

export interface Advisor {
  name: string;
  role: string;
  company: string;
  country: string;
  expertise: string;
  description: string;
  linkedin: string;
  tier: AdvisorTier;
}

export const advisoryBoard: Advisor[] = [
  // Founding Advisors
  {
    name: "Sunny Ahlawat",
    role: "Founding Advisor",
    company: "Tech Leader",
    country: "California, USA",
    expertise: "Product, Engineering, Scale",
    description: "Silicon Valley operator advising founders on product-led growth and engineering scale.",
    linkedin: "https://www.linkedin.com/in/sunny-ahlawat/",
    tier: "Founding Advisors",
  },
  {
    name: "Dr. Priya Nair",
    role: "Founding Advisor",
    company: "Ex-Google",
    country: "Bangalore, India",
    expertise: "AI/ML, Platform Engineering",
    description: "20+ years leading AI platform teams at global scale.",
    linkedin: "https://www.linkedin.com/",
    tier: "Founding Advisors",
  },
  {
    name: "Marcus Chen",
    role: "Founding Advisor",
    company: "Sequoia Scout",
    country: "Singapore",
    expertise: "Venture Capital, APAC Expansion",
    description: "Backed 30+ Series A breakouts across Southeast Asia.",
    linkedin: "https://www.linkedin.com/",
    tier: "Founding Advisors",
  },
  {
    name: "Sofia Martinez",
    role: "Founding Advisor",
    company: "Atomico",
    country: "London, UK",
    expertise: "European VC, FinTech",
    description: "Leads European fintech investments at a top-tier fund.",
    linkedin: "https://www.linkedin.com/",
    tier: "Founding Advisors",
  },

  // Strategic Advisors
  {
    name: "Rajesh Kumar",
    role: "Strategic Advisor",
    company: "TechFlow Ventures",
    country: "Mumbai, India",
    expertise: "Growth, Go-to-Market",
    description: "Serial operator and investor, 3 exits.",
    linkedin: "https://www.linkedin.com/",
    tier: "Strategic Advisors",
  },
  {
    name: "Anitha Reddy",
    role: "Strategic Advisor",
    company: "Ex-Microsoft",
    country: "Hyderabad, India",
    expertise: "Enterprise Sales, B2B",
    description: "Built enterprise divisions across APAC from the ground up.",
    linkedin: "https://www.linkedin.com/",
    tier: "Strategic Advisors",
  },
  {
    name: "Dr. Hiroshi Tanaka",
    role: "Strategic Advisor",
    company: "SoftBank Vision",
    country: "Tokyo, Japan",
    expertise: "DeepTech, Robotics",
    description: "Pioneer in robotics commercialisation across Japan & Korea.",
    linkedin: "https://www.linkedin.com/",
    tier: "Strategic Advisors",
  },
  {
    name: "Elena Schmidt",
    role: "Strategic Advisor",
    company: "Rocket Internet",
    country: "Berlin, Germany",
    expertise: "Marketplaces, Operations",
    description: "Scaled marketplaces to 9-figure GMV across EU & MENA.",
    linkedin: "https://www.linkedin.com/",
    tier: "Strategic Advisors",
  },

  // Regional Partners
  {
    name: "Omar Al-Mansouri",
    role: "Regional Partner — MENA",
    company: "Mubadala Ventures",
    country: "Dubai, UAE",
    expertise: "Sovereign Capital, MENA Expansion",
    description: "Gateway to GCC capital and enterprise customers.",
    linkedin: "https://www.linkedin.com/",
    tier: "Regional Partners",
  },
  {
    name: "Aisha Okafor",
    role: "Regional Partner — Africa",
    company: "Future Africa",
    country: "Lagos, Nigeria",
    expertise: "Africa Ecosystem, FinTech",
    description: "Connector for African fintech and pan-African expansion.",
    linkedin: "https://www.linkedin.com/",
    tier: "Regional Partners",
  },
  {
    name: "Carlos Mendoza",
    role: "Regional Partner — LATAM",
    company: "Kaszek Ventures",
    country: "São Paulo, Brazil",
    expertise: "LATAM Scale, B2B SaaS",
    description: "Helps founders expand into Brazil & Mexico.",
    linkedin: "https://www.linkedin.com/",
    tier: "Regional Partners",
  },
  {
    name: "Liam O'Sullivan",
    role: "Regional Partner — ANZ",
    company: "Blackbird Ventures",
    country: "Sydney, Australia",
    expertise: "ANZ Markets, Climate Tech",
    description: "Climate tech investor across Australia & New Zealand.",
    linkedin: "https://www.linkedin.com/",
    tier: "Regional Partners",
  },

  // Industry Experts
  {
    name: "Vikram Singh",
    role: "Industry Expert — HealthTech",
    company: "Serial Founder",
    country: "Bangalore, India",
    expertise: "HealthTech, Regulatory",
    description: "3 successful exits, $500M+ value created in healthcare.",
    linkedin: "https://www.linkedin.com/",
    tier: "Industry Experts",
  },
  {
    name: "Naomi Bennett",
    role: "Industry Expert — AI Safety",
    company: "Ex-Anthropic",
    country: "Toronto, Canada",
    expertise: "AI Safety, LLM Infrastructure",
    description: "Researcher and operator in frontier AI.",
    linkedin: "https://www.linkedin.com/",
    tier: "Industry Experts",
  },
  {
    name: "Daniel Cohen",
    role: "Industry Expert — CyberSec",
    company: "Ex-Palo Alto Networks",
    country: "Tel Aviv, Israel",
    expertise: "Security, Enterprise Infra",
    description: "Cybersecurity veteran, multiple acquired startups.",
    linkedin: "https://www.linkedin.com/",
    tier: "Industry Experts",
  },
  {
    name: "Mei Lin Zhao",
    role: "Industry Expert — Climate",
    company: "Breakthrough Energy",
    country: "Vancouver, Canada",
    expertise: "Climate Tech, Hardware",
    description: "Climate hardware investor and former Tesla engineer.",
    linkedin: "https://www.linkedin.com/",
    tier: "Industry Experts",
  },
];

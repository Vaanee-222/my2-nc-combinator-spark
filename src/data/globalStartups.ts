// Curated global startups seed — 30+ well-known companies across regions.
// Used both as a fallback when DB has no rows AND as the initial seed insert.

export type StartupSeed = {
  name: string;
  slug: string;
  description: string;
  sector: string;
  stage: string;
  country: string;
  region: string;
  headquarters: string;
  founded_year: number;
  website: string;
  team_size: string;
  tags: string[];
  is_featured?: boolean;
};

export const GLOBAL_STARTUPS: StartupSeed[] = [
  // North America
  { name: "Stripe", slug: "stripe", description: "Payments infrastructure for the internet.", sector: "FinTech", stage: "Late Stage", country: "USA", region: "North America", headquarters: "San Francisco, CA", founded_year: 2010, website: "stripe.com", team_size: "5000+", tags: ["Payments", "API", "FinTech"], is_featured: true },
  { name: "OpenAI", slug: "openai", description: "AI research and products including ChatGPT and GPT models.", sector: "AI", stage: "Late Stage", country: "USA", region: "North America", headquarters: "San Francisco, CA", founded_year: 2015, website: "openai.com", team_size: "1000+", tags: ["AI", "LLM", "Research"], is_featured: true },
  { name: "Anthropic", slug: "anthropic", description: "AI safety company building reliable, interpretable AI.", sector: "AI", stage: "Series C+", country: "USA", region: "North America", headquarters: "San Francisco, CA", founded_year: 2021, website: "anthropic.com", team_size: "500+", tags: ["AI", "Safety", "LLM"], is_featured: true },
  { name: "Notion", slug: "notion", description: "All-in-one workspace for notes, docs, and collaboration.", sector: "SaaS", stage: "Series C", country: "USA", region: "North America", headquarters: "San Francisco, CA", founded_year: 2016, website: "notion.so", team_size: "500+", tags: ["SaaS", "Productivity"] },
  { name: "Figma", slug: "figma", description: "Collaborative interface design platform.", sector: "SaaS", stage: "Late Stage", country: "USA", region: "North America", headquarters: "San Francisco, CA", founded_year: 2012, website: "figma.com", team_size: "1000+", tags: ["Design", "SaaS"] },
  { name: "Vercel", slug: "vercel", description: "Frontend cloud for modern web frameworks.", sector: "DevTools", stage: "Series E", country: "USA", region: "North America", headquarters: "San Francisco, CA", founded_year: 2015, website: "vercel.com", team_size: "500+", tags: ["DevTools", "Cloud"] },
  { name: "Shopify", slug: "shopify", description: "Commerce platform powering millions of businesses.", sector: "E-commerce", stage: "Public", country: "Canada", region: "North America", headquarters: "Ottawa, ON", founded_year: 2006, website: "shopify.com", team_size: "10000+", tags: ["E-commerce", "SaaS"] },
  { name: "Cohere", slug: "cohere", description: "Enterprise LLM platform for builders.", sector: "AI", stage: "Series C", country: "Canada", region: "North America", headquarters: "Toronto, ON", founded_year: 2019, website: "cohere.com", team_size: "300+", tags: ["AI", "LLM", "Enterprise"] },

  // India / South Asia
  { name: "Razorpay", slug: "razorpay", description: "Full-stack payments and banking for businesses in India.", sector: "FinTech", stage: "Series F", country: "India", region: "South Asia", headquarters: "Bangalore", founded_year: 2014, website: "razorpay.com", team_size: "2500+", tags: ["FinTech", "Payments"], is_featured: true },
  { name: "Zerodha", slug: "zerodha", description: "India's largest retail stockbroker.", sector: "FinTech", stage: "Profitable", country: "India", region: "South Asia", headquarters: "Bangalore", founded_year: 2010, website: "zerodha.com", team_size: "1100+", tags: ["FinTech", "Investing"] },
  { name: "Zoho", slug: "zoho", description: "SaaS suite for businesses, bootstrapped from India.", sector: "SaaS", stage: "Profitable", country: "India", region: "South Asia", headquarters: "Chennai", founded_year: 1996, website: "zoho.com", team_size: "15000+", tags: ["SaaS", "Enterprise"] },
  { name: "CRED", slug: "cred", description: "Credit-card payments and rewards platform.", sector: "FinTech", stage: "Series F", country: "India", region: "South Asia", headquarters: "Bangalore", founded_year: 2018, website: "cred.club", team_size: "1500+", tags: ["FinTech", "Consumer"] },
  { name: "Postman", slug: "postman", description: "API development platform used by 25M+ developers.", sector: "DevTools", stage: "Series D", country: "India", region: "South Asia", headquarters: "Bangalore / SF", founded_year: 2014, website: "postman.com", team_size: "800+", tags: ["DevTools", "API"], is_featured: true },
  { name: "Freshworks", slug: "freshworks", description: "Customer engagement SaaS for SMBs.", sector: "SaaS", stage: "Public", country: "India", region: "South Asia", headquarters: "Chennai", founded_year: 2010, website: "freshworks.com", team_size: "5000+", tags: ["SaaS", "CRM"] },

  // Europe
  { name: "Revolut", slug: "revolut", description: "Global neobank and financial super-app.", sector: "FinTech", stage: "Series E+", country: "UK", region: "Europe", headquarters: "London", founded_year: 2015, website: "revolut.com", team_size: "8000+", tags: ["FinTech", "Banking"], is_featured: true },
  { name: "Wise", slug: "wise", description: "Cross-border money transfers without hidden fees.", sector: "FinTech", stage: "Public", country: "UK", region: "Europe", headquarters: "London", founded_year: 2011, website: "wise.com", team_size: "5000+", tags: ["FinTech", "Payments"] },
  { name: "Mistral AI", slug: "mistral-ai", description: "Open-weight LLMs from Europe.", sector: "AI", stage: "Series B", country: "France", region: "Europe", headquarters: "Paris", founded_year: 2023, website: "mistral.ai", team_size: "100+", tags: ["AI", "LLM", "Open Source"], is_featured: true },
  { name: "Hugging Face", slug: "hugging-face", description: "Open-source ML model hub and platform.", sector: "AI", stage: "Series D", country: "France", region: "Europe", headquarters: "Paris / NYC", founded_year: 2016, website: "huggingface.co", team_size: "300+", tags: ["AI", "ML", "Community"] },
  { name: "Klarna", slug: "klarna", description: "Buy-now-pay-later and shopping platform.", sector: "FinTech", stage: "Pre-IPO", country: "Sweden", region: "Europe", headquarters: "Stockholm", founded_year: 2005, website: "klarna.com", team_size: "5000+", tags: ["FinTech", "BNPL"] },
  { name: "N26", slug: "n26", description: "Mobile-first European neobank.", sector: "FinTech", stage: "Series E", country: "Germany", region: "Europe", headquarters: "Berlin", founded_year: 2013, website: "n26.com", team_size: "1500+", tags: ["FinTech", "Banking"] },

  // APAC
  { name: "Grab", slug: "grab", description: "Southeast Asia's super-app for transport, food, and finance.", sector: "Consumer", stage: "Public", country: "Singapore", region: "APAC", headquarters: "Singapore", founded_year: 2012, website: "grab.com", team_size: "9000+", tags: ["SuperApp", "Mobility"], is_featured: true },
  { name: "Sea Group", slug: "sea-group", description: "Gaming, e-commerce (Shopee), and fintech across SEA.", sector: "Consumer", stage: "Public", country: "Singapore", region: "APAC", headquarters: "Singapore", founded_year: 2009, website: "seagroup.com", team_size: "60000+", tags: ["E-commerce", "Gaming"] },
  { name: "Canva", slug: "canva", description: "Online visual design platform for everyone.", sector: "SaaS", stage: "Late Stage", country: "Australia", region: "APAC", headquarters: "Sydney", founded_year: 2013, website: "canva.com", team_size: "5000+", tags: ["Design", "SaaS"], is_featured: true },
  { name: "Atlassian", slug: "atlassian", description: "Team collaboration software including Jira and Confluence.", sector: "SaaS", stage: "Public", country: "Australia", region: "APAC", headquarters: "Sydney", founded_year: 2002, website: "atlassian.com", team_size: "12000+", tags: ["SaaS", "DevTools"] },
  { name: "Preferred Networks", slug: "preferred-networks", description: "Japanese deep-learning company applying AI to industry.", sector: "AI", stage: "Late Stage", country: "Japan", region: "APAC", headquarters: "Tokyo", founded_year: 2014, website: "preferred.jp", team_size: "300+", tags: ["AI", "Industrial"] },
  { name: "GoTo Group", slug: "goto-group", description: "Indonesia's largest tech ecosystem (Gojek + Tokopedia).", sector: "Consumer", stage: "Public", country: "Indonesia", region: "APAC", headquarters: "Jakarta", founded_year: 2021, website: "gotocompany.com", team_size: "9000+", tags: ["SuperApp", "E-commerce"] },

  // MENA
  { name: "Careem", slug: "careem", description: "MENA super-app for rides, food, and payments.", sector: "Consumer", stage: "Acquired", country: "UAE", region: "MENA", headquarters: "Dubai", founded_year: 2012, website: "careem.com", team_size: "3000+", tags: ["SuperApp", "Mobility"] },
  { name: "Tabby", slug: "tabby", description: "Buy-now-pay-later leader in the Gulf region.", sector: "FinTech", stage: "Series D", country: "UAE", region: "MENA", headquarters: "Dubai / Riyadh", founded_year: 2019, website: "tabby.ai", team_size: "500+", tags: ["FinTech", "BNPL"] },
  { name: "Swvl", slug: "swvl", description: "Shared-mobility platform for emerging markets.", sector: "Mobility", stage: "Public", country: "UAE", region: "MENA", headquarters: "Dubai", founded_year: 2017, website: "swvl.com", team_size: "300+", tags: ["Mobility", "Mass Transit"] },

  // LATAM / Africa
  { name: "Nubank", slug: "nubank", description: "Latin America's largest digital bank.", sector: "FinTech", stage: "Public", country: "Brazil", region: "LATAM", headquarters: "Sao Paulo", founded_year: 2013, website: "nu.com.br", team_size: "8000+", tags: ["FinTech", "Banking"], is_featured: true },
  { name: "Rappi", slug: "rappi", description: "On-demand delivery super-app across LATAM.", sector: "Consumer", stage: "Late Stage", country: "Colombia", region: "LATAM", headquarters: "Bogota", founded_year: 2015, website: "rappi.com", team_size: "5000+", tags: ["SuperApp", "Delivery"] },
  { name: "Flutterwave", slug: "flutterwave", description: "Pan-African payments infrastructure.", sector: "FinTech", stage: "Series D", country: "Nigeria", region: "Africa", headquarters: "Lagos / SF", founded_year: 2016, website: "flutterwave.com", team_size: "500+", tags: ["FinTech", "Payments"] },
];

export const COUNTRIES = Array.from(new Set(GLOBAL_STARTUPS.map((s) => s.country))).sort();
export const REGIONS = Array.from(new Set(GLOBAL_STARTUPS.map((s) => s.region))).sort();

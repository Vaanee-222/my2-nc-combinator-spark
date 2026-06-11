// Curated lesser-known global startup seed — emerging companies (not household names).
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
  // North America — emerging, not mainstream-famous
  { name: "Roboflow", slug: "roboflow", description: "Computer-vision developer platform for production ML.", sector: "AI", stage: "Series B", country: "USA", region: "North America", headquarters: "Des Moines, IA", founded_year: 2019, website: "roboflow.com", team_size: "80+", tags: ["AI", "Computer Vision", "DevTools"], is_featured: true },
  { name: "Modal Labs", slug: "modal-labs", description: "Serverless GPU infrastructure for AI & data teams.", sector: "DevTools", stage: "Series A", country: "USA", region: "North America", headquarters: "New York, NY", founded_year: 2021, website: "modal.com", team_size: "40+", tags: ["AI Infra", "Serverless"] },
  { name: "Baseten", slug: "baseten", description: "Production-ready inference for ML models.", sector: "AI", stage: "Series B", country: "USA", region: "North America", headquarters: "San Francisco, CA", founded_year: 2019, website: "baseten.co", team_size: "60+", tags: ["AI", "MLOps"] },
  { name: "Pylon", slug: "pylon", description: "Customer support platform built for B2B teams.", sector: "SaaS", stage: "Series A", country: "USA", region: "North America", headquarters: "San Francisco, CA", founded_year: 2022, website: "usepylon.com", team_size: "30+", tags: ["SaaS", "Support"] },
  { name: "Tracecat", slug: "tracecat", description: "Open-source security automation & SOAR platform.", sector: "Security", stage: "Seed", country: "USA", region: "North America", headquarters: "San Francisco, CA", founded_year: 2024, website: "tracecat.com", team_size: "10+", tags: ["Security", "Open Source"] },
  { name: "Cresta", slug: "cresta", description: "AI copilot for contact-centre agents.", sector: "AI", stage: "Series D", country: "USA", region: "North America", headquarters: "Mountain View, CA", founded_year: 2017, website: "cresta.com", team_size: "300+", tags: ["AI", "Enterprise"] },
  { name: "Aporia", slug: "aporia", description: "Observability and guardrails for AI products.", sector: "AI", stage: "Series B", country: "Canada", region: "North America", headquarters: "Toronto, ON", founded_year: 2020, website: "aporia.com", team_size: "60+", tags: ["AI", "Observability"] },
  { name: "Tailscale", slug: "tailscale", description: "Zero-config mesh VPN built on WireGuard.", sector: "Security", stage: "Series B", country: "Canada", region: "North America", headquarters: "Toronto, ON", founded_year: 2019, website: "tailscale.com", team_size: "100+", tags: ["Networking", "Security"], is_featured: true },

  // India / South Asia — emerging picks (not the obvious Razorpay/Zerodha)
  { name: "Sarvam AI", slug: "sarvam-ai", description: "Sovereign multilingual foundation models for India.", sector: "AI", stage: "Series A", country: "India", region: "South Asia", headquarters: "Bangalore", founded_year: 2023, website: "sarvam.ai", team_size: "40+", tags: ["AI", "LLM", "Multilingual"], is_featured: true },
  { name: "Atomberg", slug: "atomberg", description: "Energy-efficient smart appliances for Indian homes.", sector: "ConsumerTech", stage: "Series C", country: "India", region: "South Asia", headquarters: "Mumbai", founded_year: 2012, website: "atomberg.com", team_size: "500+", tags: ["Hardware", "CleanTech"] },
  { name: "Pixxel", slug: "pixxel", description: "Hyperspectral earth-observation satellite constellation.", sector: "SpaceTech", stage: "Series B", country: "India", region: "South Asia", headquarters: "Bangalore / LA", founded_year: 2019, website: "pixxel.space", team_size: "180+", tags: ["Space", "Climate"] },
  { name: "Skyroot Aerospace", slug: "skyroot", description: "Private launch vehicles for small satellites.", sector: "SpaceTech", stage: "Series C", country: "India", region: "South Asia", headquarters: "Hyderabad", founded_year: 2018, website: "skyroot.in", team_size: "300+", tags: ["Space", "Hardware"] },
  { name: "Yali Mobility", slug: "yali", description: "Electric mobility-as-a-service for emerging markets.", sector: "Mobility", stage: "Seed", country: "India", region: "South Asia", headquarters: "Chennai", founded_year: 2022, website: "yalimobility.com", team_size: "30+", tags: ["EV", "Mobility"] },
  { name: "Smallcase", slug: "smallcase", description: "Thematic investing platform for retail investors.", sector: "FinTech", stage: "Series D", country: "India", region: "South Asia", headquarters: "Bangalore", founded_year: 2015, website: "smallcase.com", team_size: "300+", tags: ["FinTech", "Investing"] },

  // Europe — under-the-radar
  { name: "Tessl", slug: "tessl", description: "AI-native software development platform.", sector: "DevTools", stage: "Series A", country: "UK", region: "Europe", headquarters: "London", founded_year: 2024, website: "tessl.io", team_size: "30+", tags: ["AI", "DevTools"], is_featured: true },
  { name: "Synthesia", slug: "synthesia", description: "AI video creation from text for enterprise.", sector: "AI", stage: "Series D", country: "UK", region: "Europe", headquarters: "London", founded_year: 2017, website: "synthesia.io", team_size: "400+", tags: ["AI", "Video"] },
  { name: "Helsing", slug: "helsing", description: "AI for defense and national security.", sector: "DefenseTech", stage: "Series C", country: "Germany", region: "Europe", headquarters: "Munich", founded_year: 2021, website: "helsing.ai", team_size: "400+", tags: ["AI", "Defense"] },
  { name: "Sequel", slug: "sequel", description: "API-first banking infrastructure for European fintechs.", sector: "FinTech", stage: "Series A", country: "France", region: "Europe", headquarters: "Paris", founded_year: 2022, website: "sequel.app", team_size: "25+", tags: ["FinTech", "API"] },
  { name: "Causaly", slug: "causaly", description: "AI for biomedical literature & drug discovery.", sector: "HealthTech", stage: "Series B", country: "UK", region: "Europe", headquarters: "London", founded_year: 2018, website: "causaly.com", team_size: "150+", tags: ["AI", "Biotech"] },
  { name: "Lakera", slug: "lakera", description: "Security firewall for LLM applications.", sector: "Security", stage: "Series A", country: "Switzerland", region: "Europe", headquarters: "Zurich", founded_year: 2021, website: "lakera.ai", team_size: "40+", tags: ["AI Security", "LLM"] },

  // APAC
  { name: "Sakana AI", slug: "sakana-ai", description: "Nature-inspired foundation models from Japan.", sector: "AI", stage: "Series A", country: "Japan", region: "APAC", headquarters: "Tokyo", founded_year: 2023, website: "sakana.ai", team_size: "30+", tags: ["AI", "Research"], is_featured: true },
  { name: "Aspark", slug: "aspark", description: "High-performance EV hypercars and propulsion.", sector: "Mobility", stage: "Series B", country: "Japan", region: "APAC", headquarters: "Osaka", founded_year: 2005, website: "aspark.co.jp", team_size: "100+", tags: ["EV", "Hardware"] },
  { name: "Nimble", slug: "nimble", description: "Warehouse robotics for ecommerce fulfillment.", sector: "Robotics", stage: "Series C", country: "Australia", region: "APAC", headquarters: "Sydney / SF", founded_year: 2017, website: "nimblerobotics.com", team_size: "200+", tags: ["Robotics", "Logistics"] },
  { name: "Doss", slug: "doss", description: "AI-native ERP for modern manufacturers.", sector: "SaaS", stage: "Series A", country: "Australia", region: "APAC", headquarters: "Sydney", founded_year: 2022, website: "doss.com", team_size: "30+", tags: ["AI", "Manufacturing"] },
  { name: "Eightfold", slug: "eightfold-asia", description: "AI talent intelligence for APAC enterprises.", sector: "HRTech", stage: "Series E", country: "Singapore", region: "APAC", headquarters: "Singapore", founded_year: 2016, website: "eightfold.ai", team_size: "1000+", tags: ["AI", "HR"] },
  { name: "Aevice Health", slug: "aevice", description: "Wearable respiratory health monitor.", sector: "HealthTech", stage: "Series A", country: "Singapore", region: "APAC", headquarters: "Singapore", founded_year: 2017, website: "aevice.com", team_size: "30+", tags: ["MedTech", "Wearables"] },

  // MENA
  { name: "Lean Technologies", slug: "lean-tech", description: "Open-banking API infrastructure for MENA.", sector: "FinTech", stage: "Series A", country: "UAE", region: "MENA", headquarters: "Dubai / Riyadh", founded_year: 2019, website: "leantech.me", team_size: "100+", tags: ["FinTech", "Open Banking"], is_featured: true },
  { name: "Trella", slug: "trella", description: "B2B trucking marketplace across MENA.", sector: "Logistics", stage: "Series A", country: "Egypt", region: "MENA", headquarters: "Cairo", founded_year: 2019, website: "trella.app", team_size: "200+", tags: ["Logistics", "Marketplace"] },
  { name: "Calo", slug: "calo", description: "Subscription healthy-meal delivery across the Gulf.", sector: "Consumer", stage: "Series B", country: "Bahrain", region: "MENA", headquarters: "Manama", founded_year: 2019, website: "calo.app", team_size: "500+", tags: ["FoodTech", "Subscription"] },
  { name: "Yassir", slug: "yassir", description: "North-African super-app for rides, food & finance.", sector: "Consumer", stage: "Series B", country: "Algeria", region: "MENA", headquarters: "Algiers / SF", founded_year: 2017, website: "yassir.com", team_size: "1000+", tags: ["SuperApp", "Mobility"] },

  // LATAM / Africa
  { name: "Cobre", slug: "cobre", description: "B2B payments infrastructure for Latin America.", sector: "FinTech", stage: "Series A", country: "Colombia", region: "LATAM", headquarters: "Bogota", founded_year: 2020, website: "cobre.co", team_size: "80+", tags: ["FinTech", "B2B"] },
  { name: "Yellow", slug: "yellow", description: "Pay-as-you-go solar financing for African households.", sector: "CleanTech", stage: "Series B", country: "Malawi", region: "Africa", headquarters: "Lilongwe", founded_year: 2018, website: "yellow.africa", team_size: "200+", tags: ["CleanTech", "Energy"], is_featured: true },
  { name: "Mecho Autotech", slug: "mecho", description: "Vehicle maintenance marketplace in West Africa.", sector: "Auto", stage: "Series A", country: "Nigeria", region: "Africa", headquarters: "Lagos", founded_year: 2021, website: "mechoautotech.com", team_size: "60+", tags: ["Automotive", "Marketplace"] },
  { name: "Stitch", slug: "stitch", description: "API platform for African payments and data.", sector: "FinTech", stage: "Series A", country: "South Africa", region: "Africa", headquarters: "Cape Town", founded_year: 2019, website: "stitch.money", team_size: "150+", tags: ["FinTech", "API"] },
  { name: "Tul", slug: "tul", description: "B2B marketplace digitizing construction supply.", sector: "B2B", stage: "Series B", country: "Colombia", region: "LATAM", headquarters: "Bogota", founded_year: 2020, website: "tul.com.co", team_size: "300+", tags: ["B2B", "Construction"] },
];

export const COUNTRIES = Array.from(new Set(GLOBAL_STARTUPS.map((s) => s.country))).sort();
export const REGIONS = Array.from(new Set(GLOBAL_STARTUPS.map((s) => s.region))).sort();

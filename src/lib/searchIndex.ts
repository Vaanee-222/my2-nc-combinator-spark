export type SearchEntry = {
  title: string;
  path: string;
  description: string;
  keywords: string[];
  category: "Programs" | "Community" | "Resources" | "Account" | "Company" | "Cohorts";
};

export const searchIndex: SearchEntry[] = [
  // Programs
  { title: "Xi Lab", path: "/xi-lab", description: "Flagship accelerator program with funding, mentorship and resources.", keywords: ["accelerator", "inclab", "apply", "cohort", "funding"], category: "Programs" },
  { title: "MVP Lab", path: "/mvp-lab", description: "Build your MVP with our tech team in 90 days.", keywords: ["mvp", "prototype", "build", "product", "tech"], category: "Programs" },
  { title: "Incubation", path: "/incubation", description: "Long-term incubation program with workspace and support.", keywords: ["incubation", "incubator", "early stage"], category: "Programs" },
  { title: "Hackathon", path: "/hackathon", description: "Compete in our flagship hackathons across India.", keywords: ["hackathon", "compete", "code", "event"], category: "Programs" },

  // Cohorts
  { title: "Monthly Top 10 Startups", path: "/monthly-top-10", description: "Top 10 startups selected every month from applications.", keywords: ["top 10", "monthly", "selected", "cohort"], category: "Cohorts" },
  { title: "Quarterly Top 5 Cohort", path: "/quarterly-top-5", description: "The 5 startups advancing each quarter into the cohort.", keywords: ["top 5", "quarterly", "cohort", "selected"], category: "Cohorts" },
  { title: "Current Cohort", path: "/current-cohort", description: "Meet our active cohort startups.", keywords: ["cohort", "current", "active"], category: "Cohorts" },
  { title: "Featured Startups", path: "/featured-startups", description: "Spotlight on standout startups.", keywords: ["featured", "spotlight"], category: "Cohorts" },
  { title: "Success Stories", path: "/success-stories", description: "Alumni success stories from past cohorts.", keywords: ["alumni", "success", "stories"], category: "Cohorts" },

  // Community
  { title: "Startup Directory", path: "/startup-directory", description: "Browse all startups in the IC community.", keywords: ["directory", "startups", "browse"], category: "Community" },
  { title: "Investor Centre", path: "/investor-centre", description: "Connect with active investors.", keywords: ["investor", "vc", "angel", "funding"], category: "Community" },
  { title: "Meet Co-founder", path: "/meet-cofounder", description: "Find your co-founder.", keywords: ["cofounder", "co-founder", "team"], category: "Community" },
  { title: "Become a Mentor", path: "/become-mentor", description: "Join the mentor network.", keywords: ["mentor", "advisor"], category: "Community" },
  { title: "Partners", path: "/partners", description: "Our global ecosystem partners.", keywords: ["partners", "partner", "ecosystem"], category: "Community" },
  { title: "Partnership", path: "/partnership", description: "Become a strategic partner.", keywords: ["partnership", "collaborate"], category: "Community" },
  { title: "Messages", path: "/messages", description: "In-app messaging.", keywords: ["messages", "chat", "inbox"], category: "Community" },

  // Resources
  { title: "Resources", path: "/resources", description: "Guides, templates, and toolkits.", keywords: ["resources", "guides", "templates"], category: "Resources" },
  { title: "Blogs", path: "/blogs", description: "Articles from the IC community.", keywords: ["blog", "articles"], category: "Resources" },
  { title: "News", path: "/news", description: "Latest news and announcements.", keywords: ["news", "announcements"], category: "Resources" },
  { title: "Cloud Credits", path: "/cloud-credits", description: "AWS, GCP, Azure credits for cohort startups.", keywords: ["aws", "gcp", "azure", "credits", "cloud"], category: "Resources" },
  { title: "Grants & Funding", path: "/grants-funding", description: "Government and private grant opportunities.", keywords: ["grants", "funding", "government"], category: "Resources" },
  { title: "Past Events", path: "/past-events", description: "Browse our past events.", keywords: ["events", "past"], category: "Resources" },
  { title: "Deals & Offers", path: "/deals", description: "Exclusive deals for IC startups.", keywords: ["deals", "offers", "discounts"], category: "Resources" },
  { title: "Startup Advisor (AI)", path: "/startup-advisor", description: "AI-powered startup advisory agents.", keywords: ["ai", "advisor", "chatgpt", "assistant"], category: "Resources" },
  { title: "Philosophy", path: "/philosophy", description: "Our investment and operating philosophy.", keywords: ["philosophy", "values"], category: "Resources" },
  { title: "Program Details", path: "/program-details", description: "Detailed breakdown of our programs.", keywords: ["program", "details"], category: "Resources" },

  // Company
  { title: "About Us", path: "/about", description: "Learn about Xi Combinator.", keywords: ["about", "team", "company"], category: "Company" },
  { title: "Contact", path: "/contact", description: "Get in touch with the IC team.", keywords: ["contact", "support", "email"], category: "Company" },
  { title: "Subscription & Plans", path: "/subscription", description: "Membership and subscription tiers.", keywords: ["subscription", "pricing", "membership", "plans"], category: "Company" },
  { title: "Privacy Policy", path: "/privacy-policy", description: "How we handle your data.", keywords: ["privacy", "data", "gdpr"], category: "Company" },
  { title: "Terms & Conditions", path: "/terms-conditions", description: "Terms of using Xi Combinator.", keywords: ["terms", "conditions", "legal"], category: "Company" },

  // Account
  { title: "Login", path: "/login", description: "Sign in to your account.", keywords: ["login", "signin", "sign in"], category: "Account" },
  { title: "Register", path: "/register", description: "Create a new account.", keywords: ["register", "signup", "sign up", "join"], category: "Account" },
  { title: "Consultation Booking", path: "/consultation-booking", description: "Book a 1:1 consultation.", keywords: ["booking", "consultation", "call"], category: "Account" },
];

export const searchEntries = (query: string): SearchEntry[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return searchIndex
    .map((e) => {
      const hay = [e.title, e.description, ...e.keywords].join(" ").toLowerCase();
      let score = 0;
      if (e.title.toLowerCase().includes(q)) score += 10;
      if (e.keywords.some((k) => k.toLowerCase().includes(q))) score += 6;
      if (hay.includes(q)) score += 2;
      return { e, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.e);
};

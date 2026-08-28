import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { searchIndex } from "@/lib/searchIndex";

const SITE_URL = "https://xicombinator.lovable.app";
const BRAND = "Xi Combinator";

/** Routes that must never be indexed (auth, dashboards, private tools). */
const NOINDEX_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/messages",
  "/application-status",
  "/all-applications",
  "/admin-dashboard",
  "/admin-workflow",
  "/startup-dashboard",
  "/investor-dashboard",
  "/mentor-dashboard",
  "/cofounder-dashboard",
  "/user-dashboard",
];

/** Titles/descriptions for routes that are not part of the search index. */
const EXTRA_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Xi Combinator — Accelerator for ambitious founders",
    description:
      "Xi Combinator backs early-stage founders with funding, mentorship, hackathons, MVP support and a global startup community.",
  },
  "/leaderboard": {
    title: "Community Leaderboard",
    description: "Monthly leaderboards for startups, mentors and co-founders across the Xi Combinator community.",
  },
  "/requirements": {
    title: "Program Requirements",
    description: "Eligibility and requirements for Xi Combinator programs.",
  },
  "/forgot-password": { title: "Forgot Password", description: "Reset your Xi Combinator account password." },
  "/reset-password": { title: "Reset Password", description: "Choose a new password for your account." },
  "/application-status": { title: "Application Status", description: "Track the status of your applications." },
  "/all-applications": { title: "All Applications", description: "Review submitted applications." },
  "/admin-dashboard": { title: "Admin Dashboard", description: "Manage the Xi Combinator platform." },
  "/admin-workflow": { title: "Admin Workflow", description: "Review and progress applications." },
  "/startup-dashboard": { title: "Startup Dashboard", description: "Your startup workspace." },
  "/investor-dashboard": { title: "Investor Dashboard", description: "Your deal flow and portfolio." },
  "/mentor-dashboard": { title: "Mentor Dashboard", description: "Your mentees and sessions." },
  "/cofounder-dashboard": { title: "Co-founder Dashboard", description: "Your co-founder applications." },
  "/user-dashboard": { title: "Dashboard", description: "Your Xi Combinator workspace." },
};

/** Prefix-based fallbacks for dynamic detail routes. */
const DYNAMIC_META: [string, { title: string; description: string }][] = [
  ["/hackathon/", { title: "Hackathon Details", description: "Details, prizes and registration for this Xi Combinator hackathon." }],
  ["/hackathon-detail/", { title: "Hackathon Details", description: "Details, prizes and registration for this Xi Combinator hackathon." }],
  ["/partners/", { title: "Partner Profile", description: "Ecosystem partner profile and benefits for Xi Combinator startups." }],
  ["/blog/", { title: "Blog", description: "Insights and stories from the Xi Combinator community." }],
  ["/news/", { title: "News", description: "Latest announcements from Xi Combinator." }],
  ["/startup-profile/", { title: "Startup Profile", description: "Startup profile in the Xi Combinator directory." }],
  ["/investor-profile/", { title: "Investor Profile", description: "Investor profile in the Xi Combinator investor centre." }],
  ["/member/", { title: "Member Profile", description: "Community member profile, badges and achievements." }],
];

const resolveMeta = (pathname: string) => {
  if (EXTRA_META[pathname]) return EXTRA_META[pathname];
  const entry = searchIndex.find((e) => e.path === pathname);
  if (entry) return { title: entry.title, description: entry.description };
  const dynamic = DYNAMIC_META.find(([prefix]) => pathname.startsWith(prefix));
  if (dynamic) return dynamic[1];
  return null;
};

/**
 * Per-route <head> metadata. Detail pages that know their own content render
 * their own <Helmet> after this one, which wins because Helmet dedupes.
 */
const RouteSeo = () => {
  const { pathname } = useLocation();
  const meta = resolveMeta(pathname);
  if (!meta) return null;

  const title = pathname === "/" ? meta.title : `${meta.title} | ${BRAND}`;
  const url = `${SITE_URL}${pathname}`;
  const noindex = NOINDEX_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={meta.description} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}
    </Helmet>
  );
};

export default RouteSeo;

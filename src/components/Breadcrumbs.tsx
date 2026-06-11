
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeLabels: Record<string, string> = {
  "": "Home",
  "hackathon": "Hackathon",
  "incubation": "Incubation",
  "mvp-lab": "MVP Lab",
  "xi-lab": "Xi Lab",
  "resources": "Resources",
  "partnership": "Partnership",
  "about": "About Us",
  "contact": "Contact",
  "startup-dashboard": "Startup Dashboard",
  "admin-dashboard": "Admin Dashboard",
  "startup-directory": "Startup Directory",
  "deals": "Deals",
  "blogs": "Blogs",
  "news": "News",
  "meet-cofounder": "Meet Cofounder",
  "investor-centre": "Investor Centre",
  "privacy-policy": "Privacy Policy",
  "terms-conditions": "Terms & Conditions",
  "current-cohort": "Current Cohort",
  "featured-startups": "Featured Startups",
  "philosophy": "Philosophy",
  "all-applications": "All Applications",
  "program-details": "Program Details",
  "consultation-booking": "Consultation Booking",
  "success-stories": "Success Stories",
  "become-mentor": "Become a Mentor",
  "past-events": "Past Events",
  "cloud-credits": "Cloud Credits",
  "grants-funding": "Grants & Funding"
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" }
  ];

  let currentPath = "";
  pathnames.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ label, href: currentPath });
  });

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href || index} className="flex items-center">
          {index === 0 && <Home className="h-4 w-4 mr-1" />}
          {index < breadcrumbs.length - 1 ? (
            <Link
              to={breadcrumb.href!}
              className={cn(
                "hover:text-foreground transition-colors",
                index === 0 && "flex items-center"
              )}
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{breadcrumb.label}</span>
          )}
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;

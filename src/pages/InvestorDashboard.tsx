import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Target,
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  Sparkles,
  FileText,
  BarChart3,
  Bell,
  Settings,
  SlidersHorizontal,
} from "lucide-react";

import BlogManagement from "@/components/dashboard/BlogManagement";
import PortfolioManagement from "@/components/dashboard/PortfolioManagement";
import DealPipeline from "@/components/dashboard/DealPipeline";
import NewDeals from "@/components/dashboard/NewDeals";
import InvestorAnalytics from "@/components/dashboard/InvestorAnalytics";
import InvestorSettings from "@/components/dashboard/InvestorSettings";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import AccountSettingsPanel from "@/components/dashboard/AccountSettingsPanel";
import DashboardNav, { type DashboardNavGroup } from "@/components/dashboard/DashboardNav";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { useNotifications } from "@/hooks/useNotifications";
import Money from "@/components/Money";

import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/hooks/useMyData";
import { useMyPortfolio, useInvestorPreferences, portfolioMetrics } from "@/hooks/useInvestorData";

const TAB_KEY = "investor-dashboard-tab";

const InvestorDashboard = () => {
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: prefs } = useInvestorPreferences();
  const { data: holdings = [] } = useMyPortfolio();
  const [tab, setTab] = useState(() => localStorage.getItem(TAB_KEY) || "overview");
  const { unreadCount } = useNotifications();


  useEffect(() => {
    localStorage.setItem(TAB_KEY, tab);
  }, [tab]);

  const metrics = useMemo(() => portfolioMetrics(holdings), [holdings]);

  const displayName =
    prefs?.firm_name || profile?.full_name || user?.email?.split("@")[0] || "Investor";
  const checkSize =
    prefs?.check_size_min || prefs?.check_size_max
      ? `Check size: $${Number(prefs?.check_size_min ?? 0).toLocaleString()} – $${Number(prefs?.check_size_max ?? 0).toLocaleString()}`
      : "Check size not set";
  const stages = (prefs?.stages ?? []).join(", ") || "Stages not set";

  const navGroups: DashboardNavGroup[] = [
    { label: "Overview", items: [{ value: "overview", label: "Today", icon: LayoutDashboard }] },
    {
      label: "Work",
      items: [
        { value: "portfolio", label: "Portfolio", icon: Briefcase },
        { value: "pipeline", label: "Deal Pipeline", icon: KanbanSquare },
        { value: "opportunities", label: "New Deals", icon: Sparkles },
        { value: "blogs", label: "Blogs", icon: FileText },
      ],
    },
    { label: "Growth", items: [{ value: "analytics", label: "Analytics", icon: BarChart3 }] },
    {
      label: "Account",
      items: [
        { value: "notifications", label: "Alerts", icon: Bell, badge: unreadCount },
        { value: "settings", label: "Preferences", icon: SlidersHorizontal },
        { value: "account", label: "Account", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <DashboardHeader
          title="Investor Dashboard"
          subtitle="Manage your portfolio, pipeline and sourcing in one place"
          onOpenNotifications={() => setTab("notifications")}
          onOpenSettings={() => setTab("settings")}
          meta={
            <>
              <Badge variant="outline">{displayName}</Badge>
              <Badge variant="secondary">{checkSize}</Badge>
              <Badge variant="outline">{stages}</Badge>
            </>
          }
        />

        <Tabs value={tab} onValueChange={setTab} className="flex flex-col lg:flex-row lg:gap-8">
          <DashboardNav groups={navGroups} value={tab} onChange={setTab} />

          <div className="min-w-0 flex-1 space-y-6">

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview
              onOpenAccount={() => setTab("account")}
              onOpenAlerts={() => setTab("notifications")}
              kpis={[
                { label: "Total invested", value: <Money usd={metrics.invested} compact />, icon: DollarSign },
                { label: "Portfolio value", value: <Money usd={metrics.value} compact />, hint: `${metrics.roi}% value / cost`, icon: TrendingUp },
                { label: "Active companies", value: metrics.active, hint: `${metrics.exits} exits`, icon: Target },
              ]}
              steps={[
                ...(metrics.total === 0
                  ? [{ id: "portfolio", label: "Add your first portfolio company", description: "Track investments, valuations and outcomes.", actionLabel: "Add", onAction: () => setTab("portfolio") }]
                  : []),
                ...(!prefs?.check_size_min && !prefs?.check_size_max
                  ? [{ id: "prefs", label: "Set your investment preferences", description: "Check size and stages improve deal matching.", actionLabel: "Set preferences", onAction: () => setTab("settings") }]
                  : []),
              ]}
            />
          </TabsContent>

          <TabsContent value="portfolio" forceMount className="space-y-6 data-[state=inactive]:hidden">
            <PortfolioManagement />
          </TabsContent>
          <TabsContent value="pipeline" forceMount className="space-y-6 data-[state=inactive]:hidden">
            <DealPipeline />
          </TabsContent>
          <TabsContent value="opportunities" forceMount className="space-y-6 data-[state=inactive]:hidden">
            <NewDeals />
          </TabsContent>
          <TabsContent value="blogs" className="space-y-6">
            <BlogManagement />
          </TabsContent>
          <TabsContent value="analytics" forceMount className="space-y-6 data-[state=inactive]:hidden">
            <InvestorAnalytics />
          </TabsContent>
          <TabsContent value="notifications" className="space-y-6">
            <NotificationsPanel />
          </TabsContent>
          <TabsContent value="settings" forceMount className="space-y-6 data-[state=inactive]:hidden">
            <InvestorSettings />
          </TabsContent>
          <TabsContent value="account" className="space-y-6">
            <AccountSettingsPanel />
          </TabsContent>
          </div>
        </Tabs>

      </main>
    </div>
  );
};

export default InvestorDashboard;

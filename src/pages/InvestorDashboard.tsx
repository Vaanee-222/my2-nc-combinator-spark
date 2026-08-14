import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, DollarSign, Target } from "lucide-react";

import BlogManagement from "@/components/dashboard/BlogManagement";
import PortfolioManagement from "@/components/dashboard/PortfolioManagement";
import DealPipeline from "@/components/dashboard/DealPipeline";
import NewDeals from "@/components/dashboard/NewDeals";
import InvestorAnalytics from "@/components/dashboard/InvestorAnalytics";
import InvestorSettings from "@/components/dashboard/InvestorSettings";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import AccountSettingsPanel from "@/components/dashboard/AccountSettingsPanel";
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
  const [tab, setTab] = useState(() => localStorage.getItem(TAB_KEY) || "portfolio");

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
          stats={[
            { label: "Total portfolio", value: metrics.total },
            { label: "Active", value: metrics.active },
            { label: "Exits", value: metrics.exits },
          ]}
        />


        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card-gradient border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold"><Money usd={metrics.invested} compact /></p>
                  <p className="text-xs text-muted-foreground">Total Invested</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card-gradient border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold"><Money usd={metrics.value} compact /></p>
                  <p className="text-xs text-muted-foreground">Portfolio Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card-gradient border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{metrics.roi}%</p>
                  <p className="text-xs text-muted-foreground">Value / Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card-gradient border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{metrics.successRate}%</p>
                  <p className="text-xs text-muted-foreground">Above Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="pipeline">Deal Pipeline</TabsTrigger>
            <TabsTrigger value="opportunities">New Deals</TabsTrigger>
            <TabsTrigger value="blogs">Blog Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

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
          <TabsContent value="settings" forceMount className="space-y-6 data-[state=inactive]:hidden">
            <InvestorSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default InvestorDashboard;

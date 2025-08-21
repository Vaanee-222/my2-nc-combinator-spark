import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminOverview from "@/components/dashboard/AdminOverview";
import StartupManagement from "@/components/dashboard/StartupManagement";
import ApplicationManagement from "@/components/dashboard/ApplicationManagement";
import InvestorManagement from "@/components/dashboard/InvestorManagement";
import AdminSettings from "@/components/dashboard/AdminSettings";
import ProgramManagement from "@/components/dashboard/ProgramManagement";

const AdminDashboard = () => {
  const { toast } = useToast();
  const stats = {
    totalStartups: 1247,
    activeApplications: 89,
    totalInvestors: 156,
    totalDeals: 234,
    monthlyGrowth: 12.5
  };

  const recentApplications = [
    { id: 1, startup: "AI Healthcare Solutions", founder: "Priya Sharma", stage: "Seed", status: "Under Review", date: "Dec 20, 2024" },
    { id: 2, startup: "GreenTech Innovations", founder: "Rahul Verma", stage: "Pre-Seed", status: "Approved", date: "Dec 19, 2024" },
    { id: 3, startup: "EdTech Platform", founder: "Anita Singh", stage: "Series A", status: "Pending", date: "Dec 18, 2024" }
  ];

  const topStartups = [
    { id: 1, name: "AI Healthcare Solutions", sector: "HealthTech", valuation: "₹50Cr", growth: "+45%", status: "Series A" },
    { id: 2, name: "GreenTech Innovations", sector: "CleanTech", valuation: "₹30Cr", growth: "+38%", status: "Seed" },
    { id: 3, name: "EdTech Platform", sector: "Education", valuation: "₹25Cr", growth: "+32%", status: "Pre-Seed" }
  ];

  const investors = [
    { id: 1, name: "Sequoia Capital India", checkSize: "₹5-50Cr", portfolio: 45, stage: "Series A+", status: "Active" },
    { id: 2, name: "Accel Partners", checkSize: "₹2-25Cr", portfolio: 38, stage: "Seed-Series B", status: "Active" },
    { id: 3, name: "Matrix Partners", checkSize: "₹1-15Cr", portfolio: 52, stage: "Pre-Seed-Series A", status: "Active" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage Inc Combinator ecosystem and operations</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="startups">Startups</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminOverview 
              stats={stats} 
              recentApplications={recentApplications} 
              topStartups={topStartups} 
            />
          </TabsContent>

          <TabsContent value="startups" className="space-y-6">
            <StartupManagement startups={topStartups} />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationManagement applications={recentApplications} />
          </TabsContent>

          <TabsContent value="investors" className="space-y-6">
            <InvestorManagement investors={investors} />
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Deal Management</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Deal
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">42</div>
                  <p className="text-sm text-muted-foreground">Currently live deals</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">₹12.5L</div>
                  <p className="text-sm text-muted-foreground">Worth of benefits</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Claims This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">156</div>
                  <p className="text-sm text-muted-foreground">+23% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">24</div>
                  <p className="text-sm text-muted-foreground">Published this month</p>
                  <Button className="w-full mt-4" variant="outline" onClick={() => {
                    toast({
                      title: "Blog Management",
                      description: "Opening blog management interface...",
                    });
                  }}>Manage Blogs</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>News Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">18</div>
                  <p className="text-sm text-muted-foreground">Latest updates</p>
                  <Button className="w-full mt-4" variant="outline" onClick={() => {
                    toast({
                      title: "News Management",
                      description: "Opening news management interface...",
                    });
                  }}>Manage News</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">1,247</div>
                  <p className="text-sm text-muted-foreground">Listed startups</p>
                  <Button className="w-full mt-4" variant="outline">Manage Directory</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Co-founder Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">89</div>
                  <p className="text-sm text-muted-foreground">Active listings</p>
                  <Button className="w-full mt-4" variant="outline">Manage Posts</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <ProgramManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>New Startups</span>
                      <span className="font-bold text-green-600">+12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Application Rate</span>
                      <span className="font-bold text-green-600">+8.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investor Engagement</span>
                      <span className="font-bold text-green-600">+15.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deal Claims</span>
                      <span className="font-bold text-green-600">+23.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Sectors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>FinTech</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 bg-muted rounded-full">
                          <div className="h-2 w-16 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm">32%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>HealthTech</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 bg-muted rounded-full">
                          <div className="h-2 w-12 bg-orange-400 rounded-full"></div>
                        </div>
                        <span className="text-sm">24%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>EdTech</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 bg-muted rounded-full">
                          <div className="h-2 w-8 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-sm">18%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;

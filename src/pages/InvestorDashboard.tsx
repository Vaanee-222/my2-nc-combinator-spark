import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, MessageSquare, TrendingUp, Star, DollarSign, Users, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import BlogManagement from "@/components/dashboard/BlogManagement";
import PortfolioManagement from "@/components/dashboard/PortfolioManagement";
import InvestorSettings from "@/components/dashboard/InvestorSettings";

const InvestorDashboard = () => {
  const { toast } = useToast();
  
  const investorProfile = {
    name: "Sarah Investment Capital",
    type: "Venture Capital",
    checkSize: "$0.1M–$0.6M",
    totalPortfolio: 25,
    activeInvestments: 18,
    successfulExits: 7,
    sectors: ["FinTech", "HealthTech", "EdTech", "AI/ML"],
    stage: "Seed to Series A"
  };

  const portfolioCompanies = [
    {
      id: 1,
      company: "TechFlow Solutions",
      sector: "FinTech",
      investmentAmount: "$300K",
      currentValuation: "$1.8M",
      investmentDate: "Jan 2023",
      stage: "Series A",
      status: "Active",
      growth: "+45%"
    },
    {
      id: 2,
      company: "HealthCare AI",
      sector: "HealthTech",
      investmentAmount: "$220K",
      currentValuation: "$1.5M",
      investmentDate: "Mar 2023",
      stage: "Seed",
      status: "Active",
      growth: "+38%"
    },
    {
      id: 3,
      company: "EduNext Platform",
      sector: "EdTech",
      investmentAmount: "$385K",
      currentValuation: "$2.2M",
      investmentDate: "Dec 2022",
      stage: "Series A",
      status: "Exited",
      growth: "+65%"
    }
  ];

  const dealPipeline = [
    {
      id: 1,
      company: "GreenTech Solutions",
      sector: "CleanTech",
      requestedAmount: "$0.5M",
      stage: "Due Diligence",
      progress: 75,
      foundedYear: 2022,
      team: 12,
      revenue: "$60K ARR"
    },
    {
      id: 2,
      company: "AI Robotics Co",
      sector: "AI/ML",
      requestedAmount: "$0.7M",
      stage: "Initial Review",
      progress: 25,
      foundedYear: 2023,
      team: 8,
      revenue: "$30K ARR"
    }
  ];

  const investmentMetrics = {
    totalInvested: "$5.4M",
    currentPortfolioValue: "$21.6M",
    averageROI: "285%",
    successRate: "78%"
  };

  const handleViewPortfolio = (companyId: number) => {
    toast({
      title: "Portfolio Details",
      description: `Opening detailed view for portfolio company #${companyId}`,
    });
  };

  const handleReviewDeal = (dealId: number) => {
    toast({
      title: "Deal Review",
      description: `Opening deal review for opportunity #${dealId}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Investor Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your investment portfolio and deal pipeline</p>
        </div>

        {/* Investor Overview */}
        <Card className="mb-8 bg-card-gradient border-border">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{investorProfile.name}</CardTitle>
                <CardDescription className="text-lg">{investorProfile.type}</CardDescription>
                <div className="flex space-x-2 mt-2">
                  <Badge variant="secondary">Check Size: {investorProfile.checkSize}</Badge>
                  <Badge variant="outline">{investorProfile.stage}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{investorProfile.totalPortfolio}</div>
                    <div className="text-xs text-muted-foreground">Total Portfolio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{investorProfile.activeInvestments}</div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{investorProfile.successfulExits}</div>
                    <div className="text-xs text-muted-foreground">Exits</div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Investment Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card-gradient border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{investmentMetrics.totalInvested}</p>
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
                  <p className="text-2xl font-bold">{investmentMetrics.currentPortfolioValue}</p>
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
                  <p className="text-2xl font-bold">{investmentMetrics.averageROI}</p>
                  <p className="text-xs text-muted-foreground">Avg ROI</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card-gradient border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{investmentMetrics.successRate}</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="pipeline">Deal Pipeline</TabsTrigger>
            <TabsTrigger value="opportunities">New Deals</TabsTrigger>
            <TabsTrigger value="blogs">Blog Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioManagement />
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Deal Pipeline</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Deal
              </Button>
            </div>
            <div className="space-y-4">
              {dealPipeline.map((deal) => (
                <Card key={deal.id} className="bg-card-gradient border-border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="text-lg font-semibold">{deal.company}</h3>
                          <p className="text-sm text-muted-foreground">
                            {deal.sector} • Founded {deal.foundedYear} • {deal.team} team members
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span><strong>Requested:</strong> {deal.requestedAmount}</span>
                          <span><strong>Revenue:</strong> {deal.revenue}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Stage: {deal.stage}</span>
                            <span>{deal.progress}%</span>
                          </div>
                          <Progress value={deal.progress} />
                        </div>
                      </div>
                      <div className="text-right space-y-3">
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleReviewDeal(deal.id)}>
                            Review
                          </Button>
                          <Button variant="outline" size="sm">
                            Schedule Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">New Investment Opportunities</h2>
              <Button variant="outline">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle>AI-Powered Logistics</CardTitle>
                  <CardDescription>Series A • $1M • LogisTech</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-bold">95% Match Score</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI-driven supply chain optimization with 40% cost reduction for enterprises.
                    </p>
                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">Review Deal</Button>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle>MedTech Innovation</CardTitle>
                  <CardDescription>Seed • $360K • HealthFlow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-bold">88% Match Score</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Revolutionary diagnostic platform using AI for early disease detection.
                    </p>
                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">Review Deal</Button>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle>Investment Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Portfolio Growth</span>
                        <span>+42% YoY</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Deal Success Rate</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle>Sector Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">FinTech</span>
                      <span className="font-bold text-primary">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">HealthTech</span>
                      <span className="font-bold text-primary">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">EdTech</span>
                      <span className="font-bold text-primary">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">AI/ML</span>
                      <span className="font-bold text-primary">20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle>Deal Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">24</div>
                      <div className="text-sm text-muted-foreground">Deals Reviewed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">6</div>
                      <div className="text-sm text-muted-foreground">Investments Made</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <InvestorSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default InvestorDashboard;

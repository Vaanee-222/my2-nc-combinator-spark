
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, DollarSign, TrendingUp, Building, Calendar, ExternalLink, Mail, Phone } from "lucide-react";

const InvestorProfile = () => {
  const investorData = {
    name: "Ravi Sharma",
    title: "Managing Partner",
    company: "Prime Ventures",
    location: "Mumbai, India",
    image: "/placeholder.svg",
    totalInvestments: "$250 Cr",
    portfolioSize: 42,
    avgTicketSize: "$5-15 Cr",
    industries: ["FinTech", "SaaS", "E-commerce", "HealthTech"],
    investmentStage: ["Series A", "Series B", "Growth"],
    description: "Seasoned investor with 15+ years of experience in scaling technology companies. Focus on B2B SaaS and FinTech startups with strong unit economics and clear path to profitability."
  };

  const portfolioCompanies = [
    { name: "PayNext", sector: "FinTech", stage: "Series B", valuation: "$500 Cr" },
    { name: "HealthConnect", sector: "HealthTech", stage: "Series A", valuation: "$200 Cr" },
    { name: "EduPlatform", sector: "EdTech", stage: "Growth", valuation: "$800 Cr" },
    { name: "LogiTech Pro", sector: "SaaS", stage: "Series A", valuation: "$150 Cr" }
  ];

  const recentActivity = [
    { type: "Investment", company: "DataFlow Systems", amount: "$12 Cr", date: "2024-01-15" },
    { type: "Exit", company: "MobileFirst", amount: "$45 Cr", date: "2024-01-10" },
    { type: "Follow-on", company: "HealthConnect", amount: "$8 Cr", date: "2024-01-05" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={investorData.image} alt={investorData.name} />
                  <AvatarFallback className="text-2xl">RS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{investorData.name}</h1>
                  <p className="text-xl text-muted-foreground">{investorData.title} at {investorData.company}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{investorData.location}</span>
                  </div>
                  <p className="mt-4 text-muted-foreground max-w-2xl">{investorData.description}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Get Introduction
                  </Button>
                  <Button variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Schedule Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{investorData.totalInvestments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Size</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{investorData.portfolioSize}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Ticket Size</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{investorData.avgTicketSize}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Since</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">2009</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Investment Focus */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Industries</h4>
                  <div className="flex flex-wrap gap-2">
                    {investorData.industries.map((industry) => (
                      <Badge key={industry} variant="secondary">{industry}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Investment Stages</h4>
                  <div className="flex flex-wrap gap-2">
                    {investorData.investmentStage.map((stage) => (
                      <Badge key={stage} variant="outline">{stage}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Companies */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Companies</CardTitle>
                <CardDescription>Selected investments from {investorData.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioCompanies.map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{company.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{company.sector}</Badge>
                          <Badge variant="secondary" className="text-xs">{company.stage}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">{company.valuation}</p>
                        <p className="text-xs text-muted-foreground">Current Valuation</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'Investment' ? 'bg-green-500' :
                      activity.type === 'Exit' ? 'bg-blue-500' : 'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.type}</p>
                      <p className="text-sm text-muted-foreground">{activity.company}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-medium text-primary">{activity.amount}</span>
                        <span className="text-xs text-muted-foreground">{activity.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InvestorProfile;

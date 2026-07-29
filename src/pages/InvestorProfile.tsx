import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, DollarSign, TrendingUp, Building, Calendar, Mail, Phone } from "lucide-react";
import ConsultationDialog from "@/components/ConsultationDialog";
import { StatefulCTA } from "@/components/StatefulCTA";
import IntroductionRequestButton from "@/components/IntroductionRequestButton";
import { useParams, useNavigate } from "react-router-dom";
import { getInvestorById } from "@/data/investors";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const InvestorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const investor = getInvestorById(id);

  const investorData = {
    name: investor?.name ?? "Investor",
    title: investor?.type ?? "Investor",
    company: investor?.name ?? "",
    location: investor?.location ?? "Global",
    image: "/placeholder.svg",
    totalInvestments: investor?.aum ?? "$30M",
    portfolioSize: investor?.portfolio ?? investor?.investments ?? 20,
    avgTicketSize: investor?.checkSize ?? "$100K – $2M",
    industries: investor?.sectors ?? ["FinTech", "SaaS"],
    investmentStage: (investor?.stage ?? "Seed, Series A").split(",").map((s) => s.trim()),
    description:
      investor?.description ??
      `${investor?.name ?? "This investor"} focuses on ${(investor?.sectors ?? []).slice(0, 3).join(", ") || "technology"} companies with strong founding teams.`,
  };

  const portfolioCompanies = (investor?.recentInvestments ?? investor?.notable ?? [
    "PortfolioCo A",
    "PortfolioCo B",
    "PortfolioCo C",
  ]).map((name, i) => ({
    name,
    sector: (investorData.industries[i % investorData.industries.length] as string) || "Tech",
    stage: (investorData.investmentStage[i % investorData.investmentStage.length] as string) || "Series A",
    valuation: ["$60M", "$24M", "$96M", "$18M"][i % 4],
  }));

  const recentActivity = [
    { type: "Investment", company: portfolioCompanies[0]?.name ?? "DataFlow", amount: "$1.5M", date: "2026-01-15" },
    { type: "Exit", company: portfolioCompanies[1]?.name ?? "MobileFirst", amount: "$5.4M", date: "2026-01-10" },
    { type: "Follow-on", company: portfolioCompanies[2]?.name ?? "HealthConnect", amount: "$1M", date: "2026-01-05" },
  ];

  const handleGetIntroduction = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in as a founder or startup to request an introduction.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/investor-profile/${id ?? ""}` } });
      return;
    }
    if (userRole && !["startup", "cofounder", "admin"].includes(userRole)) {
      toast({
        title: "Founders only",
        description: "Only startup/founder accounts can request investor introductions.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Introduction Request Sent",
      description: `We'll facilitate an intro with ${investorData.name} within 48 hours.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={investorData.image} alt={investorData.name} />
                  <AvatarFallback className="text-2xl">{investorData.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{investorData.name}</h1>
                  <p className="text-xl text-muted-foreground">{investorData.title}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{investorData.location}</span>
                  </div>
                  <p className="mt-4 text-muted-foreground max-w-2xl">{investorData.description}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <IntroductionRequestButton
                    investorId={id ?? investorData.name}
                    investorName={investorData.name}
                    idleLabel="Get Introduction"
                    redirectPath={`/investor-profile/${id ?? ""}`}
                  />
                  <ConsultationDialog title={`Schedule Call with ${investorData.name}`} description="Book a 30-minute intro call.">
                    <Button variant="outline">
                      <Phone className="mr-2 h-4 w-4" />
                      Schedule Call
                    </Button>
                  </ConsultationDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AUM / Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-primary">{investorData.totalInvestments}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Size</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-primary">{investorData.portfolioSize}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Check Size</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-primary">{investorData.avgTicketSize}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Since</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-primary">{investor?.founded ?? "—"}</div></CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Investment Focus</CardTitle></CardHeader>
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

          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
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

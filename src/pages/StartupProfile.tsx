
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, DollarSign, TrendingUp, Calendar, ExternalLink, Mail, Phone, Globe } from "lucide-react";
import { useParams } from "react-router-dom";
import ApplicationDialog from "@/components/ApplicationDialog";

const StartupProfile = () => {
  const { id } = useParams();
  
  // Mock data - in a real app, this would come from an API
  const startupData = {
    id: id || "1",
    name: "AgriTech Solutions",
    founder: "Rajesh Kumar",
    coFounders: ["Priya Sharma", "Amit Patel"],
    category: "Agriculture",
    description: "AI-powered crop monitoring system helping farmers increase yield by 40% through precision agriculture and predictive analytics",
    longDescription: "AgriTech Solutions is revolutionizing agriculture through cutting-edge AI technology. Our comprehensive platform provides farmers with real-time crop monitoring, weather predictions, soil analysis, and automated irrigation systems. We've successfully deployed our solution across 5 states, impacting over 50,000 farmers and increasing their average yield by 40%.",
    stage: "Series A",
    funding: "$250K raised",
    valuation: "$1.8M",
    impact: "50,000+ farmers impacted",
    location: "Bangalore, India",
    team: 12,
    founded: "2022",
    website: "https://agritechsolutions.com",
    email: "contact@agritechsolutions.com",
    phone: "+91-9876543210",
    logo: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    metrics: {
      revenue: "$60K ARR",
      growth: "300% YoY",
      customers: "10K+",
      retention: "95%"
    },
    milestones: [
      { date: "2024-01", title: "Series A Funding", description: "Raised $250K from leading VCs" },
      { date: "2023-12", title: "50K Farmers", description: "Reached 50,000 farmers milestone" },
      { date: "2023-06", title: "Multi-state Expansion", description: "Expanded to 5 states across India" },
      { date: "2023-01", title: "Product Launch", description: "Launched AI-powered crop monitoring system" }
    ],
    investors: ["Sequoia Capital", "Accel Partners", "Blume Ventures"],
    technologies: ["React", "Python", "TensorFlow", "AWS", "IoT", "Machine Learning"]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Card className="bg-card-gradient border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={startupData.logo} alt={startupData.name} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {startupData.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{startupData.name}</h1>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {startupData.category}
                    </Badge>
                  </div>
                  <p className="text-xl text-muted-foreground mb-2">
                    Founded by {startupData.founder} in {startupData.founded}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {startupData.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {startupData.team} team members
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {startupData.stage}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{startupData.description}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <ApplicationDialog program="Investment" title="Investment Inquiry" description="Express your interest in investing in this startup">
                    <Button className="bg-gradient-to-r from-primary to-orange-400">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Invest Now
                    </Button>
                  </ApplicationDialog>
                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card-gradient border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Annual Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{startupData.metrics.revenue}</div>
              <p className="text-xs text-muted-foreground">{startupData.metrics.growth} growth</p>
            </CardContent>
          </Card>
          <Card className="bg-card-gradient border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{startupData.metrics.customers}</div>
              <p className="text-xs text-muted-foreground">{startupData.metrics.retention} retention</p>
            </CardContent>
          </Card>
          <Card className="bg-card-gradient border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valuation</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{startupData.valuation}</div>
              <p className="text-xs text-muted-foreground">{startupData.funding}</p>
            </CardContent>
          </Card>
          <Card className="bg-card-gradient border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impact</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{startupData.impact}</div>
              <p className="text-xs text-muted-foreground">Lives changed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>About {startupData.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{startupData.longDescription}</p>
              </CardContent>
            </Card>

            {/* Technology Stack */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {startupData.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Key Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {startupData.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <span className="text-sm text-muted-foreground">{milestone.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Founder</h4>
                  <p className="text-sm text-muted-foreground">{startupData.founder}</p>
                </div>
                <div>
                  <h4 className="font-medium">Co-founders</h4>
                  <div className="space-y-1">
                    {startupData.coFounders.map((cofounder, index) => (
                      <p key={index} className="text-sm text-muted-foreground">{cofounder}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investors */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {startupData.investors.map((investor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{investor}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{startupData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{startupData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{startupData.website}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StartupProfile;

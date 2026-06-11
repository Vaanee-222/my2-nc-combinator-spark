import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Building2, DollarSign, TrendingUp, Users, Search, Filter, MapPin, ExternalLink, Star, Mail, Linkedin, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PitchSubmissionDialog from "@/components/PitchSubmissionDialog";
import ConsultationDialog from "@/components/ConsultationDialog";
import Footer from "@/components/Footer";

const InvestorCentre = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pitchMessage, setPitchMessage] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  
  const featuredInvestors = [
    {
      id: 1,
      name: "Sequoia Capital India",
      type: "Venture Capital",
      checkSize: "$600K - $6M",
      stage: "Series A, Series B, Series C",
      portfolio: 45,
      sectors: ["FinTech", "HealthTech", "Enterprise Software"],
      description: "Leading venture capital firm with a strong track record of backing category-defining companies in India.",
      recentInvestments: ["Zomato", "Byju's", "Ola"],
      website: "sequoiacap.com",
      linkedin: "linkedin.com/company/sequoia-capital",
      founded: "2006",
      location: "Bangalore, Mumbai",
      aum: "$1.35B",
      logo: ""
    },
    {
      id: 2,
      name: "Accel Partners India",
      type: "Venture Capital",
      checkSize: "$250K - $3M",
      stage: "Seed, Series A, Series B",
      portfolio: 38,
      sectors: ["SaaS", "Mobility", "Consumer Internet"],
      description: "Global venture capital firm focused on partnering with exceptional entrepreneurs and companies.",
      recentInvestments: ["Flipkart", "Swiggy", "Freshworks"],
      website: "accel.com",
      linkedin: "linkedin.com/company/accel-partners",
      founded: "2008",
      location: "Bangalore",
      aum: "$650M",
      logo: ""
    },
    {
      id: 3,
      name: "Matrix Partners India",
      type: "Venture Capital",
      checkSize: "$125K - $1.8M",
      stage: "Pre-Seed, Seed, Series A",
      portfolio: 52,
      sectors: ["B2B SaaS", "FinTech", "HealthTech"],
      description: "Early-stage venture capital firm committed to helping entrepreneurs build companies of consequence.",
      recentInvestments: ["Razorpay", "Ola Electric", "Cure.fit"],
      website: "matrixpartners.in",
      linkedin: "linkedin.com/company/matrix-partners-india",
      founded: "2010",
      location: "Bangalore, Delhi",
      aum: "$450M",
      logo: ""
    }
  ];

  const allInvestors = [
    {
      id: 4,
      name: "Blume Ventures",
      type: "Early Stage VC",
      checkSize: "$60K - $1.2M",
      stage: "Pre-Seed, Seed",
      portfolio: 156,
      sectors: ["Consumer", "Enterprise", "Gaming"],
      location: "Mumbai, Bangalore",
      logo: ""
    },
    {
      id: 5,
      name: "Kalaari Capital",
      type: "Venture Capital",
      checkSize: "$125K - $2.5M",
      stage: "Seed, Series A",
      portfolio: 68,
      sectors: ["SaaS", "FinTech", "DeepTech"],
      location: "Bangalore",
      logo: ""
    },
    {
      id: 6,
      name: "Nexus Venture Partners",
      type: "Venture Capital",
      checkSize: "$250K - $3.6M",
      stage: "Series A, Series B",
      portfolio: 42,
      sectors: ["Enterprise", "Consumer", "Healthcare"],
      location: "Mumbai, Bangalore",
      logo: ""
    },
    {
      id: 7,
      name: "Lightspeed India",
      type: "Venture Capital",
      checkSize: "$360K - $5M",
      stage: "Series A, Series B, Series C",
      portfolio: 35,
      sectors: ["Enterprise", "Consumer", "FinTech"],
      location: "Bangalore, Delhi",
      logo: ""
    },
    {
      id: 8,
      name: "Elevation Capital",
      type: "Venture Capital",
      checkSize: "$600K - $6M",
      stage: "Series A, Series B, Growth",
      portfolio: 28,
      sectors: ["Consumer Internet", "SaaS", "FinTech"],
      location: "Bangalore, Delhi",
      logo: ""
    }
  ];

  const angelInvestors = [
    {
      id: 9,
      name: "Ratan Tata",
      type: "Angel Investor",
      checkSize: "$30K - $250K",
      sectors: ["Consumer", "HealthTech", "Automotive"],
      investments: "100+",
      notable: ["Ola", "Paytm", "Urban Company"],
      logo: ""
    },
    {
      id: 10,
      name: "Kunal Bahl",
      type: "Angel Investor",
      checkSize: "$12K - $125K",
      sectors: ["E-commerce", "B2B", "Consumer"],
      investments: "50+",
      notable: ["Snapdeal Co-founder", "Multiple investments"],
      logo: ""
    },
    {
      id: 11,
      name: "Binny Bansal",
      type: "Angel Investor",
      checkSize: "$18K - $180K",
      sectors: ["E-commerce", "Logistics", "B2B"],
      investments: "40+",
      notable: ["Flipkart Co-founder", "xto10x"],
      logo: ""
    }
  ];

  const investmentStages = ["All Stages", "Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Growth"];
  const investorTypes = ["All Types", "Venture Capital", "Angel Investor", "Private Equity", "Corporate VC"];
  const sectors = ["All Sectors", "FinTech", "HealthTech", "EdTech", "SaaS", "E-commerce", "Consumer"];

  const handleGetIntroduction = (investor: any) => {
    console.log("Getting introduction for:", investor.name);
    toast({
      title: "Introduction Request Sent!",
      description: `We'll facilitate an introduction with ${investor.name} within 48 hours.`,
    });
  };

  const handleViewProfile = (investorId: number) => {
    navigate(`/investor-profile/${investorId}`);
  };

  const handleConnectWithInvestor = (investor: any) => {
    console.log("Connecting with investor:", investor.name);
    toast({
      title: "Connection Request Sent!",
      description: `Your profile has been shared with ${investor.name}. They'll review and respond soon.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Investor Centre
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Connect with India's top investors, VCs, and angels. Find the right funding partner for your startup's growth journey.
          </p>
          <div className="flex justify-center space-x-4">
            <PitchSubmissionDialog>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Submit Your Pitch
              </Button>
            </PitchSubmissionDialog>
            <Button variant="outline" size="lg" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}>
              Browse Investors
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Investors</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">250+</div>
              <p className="text-xs text-muted-foreground">VCs, Angels & PEs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">$1.8B</div>
              <p className="text-xs text-muted-foreground">Assets under management</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deals Made</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">1,200+</div>
              <p className="text-xs text-muted-foreground">Through our platform</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">85%</div>
              <p className="text-xs text-muted-foreground">Funding success rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="venture-capital" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="venture-capital">Venture Capital</TabsTrigger>
            <TabsTrigger value="angel-investors">Angel Investors</TabsTrigger>
            <TabsTrigger value="connect">Connect with Investors</TabsTrigger>
            <TabsTrigger value="insights">Market Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="venture-capital" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search investors..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Investment Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentStages.map((stage) => (
                        <SelectItem key={stage} value={stage.toLowerCase().replace(" ", "-")}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sector Focus" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector.toLowerCase().replace(" ", "-")}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Check Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seed">$60K - $600K</SelectItem>
                      <SelectItem value="early">$600K - $3M</SelectItem>
                      <SelectItem value="growth">$3M - $12M</SelectItem>
                      <SelectItem value="late">$12M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Featured VCs */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Star className="h-6 w-6 text-primary" />
                <span>Top Venture Capital Firms</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {featuredInvestors.map((investor) => (
                  <Card key={investor.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Building2 className="h-7 w-7" /></div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{investor.name}</CardTitle>
                          <CardDescription className="font-medium">{investor.type}</CardDescription>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{investor.portfolio} portfolio companies</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{investor.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Check Size</p>
                          <p className="font-medium">{investor.checkSize}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Investment Stage</p>
                          <p className="font-medium">{investor.stage}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">AUM</p>
                          <p className="font-medium">{investor.aum}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Founded</p>
                          <p className="font-medium">{investor.founded}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-sm mb-2">Sector Focus</p>
                        <div className="flex flex-wrap gap-1">
                          {investor.sectors.map((sector) => (
                            <Badge key={sector} variant="secondary" className="text-xs">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-sm mb-2">Recent Investments</p>
                        <div className="flex flex-wrap gap-1">
                          {investor.recentInvestments.slice(0, 3).map((investment) => (
                            <Badge key={investment} variant="outline" className="text-xs">
                              {investment}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{investor.location}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1" 
                          size="sm"
                          onClick={() => handleGetIntroduction(investor)}
                        >
                          Get Introduction
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewProfile(investor.id)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* All VCs */}
            <section>
              <h2 className="text-2xl font-bold mb-6">All Venture Capital Firms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allInvestors.map((investor) => (
                  <Card key={investor.id} className="hover:shadow-md transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Building2 className="h-6 w-6" /></div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{investor.name}</h3>
                          <p className="text-primary font-medium">{investor.type}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span>{investor.checkSize}</span>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{investor.location}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {investor.sectors.slice(0, 2).map((sector) => (
                              <Badge key={sector} variant="outline" className="text-xs">
                                {sector}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{investor.portfolio} companies</p>
                          <div className="flex space-x-1 mt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewProfile(investor.id)}
                            >
                              View
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleConnectWithInvestor(investor)}
                            >
                              Connect
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="angel-investors" className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Angel Investors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {angelInvestors.map((angel) => (
                <Card key={angel.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{angel.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{angel.name}</CardTitle>
                        <CardDescription>{angel.type}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Check Size</p>
                        <p className="font-medium">{angel.checkSize}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Investments</p>
                        <p className="font-medium">{angel.investments}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Sector Focus</p>
                      <div className="flex flex-wrap gap-1">
                        {angel.sectors.map((sector) => (
                          <Badge key={sector} variant="secondary" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Notable Investments</p>
                      <div className="flex flex-wrap gap-1">
                        {angel.notable.map((investment) => (
                          <Badge key={investment} variant="outline" className="text-xs">
                            {investment}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleGetIntroduction(angel)}
                    >
                      Request Introduction
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="connect" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connect with Investors</CardTitle>
                <CardDescription>
                  Submit your startup details and we'll help you connect with the right investors for your stage and sector.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Startup Name</label>
                      <Input placeholder="Your startup name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Founder Name</label>
                      <Input placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Current Stage</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                          <SelectItem value="seed">Seed</SelectItem>
                          <SelectItem value="series-a">Series A</SelectItem>
                          <SelectItem value="series-b">Series B</SelectItem>
                          <SelectItem value="series-c">Series C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Industry Sector</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fintech">FinTech</SelectItem>
                          <SelectItem value="healthtech">HealthTech</SelectItem>
                          <SelectItem value="edtech">EdTech</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="consumer">Consumer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Funding Required</label>
                      <Input placeholder="e.g., $250Kores" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Monthly Revenue (if any)</label>
                      <Input placeholder="e.g., $5 Lakhs" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Team Size</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 members</SelectItem>
                          <SelectItem value="6-10">6-10 members</SelectItem>
                          <SelectItem value="11-25">11-25 members</SelectItem>
                          <SelectItem value="26-50">26-50 members</SelectItem>
                          <SelectItem value="50+">50+ members</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="delhi">Delhi NCR</SelectItem>
                          <SelectItem value="pune">Pune</SelectItem>
                          <SelectItem value="hyderabad">Hyderabad</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Startup Description</label>
                  <textarea 
                    className="w-full p-3 border rounded-md resize-none h-24"
                    placeholder="Briefly describe your startup, the problem you're solving, and your traction..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Use of Funds</label>
                  <textarea 
                    className="w-full p-3 border rounded-md resize-none h-20"
                    placeholder="How will you use the funding? (hiring, marketing, product development, etc.)"
                  />
                </div>
                <Button size="lg" className="w-full bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                  Submit for Investor Matching
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Funding Trends Q4 2024</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Funding</span>
                    <span className="font-bold text-primary">$1B</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Number of Deals</span>
                    <span className="font-bold">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Deal Size</span>
                    <span className="font-bold">$6.4M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>QoQ Growth</span>
                    <span className="font-bold text-green-600">+15%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Funded Sectors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <span>E-commerce</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-20 bg-muted rounded-full">
                        <div className="h-2 w-12 bg-orange-400 rounded-full"></div>
                      </div>
                      <span className="text-sm">24%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>HealthTech</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-20 bg-muted rounded-full">
                        <div className="h-2 w-10 bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-sm">18%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SaaS</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-20 bg-muted rounded-full">
                        <div className="h-2 w-8 bg-blue-400 rounded-full"></div>
                      </div>
                      <span className="text-sm">16%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <section className="text-center py-16 mt-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Raise Funding?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Xi Combinator and get access to our exclusive network of investors, mentors, and funding opportunities.
          </p>
          <div className="flex justify-center space-x-4">
            <PitchSubmissionDialog>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Apply to Xi Combinator
              </Button>
            </PitchSubmissionDialog>
            <ConsultationDialog>
              <Button variant="outline" size="lg">
                Schedule Consultation
              </Button>
            </ConsultationDialog>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default InvestorCentre;

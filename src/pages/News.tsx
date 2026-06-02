import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, TrendingUp, DollarSign, Building2, Search, ExternalLink } from "lucide-react";
import NewsDetail from "@/components/NewsDetail";

const News = () => {
  const breakingNews = {
    id: 1,
    title: "Indian Startups Raise Record $8.3B in Q4 2024",
    excerpt: "The Indian startup ecosystem shows remarkable resilience with highest quarterly funding in 2024.",
    category: "Funding",
    time: "2 hours ago",
    source: "Xi Combinator Research",
    urgent: true
  };

  const topStories = [
    {
      id: 2,
      title: "Zomato Acquires AI Startup for $150M to Enhance Food Delivery",
      excerpt: "The acquisition marks Zomato's biggest bet on artificial intelligence to optimize delivery routes and predict customer preferences.",
      category: "M&A",
      time: "4 hours ago",
      source: "TechCrunch India",
      image: "🍕"
    },
    {
      id: 3,
      title: "New Government Policy Reduces Compliance Burden for Startups",
      excerpt: "The Ministry of Commerce announces simplified regulatory framework expected to benefit over 50,000 Indian startups.",
      category: "Policy",
      time: "6 hours ago",
      source: "Economic Times",
      image: "🏛️"
    },
    {
      id: 4,
      title: "Bengaluru Overtakes Singapore as Top Startup Hub in Asia",
      excerpt: "New study ranks Bengaluru as the leading startup ecosystem in Asia, citing talent availability and funding accessibility.",
      category: "Ecosystem",
      time: "8 hours ago",
      source: "YourStory",
      image: "🌏"
    }
  ];

  const fundingNews = [
    {
      id: 5,
      title: "HealthTech Startup Curefit Raises $50M Series C",
      company: "Curefit",
      amount: "$50M",
      round: "Series C",
      investors: ["Sequoia Capital", "Accel Partners"],
      sector: "HealthTech",
      time: "1 day ago"
    },
    {
      id: 6,
      title: "EdTech Platform BYJU'S Secures $100M Bridge Funding",
      company: "BYJU'S",
      amount: "$100M",
      round: "Bridge",
      investors: ["Davidson Kempner", "Avendus Capital"],
      sector: "EdTech",
      time: "2 days ago"
    },
    {
      id: 7,
      title: "Fintech Unicorn Paytm Raises $200M Growth Round",
      company: "Paytm",
      amount: "$200M",
      round: "Growth",
      investors: ["SoftBank", "Ant Financial"],
      sector: "Fintech",
      time: "3 days ago"
    }
  ];

  const policyNews = [
    {
      id: 8,
      title: "Startup India Initiative Launches New Tax Incentive Program",
      description: "Three-year tax holiday extended to qualifying startups with annual turnover under ₹25 crore.",
      impact: "High",
      time: "1 day ago"
    },
    {
      id: 9,
      title: "RBI Announces Simplified KYC Norms for Fintech Startups",
      description: "New guidelines reduce compliance time by 60% for digital-first financial services.",
      impact: "Medium",
      time: "2 days ago"
    },
    {
      id: 10,
      title: "SEBI Proposes Easier IPO Rules for Tech Startups",
      description: "Draft regulations allow startups with dual-class shares to list on Indian exchanges.",
      impact: "High",
      time: "4 days ago"
    }
  ];

  const marketNews = [
    {
      id: 11,
      title: "Indian SaaS Market to Reach $50B by 2030",
      metric: "$50B",
      growth: "+25% CAGR",
      sector: "SaaS",
      time: "1 day ago"
    },
    {
      id: 12,
      title: "E-commerce Penetration Hits 8.8% in Rural India",
      metric: "8.8%",
      growth: "+150% YoY",
      sector: "E-commerce",
      time: "2 days ago"
    },
    {
      id: 13,
      title: "Digital Payments Volume Crosses 100B Transactions",
      metric: "100B+",
      growth: "+50% YoY",
      sector: "Payments",
      time: "3 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Startup News & Updates
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest developments in the Indian startup ecosystem - funding, policy changes, market trends, and more.
          </p>
        </section>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search news..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        {/* Breaking News */}
        <Card className="mb-8 border-red-200 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Badge variant="destructive" className="animate-pulse">Breaking</Badge>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{breakingNews.time}</span>
              </div>
            </div>
            <CardTitle className="text-xl">{breakingNews.title}</CardTitle>
            <CardDescription>{breakingNews.excerpt}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="outline">{breakingNews.category}</Badge>
                <span className="text-sm text-muted-foreground">{breakingNews.source}</span>
              </div>
              <NewsDetail news={breakingNews}>
                <Button size="sm">
                  Read Full Story
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </NewsDetail>
            </div>
          </CardContent>
        </Card>

        {/* Top Stories */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>Top Stories</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {topStories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{story.category}</Badge>
                    <div className="text-2xl">{story.image}</div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{story.title}</CardTitle>
                  <CardDescription>{story.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{story.source}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{story.time}</span>
                    </div>
                  </div>
                  <NewsDetail news={story}>
                    <Button className="w-full" variant="outline">Read More</Button>
                  </NewsDetail>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* News Categories */}
        <Tabs defaultValue="funding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="funding" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Funding</span>
            </TabsTrigger>
            <TabsTrigger value="policy" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Policy</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Market Trends</span>
            </TabsTrigger>
            <TabsTrigger value="ecosystem" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Ecosystem</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="funding" className="space-y-6">
            <h3 className="text-2xl font-bold">Latest Funding News</h3>
            <div className="space-y-4">
              {fundingNews.map((news) => (
                <Card key={news.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{news.title}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-bold text-primary">{news.amount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Round</p>
                            <p className="font-medium">{news.round}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Sector</p>
                            <Badge variant="secondary">{news.sector}</Badge>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Time</p>
                            <p className="text-sm">{news.time}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-muted-foreground text-sm">Investors:</p>
                          <div className="flex space-x-2 mt-1">
                            {news.investors.map((investor) => (
                              <Badge key={investor} variant="outline" className="text-xs">
                                {investor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-4">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="policy" className="space-y-6">
            <h3 className="text-2xl font-bold">Policy & Regulatory Updates</h3>
            <div className="space-y-4">
              {policyNews.map((news) => (
                <Card key={news.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-lg">{news.title}</h4>
                          <Badge variant={news.impact === "High" ? "default" : "secondary"}>
                            {news.impact} Impact
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{news.description}</p>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{news.time}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-4">
                        Read Policy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <h3 className="text-2xl font-bold">Market Trends & Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {marketNews.map((news) => (
                <Card key={news.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{news.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">{news.metric}</div>
                      <p className="text-sm text-green-600 font-medium">{news.growth}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{news.sector}</Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{news.time}</span>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">View Analysis</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ecosystem" className="space-y-6">
            <h3 className="text-2xl font-bold">Ecosystem Updates</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Startup Accelerators Launch New Programs</CardTitle>
                  <CardDescription>5 new accelerator programs announced for early-stage startups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Applications Open</span>
                      <span className="font-medium">Jan 15, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Program Duration</span>
                      <span className="font-medium">3-6 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Funding Range</span>
                      <span className="font-medium">₹10L - ₹50L</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Learn More</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>New Co-working Spaces Open in Tier-2 Cities</CardTitle>
                  <CardDescription>Expansion of startup infrastructure beyond metros</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Cities Covered</span>
                      <span className="font-medium">Indore, Kochi, Jaipur</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Capacity</span>
                      <span className="font-medium">2,500 seats</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Opening Date</span>
                      <span className="font-medium">Q1 2025</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">View Locations</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-primary/10 to-orange-400/10 mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Never Miss Important Startup News</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get daily startup news digest, funding updates, and policy changes delivered to your inbox.
            </p>
            <div className="flex max-w-md mx-auto space-x-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Join 10,000+ founders staying informed
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default News;

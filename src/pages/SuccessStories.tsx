import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import RouteSeo from "@/components/RouteSeo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Building, Award, Globe, ArrowRight, MapPin, Sparkles } from "lucide-react";

const SuccessStories = () => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Success Stories — Xi Combinator",
      description:
        "Discover how Xi Combinator incubated startups are transforming industries and creating impact across the globe in 2026.",
      url: "https://xicombinator.lovable.app/success-stories",
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.text = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const successStories = [
    {
      id: 1,
      name: "HealthTech Pro",
      founder: "Dr. Priya Sharma",
      sector: "HealthTech",
      program: "Incubation",
      cohort: "2024",
      funding: "$4.2M Series A",
      location: "Bangalore, India",
      description:
        "AI-powered diagnostic platform revolutionizing healthcare delivery across underserved markets",
      metrics: { hospitals: "120+", patients: "500K+", accuracy: "96%", cities: "42" },
      achievements: [
        "AI diagnostic suite deployed across 3 state health networks",
        "Partnership with Apollo Hospitals expanded in 2026",
        "Winner of National HealthTech Innovation Award 2026",
      ],
    },
    {
      id: 2,
      name: "EduConnect",
      founder: "Rajesh Kumar",
      sector: "EdTech",
      program: "MVP Lab",
      cohort: "2023",
      funding: "$2.5M Seed",
      location: "Pune, India",
      description:
        "Vernacular learning platform making quality education accessible in local languages",
      metrics: { users: "5M+", languages: "14", courses: "1,200+", completion: "88%" },
      achievements: [
        "Top education app on Google Play Store in 2026",
        "Partnership with 4 State Education Boards",
        "UNESCO EdTech Innovation Recognition",
      ],
    },
    {
      id: 3,
      name: "AgroSmart",
      founder: "Anita Patel",
      sector: "AgriTech",
      program: "Deep Tech Incubation",
      cohort: "2024",
      funding: "$3.8M Series A",
      location: "Hyderabad, India",
      description:
        "IoT-based precision farming solution helping farmers increase crop yield and reduce costs",
      metrics: { farmers: "25,000+", yield: "+34%", water: "-45%", revenue: "$9M" },
      achievements: [
        "Featured in Forbes 30 Under 30 Asia",
        "Government of India Agriculture Innovation Award",
        "Expanded to 8 states in 2026",
      ],
    },
    {
      id: 4,
      name: "FinBridge",
      founder: "Arjun Nair",
      sector: "FinTech",
      program: "Xi Lab",
      cohort: "2025",
      funding: "$5.5M Series A",
      location: "Mumbai, India",
      description:
        "Embedded lending rails bringing instant credit to 2M+ small merchants across tier-2 and tier-3 India",
      metrics: { merchants: "2M+", disbursed: "$120M", default: "<1.5%", partners: "35" },
      achievements: [
        "RBI sandbox graduate in 2025",
        "Fastest Xi Lab company to Series A",
        "Banking partnerships with 3 major PSU banks",
      ],
    },
    {
      id: 5,
      name: "GreenGrid Energy",
      founder: "Meera Krishnan",
      sector: "CleanTech",
      program: "Incubation",
      cohort: "2024",
      funding: "$6.2M Series A",
      location: "Chennai, India",
      description:
        "Distributed solar micro-grids and smart metering for industrial parks and rural clusters",
      metrics: { capacity: "85 MW", sites: "300+", savings: "$14M", co2: "-120K t" },
      achievements: [
        "Largest distributed solar deployment by an Indian startup in 2026",
        "MNRE empanelment secured",
        "National CleanTech Startup of the Year 2026",
      ],
    },
    {
      id: 6,
      name: "LogiChain",
      founder: "Vikram Singh",
      sector: "Logistics",
      program: "Hackathon",
      cohort: "2025",
      funding: "$1.2M Seed",
      location: "Delhi NCR, India",
      description:
        "Born at our 2025 Hackathon — AI route optimization cutting freight costs for mid-market shippers",
      metrics: { shipments: "400K+", savings: "-22%", trucks: "8,000+", cities: "60" },
      achievements: [
        "Hackathon Grand Prize winner to funded startup in 9 months",
        "Onboarded 3 Fortune India 500 shippers",
        "Series A term sheet secured in Q3 2026",
      ],
    },
  ];

  const programStats = [
    { program: "Incubation", startups: 45, funding: "$15M", success: "87%" },
    { program: "MVP Lab", startups: 78, funding: "$10M", success: "82%" },
    { program: "Xi Lab", startups: 32, funding: "$8M", success: "90%" },
    { program: "Hackathon", startups: 25, funding: "$5M", success: "75%" },
  ];

  const overallStats = [
    { label: "Total Startups", value: "180+", sub: "Across all programs", icon: Building },
    { label: "Total Funding", value: "$38M+", sub: "Raised by alumni", icon: TrendingUp },
    { label: "Jobs Created", value: "3,500+", sub: "Direct employment", icon: Users },
    { label: "Global Reach", value: "15+", sub: "Countries served", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background">
      <RouteSeo />
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Breadcrumbs />

        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" /> 2026 Cohort Impact Report
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-6">
            Success Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how our incubated startups are transforming industries and creating impact
            across the globe.
          </p>
        </section>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {overallStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Success Stories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <Card
                key={story.id}
                className="hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{story.program}</Badge>
                    <Badge variant="secondary">{story.cohort} Cohort</Badge>
                  </div>
                  <CardTitle className="text-xl">{story.name}</CardTitle>
                  <CardDescription>
                    Founded by {story.founder} • {story.sector}
                  </CardDescription>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {story.location}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground">{story.description}</p>

                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">{story.funding}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(story.metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-2 bg-muted/5 rounded">
                        <div className="font-bold text-primary">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Key Achievements:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {story.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Award className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Program Performance */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Program Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{stat.program}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-primary">{stat.startups}</div>
                    <p className="text-xs text-muted-foreground">Startups Incubated</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stat.funding}</div>
                    <p className="text-xs text-muted-foreground">Total Funding</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{stat.success}</div>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">$38M+</div>
                <p className="text-muted-foreground">Total funding raised by our startups</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">3,500+</div>
                <p className="text-muted-foreground">Jobs created across all ventures</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">85%</div>
                <p className="text-muted-foreground">Average success rate across programs</p>
              </div>
            </div>
            <div className="pt-4">
              <Link to="/featured-startups">
                <Button size="lg">
                  Explore Featured Startups <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessStories;

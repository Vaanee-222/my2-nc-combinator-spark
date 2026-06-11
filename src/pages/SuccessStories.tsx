
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Building, Award, Globe, Calendar } from "lucide-react";

const SuccessStories = () => {
  const successStories = [
    {
      id: 1,
      name: "HealthTech Pro",
      founder: "Dr. Priya Sharma",
      sector: "HealthTech",
      program: "Incubation",
      cohort: "2023",
      funding: "$1.8M Series A",
      description: "AI-powered diagnostic platform revolutionizing healthcare delivery across rural India",
      metrics: {
        hospitals: "50+",
        patients: "100K+",
        accuracy: "95%",
        cities: "25"
      },
      achievements: [
        "First AI diagnostic tool approved by AIIMS",
        "Partnership with Apollo Hospitals",
        "Winner of HealthTech Innovation Award 2024"
      ],
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "EduConnect",
      founder: "Rajesh Kumar",
      sector: "EdTech",
      program: "MVP Lab",
      cohort: "2022",
      funding: "$1M Seed",
      description: "Vernacular learning platform making quality education accessible in local languages",
      metrics: {
        users: "2M+",
        languages: "12",
        courses: "500+",
        completion: "85%"
      },
      achievements: [
        "Featured in Google Play Store top apps",
        "Partnership with State Education Board",
        "UNESCO EdTech Innovation Recognition"
      ],
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "AgroSmart",
      founder: "Anita Patel",
      sector: "AgriTech",
      program: "Deep Tech Incubation",
      cohort: "2023",
      funding: "$1.5M Series A",
      description: "IoT-based precision farming solution helping farmers increase crop yield and reduce costs",
      metrics: {
        farmers: "10,000+",
        yield: "+30%",
        water: "-40%",
        revenue: "$6M"
      },
      achievements: [
        "Featured in Forbes 30 Under 30",
        "Government of India Agriculture Innovation Award",
        "Partnership with major fertilizer companies"
      ],
      image: "/placeholder.svg"
    }
  ];

  const programStats = [
    { program: "Incubation", startups: 45, funding: "$15M", success: "87%" },
    { program: "MVP Lab", startups: 78, funding: "$10M", success: "82%" },
    { program: "Xi Lab", startups: 32, funding: "$8M", success: "90%" },
    { program: "Hackathon", startups: 25, funding: "$5M", success: "75%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-6">
            Success Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how our incubated startups are transforming industries and creating impact across India and beyond.
          </p>
        </section>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">180+</div>
              <p className="text-xs text-muted-foreground">Across all programs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">$38M+</div>
              <p className="text-xs text-muted-foreground">Raised by alumni</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jobs Created</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">3,500+</div>
              <p className="text-xs text-muted-foreground">Direct employment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global Reach</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">15+</div>
              <p className="text-xs text-muted-foreground">Countries served</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Success Stories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{story.program}</Badge>
                    <Badge variant="secondary">{story.cohort} Cohort</Badge>
                  </div>
                  <CardTitle className="text-xl">{story.name}</CardTitle>
                  <CardDescription>
                    Founded by {story.founder} • {story.sector}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessStories;

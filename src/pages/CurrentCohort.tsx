
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import ApplicationDialog from "@/components/ApplicationDialog";

const CurrentCohort = () => {
  const cohortStartups = [
    {
      id: 1,
      name: "NeoFinance",
      founder: "Rahul Sharma & Team",
      category: "FinTech",
      description: "Digital banking platform for rural India with micro-lending capabilities",
      stage: "MVP",
      funding: "$30K",
      traction: "5,000+ users, $2L MRR",
      location: "Bangalore",
      team: 4,
      status: "Active"
    },
    {
      id: 2,
      name: "GreenEnergy Solutions",
      founder: "Priya Patel & Co-founders",
      category: "CleanTech",
      description: "Solar panel leasing and maintenance platform for residential users",
      stage: "Early Traction",
      funding: "$60K",
      traction: "200+ installations, $5L MRR",
      location: "Pune",
      team: 6,
      status: "Active"
    },
    {
      id: 3,
      name: "MedAssist",
      founder: "Dr. Sneha Reddy",
      category: "HealthTech",
      description: "AI-powered diagnosis assistant for rural healthcare centers",
      stage: "Pilot",
      funding: "$30L",
      traction: "50+ clinics, 10K+ consultations",
      location: "Hyderabad",
      team: 8,
      status: "Active"
    },
    {
      id: 4,
      name: "EduTech Pro",
      founder: "Vikash Kumar",
      category: "EdTech",
      description: "Vernacular language skill development platform",
      stage: "MVP",
      funding: "$20L",
      traction: "2,000+ students, 50+ courses",
      location: "Delhi",
      team: 5,
      status: "Active"
    },
    {
      id: 5,
      name: "LogiChain",
      founder: "Arjun Singh & Team",
      category: "Logistics",
      description: "AI-powered supply chain optimization for SMEs",
      stage: "Beta",
      funding: "$40L",
      traction: "100+ businesses, $3L MRR",
      location: "Mumbai",
      team: 7,
      status: "Active"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Header Section */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
                Q1 2024 Cohort
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold">
                Current{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Cohort
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Meet the 10 exceptional startups in our current cohort, working on revolutionary 
                solutions across healthcare, fintech, edtech, and sustainability.
              </p>
            </div>

            {/* Cohort Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <Card className="p-6 text-center bg-card-gradient border-border">
                <div className="text-3xl font-bold text-primary mb-2">10</div>
                <div className="text-muted-foreground">Active Startups</div>
              </Card>
              <Card className="p-6 text-center bg-card-gradient border-border">
                <div className="text-3xl font-bold text-primary mb-2">$385K</div>
                <div className="text-muted-foreground">Total Funding</div>
              </Card>
              <Card className="p-6 text-center bg-card-gradient border-border">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Users Impacted</div>
              </Card>
              <Card className="p-6 text-center bg-card-gradient border-border">
                <div className="text-3xl font-bold text-primary mb-2">$18K</div>
                <div className="text-muted-foreground">Monthly Revenue</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Startups Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {cohortStartups.map((startup) => (
                <Card key={startup.id} className="p-6 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300 group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {startup.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {startup.stage}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {startup.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {startup.founder}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {startup.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Funding:</span>
                        <span className="font-medium text-primary">{startup.funding}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Traction:</span>
                        <span className="font-medium">{startup.traction}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {startup.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {startup.team} members
                        </div>
                      </div>
                    </div>

                    <Link to={`/startup-profile/${startup.id}`}>
                      <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary/10">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* Application CTA */}
            <Card className="p-8 md:p-12 bg-card-gradient border-border text-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to Join the{" "}
                  <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                    Next Cohort?
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Applications for Q2 2024 cohort are now open. Join the next batch of 
                  revolutionary startups transforming India.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <ApplicationDialog program="Q2 2024 Cohort">
                    <Button variant="hero" size="lg">
                      Apply for Next Cohort
                    </Button>
                  </ApplicationDialog>
                  <Link to="/program-details">
                    <Button variant="outline" size="lg">
                      Program Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CurrentCohort;

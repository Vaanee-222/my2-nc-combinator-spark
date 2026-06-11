
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const WeeklyShowcase = () => {
  const featuredStartups = [
    {
      id: 1,
      name: "AgriTech Solutions",
      category: "Agriculture",
      description: "AI-powered crop monitoring system helping farmers increase yield by 40%",
      stage: "Seed",
      funding: "$250K raised",
      impact: "50,000+ farmers impacted",
    },
    {
      id: 2,
      name: "HealthBridge",
      category: "Healthcare",
      description: "Telemedicine platform connecting rural patients with urban specialists",
      stage: "Series A",
      funding: "$1.8M raised",
      impact: "1M+ consultations",
    },
    {
      id: 3,
      name: "EduTech Pro",
      category: "Education",
      description: "Vernacular language learning platform for skill development",
      stage: "Pre-seed",
      funding: "$60K raised",
      impact: "200K+ students",
    },
  ];

  return (
    <section className="py-20 bg-muted/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            This Week's{" "}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              Top Startups
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the most promising Indian startups across various disciplines, 
            making real impact and solving mass problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredStartups.map((startup) => (
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
                  <p className="text-muted-foreground text-sm">
                    {startup.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Funding:</span>
                    <span className="font-medium text-primary">{startup.funding}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impact:</span>
                    <span className="font-medium">{startup.impact}</span>
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

        <div className="text-center">
          <Link to="/featured-startups">
            <Button variant="outline" size="lg">
              View All Featured Startups
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WeeklyShowcase;

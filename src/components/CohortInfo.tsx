
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import ApplicationDialog from "@/components/ApplicationDialog";

const CohortInfo = () => {
  const currentCohort = {
    name: "Q1 2024 Cohort",
    status: "Applications Open",
    deadline: "March 15, 2024",
    startDate: "April 1, 2024",
    spotsAvailable: 8,
    totalSpots: 10
  };

  const top10Startups = [
    {
      id: 1,
      name: "NeoFinance",
      founder: "Rahul Sharma",
      category: "FinTech",
      description: "Digital banking for rural India",
      status: "Selected"
    },
    {
      id: 2,
      name: "GreenEnergy Solutions",
      founder: "Priya Patel",
      category: "CleanTech",
      description: "Solar panel leasing platform",
      status: "Selected"
    },
    {
      id: 3,
      name: "LogiChain",
      founder: "Arjun Singh",
      category: "Logistics",
      description: "AI-powered supply chain optimization",
      status: "Under Review"
    },
    {
      id: 4,
      name: "MedAssist",
      founder: "Dr. Sneha Reddy",
      category: "HealthTech",
      description: "AI diagnosis assistant for rural clinics",
      status: "Selected"
    },
    {
      id: 5,
      name: "SkillBridge",
      founder: "Vikash Kumar",
      category: "EdTech",
      description: "Vocational training in vernacular languages",
      status: "Under Review"
    },
  ];

  return (
    <section className="py-20 bg-muted/5">
      <div className="container mx-auto px-4">
        {/* Current Cohort Status */}
        <Card className="p-8 mb-16 bg-card-gradient border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {currentCohort.status}
                  </Badge>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  {currentCohort.name}
                </h2>
                <p className="text-muted-foreground text-lg">
                  Join India's most ambitious startup accelerator program. 
                  Transform your crazy idea into a scalable business.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Application Deadline</div>
                  <div className="font-semibold text-primary">{currentCohort.deadline}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Program Starts</div>
                  <div className="font-semibold">{currentCohort.startDate}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Spots Available</div>
                  <div className="font-semibold text-primary">{currentCohort.spotsAvailable}/{currentCohort.totalSpots}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-semibold">3 Months</div>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-right space-y-4">
              <div className="space-y-3">
                <div className="text-4xl font-bold text-primary">$60K</div>
                <div className="text-muted-foreground">Investment + Credits</div>
              </div>
              <ApplicationDialog program="Q1 2024 Cohort">
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Apply to Current Cohort
                </Button>
              </ApplicationDialog>
            </div>
          </div>
        </Card>

        {/* Monthly Top 10 Selected Startups */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Monthly{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                Top 10 Selected
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From hundreds of applications, these startups made it to our monthly selection. 
              Top 5 will advance to the quarterly cohort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {top10Startups.map((startup, index) => (
              <Card key={index} className="p-6 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                      #{index + 1}
                    </Badge>
                    <Badge 
                      variant={startup.status === "Selected" ? "default" : "secondary"}
                      className={startup.status === "Selected" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}
                    >
                      {startup.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {startup.name}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      by {startup.founder}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {startup.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {startup.description}
                  </p>

                  <Link to={`/startup-profile/${startup.id}`}>
                    <Button variant="ghost" className="w-full text-sm group-hover:bg-primary/10">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center pt-8">
            <Link to="/all-applications">
              <Button variant="outline" size="lg">
                View All Applications
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CohortInfo;

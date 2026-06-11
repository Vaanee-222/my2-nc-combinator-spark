
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import ApplicationDialog from "@/components/ApplicationDialog";

const ProgramOverview = () => {
  const programs = [
    {
      title: "MVP Lab",
      description: "Complete product development support with cloud credits, mentorship, and funding opportunities",
      features: [
        "$12K AWS & GCP Credits",
        "1:1 Technical Mentorship",
        "Product-Market Fit Validation",
        "Go-to-Market Strategy"
      ],
      duration: "3 months",
      investment: "$30K for 8% equity"
    },
    {
      title: "Incubation Program",
      description: "Intensive 6-month program for scalable startups with proven traction",
      features: [
        "Advanced Mentorship Network",
        "Series A Preparation",
        "Corporate Partnerships",
        "International Expansion"
      ],
      duration: "6 months",
      investment: "$125K for 12% equity"
    },
    {
      title: "Hackathon Winners Track",
      description: "Fast-track program for hackathon winners with innovative solutions",
      features: [
        "Rapid Prototyping Support",
        "Tech Team Building",
        "IP Protection Guidance",
        "Demo Day Preparation"
      ],
      duration: "2 months",
      investment: "$5L for 5% equity"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Our{" "}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              Programs
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From idea validation to scaling - we provide comprehensive support 
            for every stage of your startup journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {programs.map((program, index) => (
            <Card key={index} className="p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300 relative group">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {program.title}
                    </h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {program.duration}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {program.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">What you get:</h4>
                  <ul className="space-y-2">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-center space-y-3">
                    <div className="text-lg font-semibold text-primary">
                      {program.investment}
                    </div>
                    <ApplicationDialog program={program.title}>
                      <Button variant="hero" className="w-full">
                        Apply Now
                      </Button>
                    </ApplicationDialog>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Philosophy Section */}
        <Card className="p-8 md:p-12 bg-card-gradient border-border">
          <div className="text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">
              "Focus on{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                PMP & Idea Validation
              </span>
              "
            </h3>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We believe in the power of <strong>Product-Market-Problem fit</strong> and rigorous 
              <strong> customer traction validation</strong>. You focus on solving real problems 
              with substantial impact - we'll handle all the tech and MVP development. Our philosophy 
              is simple: great ideas need great execution support.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
              <Link to="/philosophy">
                <Button variant="outline" size="lg">
                  Learn About Our Philosophy
                </Button>
              </Link>
              <ApplicationDialog program="Xi Combinator">
                <Button variant="hero" size="lg">
                  Start Your Application
                </Button>
              </ApplicationDialog>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ProgramOverview;

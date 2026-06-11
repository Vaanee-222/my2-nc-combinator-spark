
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, Users, Lightbulb } from "lucide-react";
import ApplicationDialog from "@/components/ApplicationDialog";

const Philosophy = () => {
  const principles = [
    {
      icon: Target,
      title: "Product-Market-Problem Fit",
      description: "We believe in rigorous validation of real problems with substantial market impact. Every solution must address a genuine pain point affecting masses."
    },
    {
      icon: Users,
      title: "Customer Traction Validation",
      description: "Proven customer engagement and early traction indicators are crucial. We focus on startups that have demonstrated initial market validation."
    },
    {
      icon: Lightbulb,
      title: "Idea + Execution Support",
      description: "Great ideas need great execution support. We handle the technical MVP development while founders focus on market fit and customer development."
    },
    {
      icon: CheckCircle,
      title: "Scalable Impact",
      description: "We're looking for solutions that can scale to impact millions while remaining sustainable and profitable in the Indian context."
    }
  ];

  const methodology = [
    {
      phase: "Discovery",
      duration: "Week 1-2",
      activities: ["Problem validation workshops", "Market research deep-dive", "Customer interview sessions", "Competitive analysis"]
    },
    {
      phase: "Validation",
      duration: "Week 3-4",
      activities: ["MVP requirement gathering", "User journey mapping", "Technical feasibility study", "Go-to-market strategy"]
    },
    {
      phase: "Development",
      duration: "Week 5-8",
      activities: ["MVP development with our tech team", "Regular founder check-ins", "User testing and feedback", "Iteration and refinement"]
    },
    {
      phase: "Launch",
      duration: "Week 9-12",
      activities: ["Product launch support", "Marketing and PR assistance", "Investor pitch preparation", "Scaling strategy development"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
                Our Philosophy
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold">
                Focus on{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  PMP & Idea Validation
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                We believe in the power of <strong>Product-Market-Problem fit</strong> and rigorous 
                <strong> customer traction validation</strong>. You focus on solving real problems 
                with substantial impact - we'll handle all the tech and MVP development.
              </p>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Our Core Principles</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These fundamental beliefs guide every decision we make and every startup we support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {principles.map((principle, index) => (
                <Card key={index} className="p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <principle.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{principle.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Methodology */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Our 12-Week Methodology</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A structured approach to transform your idea into a market-ready product.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {methodology.map((phase, index) => (
                <Card key={index} className="p-6 bg-card-gradient border-border relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{phase.phase}</h3>
                      <Badge variant="outline" className="text-xs">
                        {phase.duration}
                      </Badge>
                    </div>
                    
                    <ul className="space-y-2">
                      {phase.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Philosophy in Action</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how our philosophy has helped startups achieve remarkable results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="p-8 bg-card-gradient border-border text-center">
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-primary">87%</div>
                  <div className="text-lg font-semibold">Product-Market Fit</div>
                  <div className="text-muted-foreground text-sm">
                    of our startups achieve strong PMF within 6 months
                  </div>
                </div>
              </Card>
              
              <Card className="p-8 bg-card-gradient border-border text-center">
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-primary">3.2x</div>
                  <div className="text-lg font-semibold">Faster MVP</div>
                  <div className="text-muted-foreground text-sm">
                    development compared to traditional approaches
                  </div>
                </div>
              </Card>
              
              <Card className="p-8 bg-card-gradient border-border text-center">
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-primary">$500Cr+</div>
                  <div className="text-lg font-semibold">Value Created</div>
                  <div className="text-muted-foreground text-sm">
                    total valuation of startups following our methodology
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <Card className="p-8 md:p-12 bg-card-gradient border-border text-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to Experience{" "}
                  <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                    Our Philosophy?
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join hundreds of founders who have transformed their ideas into successful 
                  businesses with our proven methodology.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <ApplicationDialog program="Philosophy Program">
                    <Button variant="hero" size="lg">
                      Start Your Application
                    </Button>
                  </ApplicationDialog>
                  <Button variant="outline" size="lg">
                    Schedule a Call
                  </Button>
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

export default Philosophy;

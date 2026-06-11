import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, ArrowDown } from "lucide-react";
import InclabApplicationDialog from "@/components/InclabApplicationDialog";
import { Link } from "react-router-dom";

const INCLab = () => {
  const applicationProcess = [
    {
      step: "1",
      title: "Submit Application", 
      description: "Complete our comprehensive application form",
      timeline: "5 minutes",
      requirements: [
        "Startup details & pitch deck",
        "Team information",
        "Market analysis",
        "2-minute video pitch"
      ]
    },
    {
      step: "2",
      title: "Initial Review",
      description: "Our team evaluates applications",
      timeline: "1-2 weeks",
      requirements: [
        "Market potential assessment",
        "Team strength evaluation", 
        "Scalability analysis",
        "Innovation factor review"
      ]
    },
    {
      step: "3",
      title: "Interview Round",
      description: "Deep-dive discussion with founders",
      timeline: "1 week",
      requirements: [
        "Technical feasibility review",
        "Business model validation",
        "Founder-market fit assessment",
        "Growth strategy discussion"
      ]
    },
    {
      step: "4",
      title: "Final Selection",
      description: "Welcome to Xi Combinator family",
      timeline: "1-2 weeks",
      requirements: [
        "Legal documentation",
        "Program onboarding",
        "Mentor assignment",
        "Resource allocation"
      ]
    }
  ];

  const currentCohort = [
    {
      name: "FinFlow",
      founder: "Aditi Sharma",
      category: "FinTech",
      description: "Digital lending platform for MSMEs",
      stage: "Seed",
      traction: "$50L monthly GMV"
    },
    {
      name: "AgriSmart",
      founder: "Rajesh Patel",
      category: "AgriTech",
      description: "IoT-based crop monitoring system",
      stage: "Pre-Seed",
      traction: "1000+ farmers onboarded"
    },
    {
      name: "EduBridge",
      founder: "Priya Singh",
      category: "EdTech",
      description: "Skill-based learning platform",
      stage: "Seed",
      traction: "50K+ active learners"
    },
    {
      name: "HealthLink",
      founder: "Dr. Arjun Kumar",
      category: "HealthTech",
      description: "Telemedicine for rural areas",
      stage: "Pre-Seed",
      traction: "10K+ consultations"
    },
    {
      name: "LogiTech Pro",
      founder: "Vikash Gupta",
      category: "Logistics",
      description: "Last-mile delivery optimization",
      stage: "Seed",
      traction: "100+ enterprise clients"
    },
    {
      name: "GreenEnergy",
      founder: "Sneha Reddy",
      category: "CleanTech",
      description: "Solar financing platform",
      stage: "Pre-Seed",
      traction: "$10Cr+ facilitated loans"
    }
  ];

  const benefits = [
    {
      title: "Direct Funding Access",
      description: "$25L to $5Cr investment based on program track",
      icon: ""
    },
    {
      title: "Technical Development",
      description: "Complete MVP/product development by our tech team",
      icon: ""
    },
    {
      title: "Cloud Credits",
      description: "$25L+ in AWS, GCP, and Azure credits",
      icon: ""
    },
    {
      title: "Mentor Network",
      description: "Access to 200+ successful entrepreneurs and VCs",
      icon: ""
    },
    {
      title: "Market Access",
      description: "Corporate partnerships and customer introductions",
      icon: ""
    },
    {
      title: "Legal Support",
      description: "Complete legal, compliance, and IP protection",
      icon: ""
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
                 Apply. Build. Scale.
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Xi Lab:{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Your Gateway
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                The exclusive application portal for India's most ambitious startup accelerator. 
                Where crazy founders transform impossible ideas into scalable solutions.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-4 flex-wrap">
              <InclabApplicationDialog
                title="Apply to Xi Lab"
              >
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Start Application
                </Button>
              </InclabApplicationDialog>
              <Link to="/requirements">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  View Requirements
                </Button>
              </Link>
              <Link to="/monthly-top-10">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Monthly Top 10
                </Button>
              </Link>
              <Link to="/quarterly-top-5">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Quarterly Top 5
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 max-w-5xl mx-auto">
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">2000+</div>
                  <div className="text-muted-foreground">Applications Received</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">3%</div>
                  <div className="text-muted-foreground">Acceptance Rate</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">$500Cr+</div>
                  <div className="text-muted-foreground">Alumni Valuation</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">15</div>
                  <div className="text-muted-foreground">Cohort Size</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Application Status */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-8 mb-16 bg-card-gradient border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-primary" />
                    <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                      Applications Open
                    </Badge>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Q2 2024 Cohort Applications
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Apply now for our most selective cohort. Only 15 startups 
                    will be chosen from thousands of applications.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Application Deadline</div>
                    <div className="font-semibold text-primary">April 30, 2024</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Program Starts</div>
                    <div className="font-semibold">June 1, 2024</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-semibold">6 Months</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Investment</div>
                    <div className="font-semibold text-primary">$25L - $5Cr</div>
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-right space-y-4">
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-primary">15</div>
                  <div className="text-muted-foreground">Spots Available</div>
                </div>
                <InclabApplicationDialog
                  title="Apply to Xi Lab"
                >
                  <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                    Apply Now
                  </Button>
                </InclabApplicationDialog>
                <p className="text-sm text-muted-foreground">
                  Application takes ~5 minutes
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Current Cohort */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Current{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                Cohort Startups
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the exceptional startups in our current accelerator program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {currentCohort.map((startup, index) => (
              <Card key={index} className="p-6 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300 group">
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
                    <div className="text-sm text-muted-foreground">
                      Founded by {startup.founder}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {startup.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Traction: </span>
                      <span className="font-medium text-primary">{startup.traction}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Join these exceptional founders in building India's next unicorns
            </p>
            <InclabApplicationDialog
              title="Apply to Next Cohort"
            >
              <Button variant="hero" size="lg">
                Apply for Next Cohort
              </Button>
            </InclabApplicationDialog>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Application Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From application to acceptance in 4 structured steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
            {applicationProcess.map((process, index) => (
              <Card key={index} className="p-6 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                      {process.step}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                      {process.timeline}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{process.title}</h3>
                    <p className="text-muted-foreground text-sm">{process.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Focus:</h4>
                    <ul className="space-y-1">
                      {process.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="text-xs text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {index < applicationProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowDown className="w-6 h-6 text-primary rotate-90" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              What You{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                Get
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive support to transform your startup into a market leader
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300 text-center">
                <div className="space-y-4">
                  <div className="text-4xl">{benefit.icon}</div>
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center pt-16">
            <Card className="p-8 bg-card-gradient border-border inline-block">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">
                  Total Value:{" "}
                  <span className="text-primary">$1Cr+ per startup</span>
                </h3>
                <p className="text-muted-foreground">
                  Investment, credits, mentorship, and resources combined
                </p>
                <InclabApplicationDialog
                  title="Start Your Xi Lab Application"
                >
                  <Button variant="hero" size="lg" className="mt-4">
                    Start Your Application
                  </Button>
                </InclabApplicationDialog>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default INCLab;

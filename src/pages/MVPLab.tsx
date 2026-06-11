import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import IncubationApplicationForm from "@/components/IncubationApplicationForm";
import ConsultationDialog from "@/components/ConsultationDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const MVPLab = () => {
  const services = [
    {
      title: "MVP Development", 
      description: "Complete product development from concept to launch",
      features: [
        "Full-stack development team",
        "Mobile & web applications",
        "API & backend infrastructure", 
        "UI/UX design & prototyping"
      ],
      timeline: "6-12 weeks"
    },
    {
      title: "Cloud Infrastructure",
      description: "Enterprise-grade cloud setup and optimization",
      features: [
        "$10L+ AWS credits",
        "$8L+ GCP credits", 
        "Azure startup credits",
        "DevOps & deployment setup"
      ],
      timeline: "2-4 weeks"
    },
    {
      title: "Technical Mentorship",
      description: "1:1 guidance from senior tech leaders",
      features: [
        "Weekly tech reviews",
        "Architecture planning",
        "Code quality assurance",
        "Scalability optimization"
      ],
      timeline: "Ongoing"
    }
  ];

  const grants = [
    {
      name: "Ratan Tata Innovation Grant",
      amount: "$50L",
      criteria: "Social impact startups",
      application: "Quarterly"
    },
    {
      name: "Women Entrepreneur Grant", 
      amount: "$25L",
      criteria: "Women-led startups",
      application: "Bi-annual"
    },
    {
      name: "Rural Innovation Grant",
      amount: "$30L", 
      criteria: "Rural market solutions",
      application: "Annual"
    },
    {
      name: "Deep Tech Grant",
      amount: "$1Cr",
      criteria: "AI/ML/Blockchain startups",
      application: "Annual"
    }
  ];

  const cloudPartners = [
    {
      name: "Amazon Web Services",
      credits: "$10L+",
      benefits: "Startup credits, technical support, training"
    },
    {
      name: "Google Cloud Platform",
      credits: "$8L+", 
      benefits: "AI/ML credits, startup program, mentorship"
    },
    {
      name: "Microsoft Azure",
      credits: "$6L+",
      benefits: "Startup credits, BizSpark program, support"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs />
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
                 Build. Test. Scale.
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                MVP Lab:{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Idea to Product
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Focus on customer validation & business strategy. We'll handle all the 
                technical development, cloud infrastructure, and MVP creation for you.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-4">
              <IncubationApplicationForm>
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Join MVP Lab
                </Button>
              </IncubationApplicationForm>
              <Link to="/success-stories">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  View Success Stories
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 max-w-5xl mx-auto">
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-muted-foreground">MVPs Built</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">$100Cr+</div>
                  <div className="text-muted-foreground">Cloud Credits Given</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">85%</div>
                  <div className="text-muted-foreground">Market Success Rate</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">12 weeks</div>
                  <div className="text-muted-foreground">Avg. Build Time</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              What We{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                Build For You
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete technical development while you focus on customers and market validation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {service.timeline}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Includes:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud Credits */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Cloud Credits & Infrastructure</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access enterprise-grade cloud infrastructure without the cost
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {cloudPartners.map((partner, index) => (
              <Card key={index} className="p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300 text-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{partner.name}</h3>
                  <div className="text-3xl font-bold text-primary">{partner.credits}</div>
                  <p className="text-muted-foreground text-sm">{partner.benefits}</p>
                  <Link to="/cloud-credits">
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 bg-card-gradient border-border text-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">
                Total Value:{" "}
                <span className="text-primary">$25L+ in Cloud Credits</span>
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every MVP Lab participant gets access to enterprise cloud infrastructure 
                worth lakhs of rupees, completely free for the first year.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Grants & Funding */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Grants &{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                Funding Support
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multiple grant opportunities to fuel your startup journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {grants.map((grant, index) => (
              <Card key={index} className="p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{grant.name}</h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {grant.application}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-primary">{grant.amount}</div>
                  <p className="text-muted-foreground">{grant.criteria}</p>
                  <Link to="/grants-funding">
                    <Button variant="outline" className="w-full">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <Card className="p-12 bg-card-gradient border-border text-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Our{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Philosophy
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                "You focus on <strong>PMP (Product-Market-Problem) fit</strong> and 
                <strong> customer traction validation</strong>. We'll handle all the technical 
                complexity, infrastructure setup, and MVP development. Great ideas deserve 
                great execution support - and that's exactly what MVP Lab provides."
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
                <IncubationApplicationForm>
                  <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                    Join MVP Lab Today
                  </Button>
                </IncubationApplicationForm>
                <ConsultationDialog>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    Schedule a Consultation
                  </Button>
                </ConsultationDialog>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">What exactly does MVP Lab provide?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  MVP Lab provides complete technical development services including full-stack development, mobile apps, cloud infrastructure setup, UI/UX design, and ongoing technical mentorship. You focus on customers and market validation while we build your product.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">How much equity do you take?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  MVP Lab investment starts at $25L for 8% equity, which includes all development, cloud credits, mentorship, and ongoing support. This is significantly lower than traditional development costs while providing much more value.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">What stage should my startup be at?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  MVP Lab is perfect for early-stage startups with validated ideas who need technical execution. You should have clear problem-solution fit and some initial customer research but need help building the actual product.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">How long does it take to build an MVP?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Typically 6-12 weeks depending on complexity. We follow agile development with weekly demos and continuous feedback to ensure we're building exactly what your customers need.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MVPLab;

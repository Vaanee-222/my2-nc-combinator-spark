
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, Server, Database, Shield, Zap, CheckCircle } from "lucide-react";

const CloudCredits = () => {
  const cloudProviders = [
    {
      name: "Amazon Web Services (AWS)",
      logo: "",
      credits: "$10,00,000",
      duration: "12 months",
      benefits: [
        "AWS Activate Program benefits",
        "24/7 technical support",
        "Training credits worth $50,000",
        "Architecture review sessions",
        "Startup webinar series access"
      ],
      services: ["EC2", "S3", "RDS", "Lambda", "CloudFront", "SES"],
      eligibility: "Early-stage startups in MVP Lab or Incubation program"
    },
    {
      name: "Google Cloud Platform (GCP)",
      logo: "",
      credits: "$8,00,000",
      duration: "12 months",
      benefits: [
        "Google for Startups program",
        "AI/ML platform credits",
        "Firebase hosting credits",
        "Technical account manager",
        "Google Workspace credits"
      ],
      services: ["Compute Engine", "Cloud Storage", "BigQuery", "AI Platform", "Firebase"],
      eligibility: "Tech startups with scalable solutions"
    },
    {
      name: "Microsoft Azure",
      logo: "",
      credits: "$6,00,000",
      duration: "12 months",
      benefits: [
        "Azure for Startups program",
        "Microsoft 365 Business Premium",
        "GitHub Enterprise access",
        "Technical mentorship",
        "Co-selling opportunities"
      ],
      services: ["Virtual Machines", "App Service", "SQL Database", "Cognitive Services"],
      eligibility: "B2B startups and enterprise solutions"
    }
  ];

  const additionalTools = [
    {
      category: "Development Tools",
      tools: [
        { name: "GitHub Enterprise", value: "$2,00,000", description: "Advanced code collaboration" },
        { name: "JetBrains Suite", value: "$1,50,000", description: "Professional IDE licenses" },
        { name: "Docker Pro", value: "$1,00,000", description: "Container management platform" }
      ]
    },
    {
      category: "Monitoring & Analytics",
      tools: [
        { name: "New Relic", value: "$3,00,000", description: "Application performance monitoring" },
        { name: "DataDog", value: "$2,50,000", description: "Infrastructure monitoring" },
        { name: "Mixpanel", value: "$1,50,000", description: "Product analytics platform" }
      ]
    },
    {
      category: "Security & Compliance",
      tools: [
        { name: "Cloudflare", value: "$2,00,000", description: "Web security and performance" },
        { name: "Auth0", value: "$1,50,000", description: "Identity management platform" },
        { name: "Snyk", value: "$1,00,000", description: "Security vulnerability scanning" }
      ]
    }
  ];

  const usageGuidelines = [
    {
      icon: <Server className="h-6 w-6 text-primary" />,
      title: "Infrastructure Setup",
      description: "Use credits for servers, databases, and core infrastructure components"
    },
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "Data Storage",
      description: "Scalable storage solutions for your application data and user content"
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Security Services",
      description: "Implement enterprise-grade security and compliance features"
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Performance Optimization",
      description: "CDN, caching, and performance monitoring tools"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-6">
            Cloud Credits & Infrastructure
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Access enterprise-grade cloud infrastructure worth $25L+ completely free. 
            Build, scale, and deploy your startup without infrastructure costs.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
               $25L+ Value
            </Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
               12 Months Free
            </Badge>
          </div>
        </section>

        {/* Total Value Card */}
        <Card className="mb-16 bg-gradient-to-r from-primary/10 to-orange-400/10 border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Total Infrastructure Value</CardTitle>
            <div className="text-5xl font-bold text-primary mt-4">$25,00,000+</div>
            <CardDescription className="text-lg mt-2">
              Complete cloud infrastructure package for every MVP Lab participant
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Cloud Providers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Cloud Platform Credits</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {cloudProviders.map((provider, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{provider.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <div className="text-2xl font-bold text-primary">{provider.credits}</div>
                    </div>
                  </div>
                  <Badge variant="outline">{provider.duration}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Program Benefits:</h4>
                    <div className="space-y-1">
                      {provider.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Key Services:</h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.services.map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      <strong>Eligibility:</strong> {provider.eligibility}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Additional Tools */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Additional Development Tools</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {additionalTools.map((category, index) => (
              <Card key={index} className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.tools.map((tool, idx) => (
                      <div key={idx} className="p-3 bg-muted/5 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{tool.name}</h4>
                          <Badge variant="outline" className="text-xs">{tool.value}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How to Use Your Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usageGuidelines.map((guideline, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {guideline.icon}
                  </div>
                  <CardTitle className="text-lg">{guideline.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{guideline.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <Card className="bg-card-gradient border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">How to Access Cloud Credits</CardTitle>
              <CardDescription>Simple process to get started with your infrastructure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    1
                  </div>
                  <h3 className="font-semibold">Join MVP Lab</h3>
                  <p className="text-sm text-muted-foreground">Get accepted into our MVP Lab program</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    2
                  </div>
                  <h3 className="font-semibold">Technical Assessment</h3>
                  <p className="text-sm text-muted-foreground">Brief technical review of your infrastructure needs</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    3
                  </div>
                  <h3 className="font-semibold">Credits Activation</h3>
                  <p className="text-sm text-muted-foreground">We activate all your cloud platform credits</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    4
                  </div>
                  <h3 className="font-semibold">Start Building</h3>
                  <p className="text-sm text-muted-foreground">Begin using enterprise infrastructure immediately</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Build on Enterprise Infrastructure?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join MVP Lab today and get instant access to $25L+ worth of cloud credits and development tools.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
              Join MVP Lab
            </Button>
            <Button variant="outline" size="lg">
              Schedule Consultation
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CloudCredits;

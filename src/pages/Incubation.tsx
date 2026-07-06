import Navigation from "@/components/Navigation";
import IncubationApplicationForm from "@/components/IncubationApplicationForm";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ConsultationDialog from "@/components/ConsultationDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users, TrendingUp, Lightbulb, Target, Award, Building } from "lucide-react";
import { Link } from "react-router-dom";

const Incubation = () => {
  const programs = [
    {
      id: 1,
      name: "Early Stage Incubation",
      duration: "6 months",
      stage: "Idea to MVP",
      description: "Perfect for early-stage startups looking to validate their idea and build their first product.",
      benefits: ["Seed funding up to $30K", "Weekly mentorship", "Product development support", "Market validation"],
      nextCohort: "March 2026",
      applications: "Open"
    },
    {
      id: 2,
      name: "Growth Acceleration",
      duration: "12 months",
      stage: "MVP to Scale",
      description: "For startups with proven traction ready to scale their business and expand market reach.",
      benefits: ["Growth funding up to $125K", "Go-to-market strategy", "Investor connections", "International expansion"],
      nextCohort: "April 2026",
      applications: "Open"
    },
    {
      id: 3,
      name: "Deep Tech Incubation",
      duration: "18 months",
      stage: "R&D to Market",
      description: "Specialized program for deep tech startups working on breakthrough technologies.",
      benefits: ["R&D funding up to $250K", "Technical mentorship", "Lab facilities", "Patent support"],
      nextCohort: "May 2026",
      applications: "Coming Soon"
    }
  ];

  const success_stories = [
    {
      name: "HealthTech Pro",
      sector: "HealthTech",
      funding: "$1.8M Series A",
      description: "AI-powered diagnostic platform serving 50+ hospitals across India",
      year: "2023 Cohort"
    },
    {
      name: "EduConnect",
      sector: "EdTech",
      funding: "$1M Seed",
      description: "Vernacular learning platform with 2M+ active users",
      year: "2022 Cohort"
    },
    {
      name: "AgroSmart",
      sector: "AgriTech",
      funding: "$1.5M Series A",
      description: "IoT-based precision farming solution for 10,000+ farmers",
      year: "2023 Cohort"
    }
  ];

  const incubation_benefits = [
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Funding Support",
      description: "Seed funding from $30K to $250K based on program and milestones"
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Expert Mentorship",
      description: "1-on-1 guidance from successful entrepreneurs and industry experts"
    },
    {
      icon: <Building className="h-6 w-6 text-primary" />,
      title: "Infrastructure",
      description: "Office space, lab facilities, and access to technical resources"
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Market Access",
      description: "Customer introductions, pilot opportunities, and partnership facilitation"
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Legal & Compliance",
      description: "Legal support, IP protection, and regulatory guidance"
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      title: "Product Development",
      description: "Technical support, design resources, and product strategy guidance"
    }
  ];

  const application_process = [
    {
      step: "01",
      title: "Application Submission",
      description: "Submit detailed application with business plan and pitch deck",
      timeline: "Week 1"
    },
    {
      step: "02",
      title: "Initial Screening",
      description: "Our team reviews applications and shortlists candidates",
      timeline: "Week 2-3"
    },
    {
      step: "03",
      title: "Interview Round",
      description: "Video interviews with founders and technical evaluation",
      timeline: "Week 4"
    },
    {
      step: "04",
      title: "Final Pitch",
      description: "Present your startup to our investment committee",
      timeline: "Week 5"
    },
    {
      step: "05",
      title: "Selection & Onboarding",
      description: "Successful startups are welcomed into the program",
      timeline: "Week 6"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-6">
            Startup Incubation Program
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Transform your innovative idea into a thriving business. Join our comprehensive incubation program 
            designed to accelerate your startup journey from concept to market success.
          </p>
          <div className="flex justify-center space-x-4">
            <IncubationApplicationForm>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Apply for Incubation
              </Button>
            </IncubationApplicationForm>
            <Link to="/program-details">
              <Button variant="outline" size="lg">
                Program Details
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Startups Incubated</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">150+</div>
              <p className="text-xs text-muted-foreground">Across all cohorts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">$30M</div>
              <p className="text-xs text-muted-foreground">Raised by alumni</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">85%</div>
              <p className="text-xs text-muted-foreground">Still operating</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jobs Created</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">2,500+</div>
              <p className="text-xs text-muted-foreground">Direct employment</p>
            </CardContent>
          </Card>
        </div>

        {/* Incubation Programs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Incubation Programs</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card key={program.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={program.applications === "Open" ? "default" : "secondary"}>
                      {program.applications}
                    </Badge>
                    <div className="text-2xl"></div>
                  </div>
                  <CardTitle className="text-xl">{program.name}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{program.duration}</span>
                    </span>
                    <Badge variant="outline" className="text-xs">{program.stage}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{program.description}</p>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Key Benefits:</p>
                    <div className="space-y-1">
                      {program.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p><strong>Next Cohort:</strong> {program.nextCohort}</p>
                  </div>

                  <div className="pt-4 space-y-2">
                    {program.applications === "Open" ? (
                      <IncubationApplicationForm>
                        <Button className="w-full">
                          Apply Now
                        </Button>
                      </IncubationApplicationForm>
                    ) : (
                      <Button className="w-full" disabled>
                        Applications Opening Soon
                      </Button>
                    )}
                    <Link to="/program-details">
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incubation_benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {benefit.icon}
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {success_stories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{story.name}</CardTitle>
                    <Badge variant="outline">{story.year}</Badge>
                  </div>
                  <CardDescription className="font-medium text-primary">
                    {story.sector}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{story.description}</p>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">{story.funding}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Application Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {application_process.map((step, index) => (
                <Card key={index} className="hover:shadow-md transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground mb-2">{step.description}</p>
                        <Badge variant="outline">{step.timeline}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Startup?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our comprehensive incubation program and transform your startup with expert guidance, 
            funding support, and access to a thriving ecosystem of entrepreneurs and investors.
          </p>
          <div className="flex justify-center space-x-4">
            <IncubationApplicationForm>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Apply Now
              </Button>
            </IncubationApplicationForm>
            <ConsultationDialog>
              <Button variant="outline" size="lg">
                Schedule Consultation
              </Button>
            </ConsultationDialog>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Incubation;


import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users, TrendingUp, Target, Award, BookOpen, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import ApplicationDialog from "@/components/ApplicationDialog";

const ProgramDetails = () => {
  const programs = [
    {
      id: "hackathon",
      name: "Hackathon Program",
      description: "48-hour coding sprints to build innovative solutions",
      duration: "2-3 Days",
      participants: "500+ per event",
      frequency: "Monthly",
      features: [
        "Expert mentorship during the event",
        "Industry-relevant problem statements",
        "Networking with peers and professionals",
        "Prize pool up to $12,000",
        "Opportunity to showcase solutions",
        "Potential for startup incubation"
      ],
      benefits: [
        "Build your portfolio with real projects",
        "Learn new technologies rapidly",
        "Network with industry experts",
        "Win prizes and recognition",
        "Fast-track to incubation programs"
      ],
      eligibility: [
        "Students and professionals",
        "Basic programming knowledge",
        "Team of 2-4 members",
        "Passion for innovation"
      ],
      icon: ""
    },
    {
      id: "incubation",
      name: "Incubation Program",
      description: "6-month intensive program to build and scale your startup",
      duration: "6 Months",
      participants: "15-20 startups",
      frequency: "Quarterly",
      features: [
        "Dedicated workspace and resources",
        "1:1 mentorship from industry experts",
        "Access to funding networks",
        "Legal and compliance support",
        "Product development guidance",
        "Market validation assistance"
      ],
      benefits: [
        "$6,000–$60,000 potential funding",
        "Expert guidance and mentorship",
        "Access to co-working spaces",
        "Legal and financial support",
        "Market validation and user feedback",
        "Investor network access"
      ],
      eligibility: [
        "Early-stage startups",
        "Scalable business model",
        "Committed founding team",
        "Clear market opportunity"
      ],
      icon: ""
    },
    {
      id: "mvp-lab",
      name: "MVP Lab",
      description: "Rapid prototyping and MVP development program",
      duration: "8 Weeks",
      participants: "20-30 teams",
      frequency: "Bi-monthly",
      features: [
        "Idea validation workshops",
        "Rapid prototyping tools",
        "User testing and feedback",
        "Technical architecture guidance",
        "Market research support",
        "Pitch preparation training"
      ],
      benefits: [
        "Build your MVP in 8 weeks",
        "Validate your idea with real users",
        "Learn lean startup methodology",
        "Technical and business mentorship",
        "Pathway to full incubation"
      ],
      eligibility: [
        "Early-stage ideas",
        "Technical or business background",
        "Commitment to 8-week program",
        "Clear problem-solution fit"
      ],
      icon: ""
    },
    {
      id: "inc-lab",
      name: "Xi Lab",
      description: "Research and development for innovative solutions",
      duration: "3-12 Months",
      participants: "10-15 projects",
      frequency: "Ongoing",
      features: [
        "Research and development support",
        "Access to advanced technologies",
        "Collaboration with academic institutions",
        "Patent and IP support",
        "Technical infrastructure",
        "Publication opportunities"
      ],
      benefits: [
        "Access to cutting-edge research",
        "Technical infrastructure and tools",
        "Collaboration with researchers",
        "IP and patent support",
        "Potential for commercialization"
      ],
      eligibility: [
        "Technical innovation focus",
        "Research or technical background",
        "Novel technology or approach",
        "Potential for commercialization"
      ],
      icon: ""
    }
  ];

  const applicationProcess = [
    {
      step: 1,
      title: "Submit Application",
      description: "Fill out the online application form with your idea and team details"
    },
    {
      step: 2,
      title: "Initial Screening",
      description: "Our team reviews your application and conducts initial evaluation"
    },
    {
      step: 3,
      title: "Interview Round",
      description: "Selected candidates participate in a detailed interview process"
    },
    {
      step: 4,
      title: "Final Selection",
      description: "Final selection and program onboarding with mentorship assignment"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Program{" "}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              Details
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive overview of all our programs designed to accelerate your startup journey. 
            Choose the program that best fits your current stage and goals.
          </p>
        </div>

        {/* Programs Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {programs.map((program) => (
            <Card key={program.id} className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{program.icon}</div>
                  <div>
                    <CardTitle className="text-xl">{program.name}</CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-medium">{program.duration}</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-medium">{program.participants}</p>
                    <p className="text-xs text-muted-foreground">Participants</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-medium">{program.frequency}</p>
                    <p className="text-xs text-muted-foreground">Frequency</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    Key Features
                  </h4>
                  <div className="space-y-2">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-primary" />
                    Benefits
                  </h4>
                  <div className="space-y-2">
                    {program.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Eligibility */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    Eligibility
                  </h4>
                  <div className="space-y-2">
                    {program.eligibility.map((criteria, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{criteria}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <ApplicationDialog program={program.name} title={`Apply to ${program.name}`} description={`Start your application for ${program.name}`}>
                    <Button className="flex-1 bg-gradient-to-r from-primary to-orange-400">
                      Apply Now
                    </Button>
                  </ApplicationDialog>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to={`/${program.id.replace('-', '')}`}>
                      Learn More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Process */}
        <Card className="bg-card-gradient border-border mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Application Process</CardTitle>
            <CardDescription className="text-center">
              Follow these simple steps to apply for any of our programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {applicationProcess.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-card-gradient border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Can I apply to multiple programs?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Yes, you can apply to multiple programs. However, we recommend focusing on the program that best fits your current stage.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What is the selection criteria?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  We evaluate applications based on innovation, market potential, team strength, and execution capability.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Is there any application fee?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  No, all our programs are free to apply. We believe in supporting innovation without financial barriers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What happens after selection?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Selected participants receive onboarding materials, mentor assignments, and detailed program schedule.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramDetails;

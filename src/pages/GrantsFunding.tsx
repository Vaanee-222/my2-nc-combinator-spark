
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Award, Target, Calendar, CheckCircle, Coins, Landmark, HandCoins, Trophy, ArrowRight } from "lucide-react";
import ApplicationDialog from "@/components/ApplicationDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const GrantsFunding = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const grants = [
    {
      id: 1,
      name: "Global Innovation Grant",
      amount: "$600,000",
      type: "Innovation Grant",
      focus: "Social Impact & Innovation",
      deadline: "March 31, 2026",
      status: "Open",
      eligibility: [
        "Startups working on social impact solutions",
        "Revenue less than $1.2M",
        "Team of 2-10 members",
        "Innovative technology solution"
      ],
      benefits: [
        "Non-dilutive funding",
        "Mentorship from industry experts",
        "Marketing and PR support",
        "Access to corporate partnerships"
      ],
      applicationProcess: "Quarterly",
      sectors: ["HealthTech", "EdTech", "AgriTech", "CleanTech"]
    },
    {
      id: 2,
      name: "Women Founders Grant",
      amount: "$300,000",
      type: "Diversity Grant",
      focus: "Women-led Startups",
      deadline: "June 15, 2026",
      status: "Open",
      eligibility: [
        "At least 51% women ownership",
        "Women founder/co-founder",
        "Early to growth stage startup",
        "Scalable business model"
      ],
      benefits: [
        "Equity-free funding",
        "Women leadership mentorship",
        "Networking opportunities",
        "Business development support"
      ],
      applicationProcess: "Bi-annual",
      sectors: ["Technology", "Healthcare", "Education", "E-commerce"]
    },
    {
      id: 3,
      name: "Emerging Markets Grant",
      amount: "$360,000",
      type: "Impact Grant",
      focus: "Emerging-Market Solutions",
      deadline: "September 30, 2026",
      status: "Open",
      eligibility: [
        "Solutions for emerging markets",
        "Direct community impact",
        "Sustainable business model",
        "Local team presence"
      ],
      benefits: [
        "Grant funding",
        "Emerging-market access",
        "Government liaison support",
        "Distribution network access"
      ],
      applicationProcess: "Annual",
      sectors: ["Agriculture", "Healthcare", "Education", "Financial Services"]
    },
    {
      id: 4,
      name: "Deep Tech Innovation Grant",
      amount: "$1,200,000",
      type: "Technology Grant",
      focus: "AI / ML / Blockchain / IoT",
      deadline: "December 31, 2026",
      status: "Open",
      eligibility: [
        "Deep technology focus",
        "IP or patent potential",
        "Experienced technical team",
        "Clear commercialization path"
      ],
      benefits: [
        "Substantial R&D funding",
        "Technical mentorship",
        "Lab facility access",
        "Patent filing support"
      ],
      applicationProcess: "Annual",
      sectors: ["AI/ML", "Blockchain", "IoT", "Robotics"]
    }
  ];

  const successStories = [
    {
      company: "GreenTech Solutions",
      grant: "Emerging Markets Grant",
      amount: "$360K",
      impact: "Helped 50,000+ farmers increase crop yield by 40%",
      currentValuation: "$3M"
    },
    {
      company: "HealthForAll",
      grant: "Global Innovation Grant",
      amount: "$600K",
      impact: "Providing healthcare to 100+ remote villages",
      currentValuation: "$4.8M"
    },
    {
      company: "EduWomen",
      grant: "Women Founders Grant",
      amount: "$300K",
      impact: "Trained 10,000+ women in digital skills",
      currentValuation: "$1.8M"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Application Submitted!",
      description: "Your grant application has been submitted successfully. We'll review it and get back to you within 15 business days.",
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-6">
            Grants & Funding Support
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Access non-dilutive funding opportunities designed to accelerate your startup journey. 
            Multiple grant programs supporting innovation across sectors.
          </p>
          <div className="flex justify-center flex-wrap gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-base px-4 py-2 inline-flex items-center gap-2">
              <Coins className="h-4 w-4" /> $2.4M+ Available
            </Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-base px-4 py-2 inline-flex items-center gap-2">
              <Target className="h-4 w-4" /> Multiple Programs
            </Badge>
          </div>
        </section>

        {/* Video Introduction */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-primary/10 to-orange-400/10 border-border overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Grant Program Overview</CardTitle>
              <CardDescription>Learn about our funding opportunities and application process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/RFN47c9HZAc"
                  title="Grant Program Overview"
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                A comprehensive guide to grant programs, eligibility criteria, and the application process.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Available Grants */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Available Grant Programs</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {grants.map((grant) => (
              <Card key={grant.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={grant.status === "Open" ? "default" : "secondary"}>
                      {grant.status}
                    </Badge>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <HandCoins className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{grant.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary mb-2">{grant.amount}</div>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="outline">{grant.type}</Badge>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {grant.deadline}</span>
                      </span>
                    </div>
                    <p className="font-medium">{grant.focus}</p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Eligibility Criteria:</h4>
                    <div className="space-y-1">
                      {grant.eligibility.map((criteria, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{criteria}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Program Benefits:</h4>
                    <div className="space-y-1">
                      {grant.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Award className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Focus Sectors:</h4>
                    <div className="flex flex-wrap gap-1">
                      {grant.sectors.map((sector, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-3">
                      <strong>Application Cycle:</strong> {grant.applicationProcess}
                    </p>
                    <ApplicationDialog program={`Grant: ${grant.name}`}>
                      <Button className="w-full" disabled={grant.status !== "Open"}>
                        {grant.status === "Open" ? "Apply Now" : "Applications Closed"}
                      </Button>
                    </ApplicationDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Grant Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{story.company}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline" className="mb-2">{story.grant}</Badge>
                    <div className="font-medium text-primary">{story.amount} Grant Received</div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{story.impact}</p>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">Current Valuation: {story.currentValuation}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card-gradient border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Grant Application Form</CardTitle>
                <CardDescription>Apply for multiple grant programs with a single application</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Startup Name*</label>
                      <Input placeholder="Enter your startup name" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Founder Name*</label>
                      <Input placeholder="Enter founder name" required />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Email*</label>
                    <Input type="email" placeholder="founder@startup.com" required />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Grant Program*</label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grant program" />
                      </SelectTrigger>
                      <SelectContent>
                        {grants.map((grant) => (
                          <SelectItem key={grant.id} value={grant.id.toString()}>
                            {grant.name} - {grant.amount}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Sector*</label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthtech">HealthTech</SelectItem>
                        <SelectItem value="edtech">EdTech</SelectItem>
                        <SelectItem value="fintech">FinTech</SelectItem>
                        <SelectItem value="agritech">AgriTech</SelectItem>
                        <SelectItem value="cleantech">CleanTech</SelectItem>
                        <SelectItem value="ai-ml">AI/ML</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Current Stage*</label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select current stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idea">Idea Stage</SelectItem>
                        <SelectItem value="mvp">MVP Stage</SelectItem>
                        <SelectItem value="early-revenue">Early Revenue</SelectItem>
                        <SelectItem value="growth">Growth Stage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Description*</label>
                    <Textarea 
                      placeholder="Briefly describe your business, the problem you're solving, and your solution..." 
                      className="min-h-[100px]"
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Social Impact*</label>
                    <Textarea 
                      placeholder="Describe the social impact of your solution and how it benefits society..." 
                      className="min-h-[100px]"
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Funding Usage Plan*</label>
                    <Textarea 
                      placeholder="Explain how you plan to use the grant funding..." 
                      className="min-h-[100px]"
                      required 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Grant Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Application Process</h2>
          <Card className="bg-card-gradient border-border">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    1
                  </div>
                  <h3 className="font-semibold">Submit Application</h3>
                  <p className="text-sm text-muted-foreground">Complete online application with required documents</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    2
                  </div>
                  <h3 className="font-semibold">Initial Review</h3>
                  <p className="text-sm text-muted-foreground">Our team reviews applications for eligibility (5-7 days)</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    3
                  </div>
                  <h3 className="font-semibold">Due Diligence</h3>
                  <p className="text-sm text-muted-foreground">Detailed evaluation and background verification</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    4
                  </div>
                  <h3 className="font-semibold">Final Presentation</h3>
                  <p className="text-sm text-muted-foreground">Present to grant committee (selected applicants)</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    5
                  </div>
                  <h3 className="font-semibold">Grant Award</h3>
                  <p className="text-sm text-muted-foreground">Funding disbursement and program onboarding</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Fund Your Innovation?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't let funding be a barrier to your startup success. Apply for our grant programs
            and get the non-dilutive funding you need to scale your impact.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <ApplicationDialog program="Grants & Funding">
              <Button size="lg" variant="hero">
                Apply for Grants <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </ApplicationDialog>
            <Button variant="outline" size="lg" asChild>
              <a href="/consultation-booking">Schedule Consultation</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GrantsFunding;

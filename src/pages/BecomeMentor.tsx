
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Target, Award, Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const BecomeMentor = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mentorBenefits = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Impact Next Generation",
      description: "Guide and shape the future of entrepreneurship by mentoring promising startups"
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Strategic Network",
      description: "Connect with like-minded professionals and expand your business network"
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Recognition",
      description: "Get recognized as a thought leader in your industry and domain expertise"
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Flexible Schedule",
      description: "Mentor on your own schedule with flexible time commitment options"
    }
  ];

  const expertiseAreas = [
    "Technology & Engineering",
    "Product Management",
    "Marketing & Sales",
    "Finance & Fundraising",
    "Operations & Strategy",
    "Human Resources",
    "Legal & Compliance",
    "Design & User Experience",
    "Business Development",
    "Industry Specific Knowledge"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Application Submitted!",
      description: "Thank you for your interest in becoming a mentor. We'll review your application and get back to you within 5 business days.",
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
            Become a Mentor
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Share your expertise and help shape the next generation of entrepreneurs. 
            Join our mentor network and make a lasting impact on innovative startups.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
               Make an Impact
            </Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
               Shape the Future
            </Badge>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Become a Mentor?</h2>
              <div className="space-y-6">
                {mentorBenefits.map((benefit, index) => (
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
            </div>

            {/* Mentor Requirements */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Mentor Requirements</CardTitle>
                <CardDescription>What we look for in our mentors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "5+ years of industry experience",
                    "Leadership or senior management role",
                    "Track record of business success",
                    "Passion for helping entrepreneurs",
                    "Available for 2-4 hours per month",
                    "Strong communication skills"
                  ].map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card className="bg-gradient-to-r from-primary/5 to-orange-400/5 border-border">
              <CardHeader>
                <CardTitle>What Our Mentors Say</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm italic mb-2">
                      "Mentoring startups has been incredibly rewarding. Seeing young entrepreneurs 
                      turn their ideas into successful businesses gives me immense satisfaction."
                    </p>
                    <p className="text-xs text-muted-foreground">- Rajesh Kumar, Former CTO at TechCorp</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm italic mb-2">
                      "The mentor network here is exceptional. I've not only helped startups but 
                      also learned so much from fellow mentors and entrepreneurs."
                    </p>
                    <p className="text-xs text-muted-foreground">- Dr. Priya Sharma, Healthcare Industry Expert</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div>
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Mentor Application</CardTitle>
                <CardDescription>Join our mentor network and start making an impact</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">First Name*</label>
                      <Input placeholder="Enter your first name" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Last Name*</label>
                      <Input placeholder="Enter your last name" required />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Email*</label>
                    <Input type="email" placeholder="your.email@company.com" required />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone*</label>
                    <Input type="tel" placeholder="+91 9876543210" required />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Current Position*</label>
                    <Input placeholder="e.g., VP Engineering at TechCorp" required />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Company*</label>
                    <Input placeholder="Your current company" required />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Years of Experience*</label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10-15">10-15 years</SelectItem>
                        <SelectItem value="15-20">15-20 years</SelectItem>
                        <SelectItem value="20+">20+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Area of Expertise*</label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary expertise" />
                      </SelectTrigger>
                      <SelectContent>
                        {expertiseAreas.map((area) => (
                          <SelectItem key={area} value={area.toLowerCase().replace(/\s+/g, '-')}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">LinkedIn Profile*</label>
                    <Input placeholder="https://linkedin.com/in/yourprofile" required />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Why do you want to become a mentor?*</label>
                    <Textarea 
                      placeholder="Tell us about your motivation to mentor startups..." 
                      className="min-h-[100px]"
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Industry Experience</label>
                    <Textarea 
                      placeholder="Describe your industry experience and notable achievements..." 
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Commitment</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="How much time can you commit monthly?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-4">2-4 hours per month</SelectItem>
                        <SelectItem value="4-8">4-8 hours per month</SelectItem>
                        <SelectItem value="8-12">8-12 hours per month</SelectItem>
                        <SelectItem value="12+">12+ hours per month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-orange-400/10 border-border">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    1
                  </div>
                  <h3 className="font-semibold">Application Review</h3>
                  <p className="text-sm text-muted-foreground">We review your application within 5 business days</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    2
                  </div>
                  <h3 className="font-semibold">Interview Process</h3>
                  <p className="text-sm text-muted-foreground">A brief interview to understand your expertise and goals</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    3
                  </div>
                  <h3 className="font-semibold">Onboarding</h3>
                  <p className="text-sm text-muted-foreground">Welcome to the mentor network and startup matching</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeMentor;

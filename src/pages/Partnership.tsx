import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Handshake, Building, Users, Globe, TrendingUp, Award } from "lucide-react";

const Partnership = () => {
  const partnershipTypes = [
    {
      title: "Corporate Innovation",
      icon: Building,
      description: "Partner with startups to drive innovation in your industry",
      benefits: ["Access to cutting-edge solutions", "Fast-track R&D", "Startup pipeline", "Innovation workshops"]
    },
    {
      title: "Venture Partnership",
      icon: TrendingUp,
      description: "Co-invest in promising startups with us",
      benefits: ["Deal flow access", "Due diligence support", "Co-investment opportunities", "Portfolio support"]
    },
    {
      title: "Technology Integration",
      icon: Globe,
      description: "Integrate your platform with our startup ecosystem",
      benefits: ["API partnerships", "White-label solutions", "Technical integration", "Developer support"]
    },
    {
      title: "Mentorship Program",
      icon: Users,
      description: "Share expertise with next-gen entrepreneurs",
      benefits: ["Industry recognition", "Talent pipeline", "Innovation insights", "Networking opportunities"]
    }
  ];

  const currentPartners = [
    { name: "Microsoft", type: "Cloud Partner", logo: "" },
    { name: "AWS", type: "Infrastructure", logo: "" },
    { name: "Google", type: "Technology", logo: "" },
    { name: "HDFC Bank", type: "Financial", logo: "" },
    { name: "TCS", type: "Enterprise", logo: "" },
    { name: "Flipkart", type: "E-commerce", logo: "" }
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
                 Strategic Partnerships
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Partner with{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Innovation
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Join forces with India's most promising startups. Drive innovation, 
                access new markets, and shape the future together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-4xl mx-auto">
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-muted-foreground">Active Partners</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-muted-foreground">Collaborations</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">$100Cr+</div>
                  <div className="text-muted-foreground">Partnership Value</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Partnership Opportunities</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multiple ways to collaborate and create value together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {partnershipTypes.map((type, index) => (
              <Card key={index} className="p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <type.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">{type.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{type.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Benefits:</h4>
                    <ul className="space-y-1">
                      {type.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-muted-foreground text-sm flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                          {benefit}
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

      {/* Current Partners */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Our Partners</h2>
            <p className="text-xl text-muted-foreground">
              Trusted by leading companies across industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {currentPartners.map((partner, index) => (
              <Card key={index} className="p-6 bg-card-gradient border-border text-center hover:shadow-orange-glow transition-all duration-300">
                <div className="space-y-2">
                  <div className="text-3xl">{partner.logo}</div>
                  <h3 className="font-bold text-sm">{partner.name}</h3>
                  <Badge variant="outline" className="text-xs">{partner.type}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Application */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Become a Partner</h2>
              <p className="text-xl text-muted-foreground">
                Let's explore how we can create value together
              </p>
            </div>

            <Card className="p-8 bg-card-gradient border-border">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input id="companyName" placeholder="Your company name" required />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fintech">FinTech</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contactName">Contact Person *</Label>
                    <Input id="contactName" placeholder="Full name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="Business email" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Contact number" />
                  </div>
                  <div>
                    <Label htmlFor="partnershipType">Partnership Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Corporate Innovation</SelectItem>
                        <SelectItem value="venture">Venture Partnership</SelectItem>
                        <SelectItem value="technology">Technology Integration</SelectItem>
                        <SelectItem value="mentorship">Mentorship Program</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyDetails">Company Details *</Label>
                  <Textarea
                    id="companyDetails"
                    placeholder="Brief description of your company, size, and key business areas"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="partnershipGoals">Partnership Goals *</Label>
                  <Textarea
                    id="partnershipGoals"
                    placeholder="What do you hope to achieve through this partnership? What value can you bring?"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Preferred Timeline</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="When would you like to start?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediately</SelectItem>
                      <SelectItem value="1month">Within 1 month</SelectItem>
                      <SelectItem value="3months">Within 3 months</SelectItem>
                      <SelectItem value="6months">Within 6 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="hero" className="flex-1">
                    Submit Partnership Request
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partnership;

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, MessageSquare, Users } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Headquarters",
      details: ["Koramangala, Bangalore", "Karnataka 560034, India"]
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 80 4567 8900", "+91 80 4567 8901"]
    },
    {
      icon: Mail,
      title: "Email",
      details: ["hello@inccombinator.in", "partnerships@inccombinator.in"]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 9 AM - 7 PM", "Saturday: 10 AM - 4 PM"]
    }
  ];

  const offices = [
    {
      city: "Bangalore",
      address: "Koramangala Innovation Hub, 5th Block",
      type: "Headquarters",
      emoji: "🏢"
    },
    {
      city: "Mumbai",
      address: "Bandra Kurla Complex, Financial District",
      type: "Regional Office",
      emoji: "🌆"
    },
    {
      city: "Delhi",
      address: "Connaught Place, Central Delhi",
      type: "Regional Office",
      emoji: "🏛️"
    },
    {
      city: "Hyderabad",
      address: "HITEC City, Cyberabad",
      type: "Tech Hub",
      emoji: "💻"
    }
  ];

  const faqs = [
    {
      question: "How can I apply to Inc Combinator programs?",
      answer: "You can apply through our online application form available on each program page. The process typically takes 2-3 weeks for review."
    },
    {
      question: "What is the acceptance rate?",
      answer: "We maintain a selective acceptance rate of 3-5% to ensure quality and focused mentorship for all admitted startups."
    },
    {
      question: "Do you invest in international startups?",
      answer: "Currently, we focus on Indian startups or international startups targeting the Indian market significantly."
    },
    {
      question: "What support do you provide post-program?",
      answer: "Lifetime access to our network, continued mentorship, follow-on funding opportunities, and alumni community support."
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
                💬 Get in Touch
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Contact{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent animate-glow-pulse">
                  Us
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Have questions? Want to partner? Ready to apply? 
                We're here to help you succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6 bg-card-gradient border-border text-center hover:shadow-orange-glow transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-muted-foreground text-sm">{detail}</p>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Send us a Message</h2>
              <p className="text-xl text-muted-foreground">
                We'll get back to you within 24 hours
              </p>
            </div>

            <Card className="p-8 bg-card-gradient border-border">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="Your first name" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Your last name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="your@email.com" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <Label htmlFor="company">Company/Startup</Label>
                    <Input id="company" placeholder="Company name (optional)" />
                  </div>
                  <div>
                    <Label htmlFor="inquiryType">Inquiry Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="application">Program Application</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="mentorship">Mentorship</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="media">Media & Press</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" placeholder="Brief subject line" required />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="hero" className="flex-1">
                    Send Message
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Our Offices</h2>
            <p className="text-xl text-muted-foreground">
              Find us across major Indian cities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {offices.map((office, index) => (
              <Card key={index} className="p-6 bg-card-gradient border-border text-center hover:shadow-orange-glow transition-all duration-300">
                <div className="space-y-4">
                  <div className="text-4xl">{office.emoji}</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{office.city}</h3>
                    <Badge variant="outline">{office.type}</Badge>
                    <p className="text-muted-foreground text-sm">{office.address}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Get Directions
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Quick Answers</h2>
            <p className="text-xl text-muted-foreground">
              Common questions we receive
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 bg-card-gradient border-border">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center pt-12">
            <p className="text-muted-foreground mb-4">
              Don't see your question? We're here to help!
            </p>
            <Button variant="hero" size="lg">
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
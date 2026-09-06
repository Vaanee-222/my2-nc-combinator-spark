import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Building2, ExternalLink } from "lucide-react";
import ConsultationDialog from "@/components/ConsultationDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  inquiryType: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const setField = (key: keyof typeof emptyForm, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast({ title: "Missing details", description: "Name, email, subject and message are required.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from("contact_messages").insert({
      user_id: auth?.user?.id ?? null,
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone || null,
      subject: [form.inquiryType, form.subject].filter(Boolean).join(" · "),
      message: [form.company ? `Company: ${form.company}` : "", form.message].filter(Boolean).join("\n\n"),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not send message", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Message sent", description: "Our team will get back to you within 24 hours." });
    setForm(emptyForm);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Headquarters",
      details: ["Xi Combinator HQ, 5th Block Koramangala", "Bangalore 560034, Karnataka, India"]
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 80 4567 8900", "+91 80 4567 8901"]
    },
    {
      icon: Mail,
      title: "Email",
      details: ["hello@xicombinator.in", "partnerships@xicombinator.in", "support@xicombinator.in"]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 9:00 AM - 7:00 PM IST", "Saturday: 10:00 AM - 4:00 PM IST"]
    }
  ];

  const offices = [
    {
      city: "Bangalore",
      type: "Headquarters",
      address: "Xi Combinator HQ, 5th Block Koramangala, Bangalore 560034",
      phone: "+91 80 4567 8900",
      email: "hello@xicombinator.in",
      hours: "Mon - Fri: 9:00 AM - 7:00 PM IST",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Koramangala+5th+Block+Bangalore+560034"
    },
    {
      city: "Mumbai",
      type: "Regional Office",
      address: "Bandra Kurla Complex, Bandra East, Mumbai 400051",
      phone: "+91 22 4567 8900",
      email: "mumbai@xicombinator.in",
      hours: "Mon - Fri: 9:30 AM - 6:30 PM IST",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bandra+Kurla+Complex+Mumbai+400051"
    },
    {
      city: "Delhi NCR",
      type: "Regional Office",
      address: "Connaught Place, New Delhi 110001",
      phone: "+91 11 4567 8900",
      email: "delhi@xicombinator.in",
      hours: "Mon - Fri: 9:30 AM - 6:30 PM IST",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Connaught+Place+New+Delhi+110001"
    },
    {
      city: "Hyderabad",
      type: "Tech Hub",
      address: "HITEC City, Madhapur, Hyderabad 500081",
      phone: "+91 40 4567 8900",
      email: "hyderabad@xicombinator.in",
      hours: "Mon - Fri: 9:00 AM - 7:00 PM IST",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=HITEC+City+Madhapur+Hyderabad+500081"
    }
  ];

  const faqs = [
    {
      question: "How can I apply to Xi Combinator programs?",
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Xi Combinator",
    email: "hello@xicombinator.in",
    telephone: "+91 80 4567 8900",
    url: "https://xicombinator.lovable.app/contact",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Xi Combinator HQ, 5th Block Koramangala",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560034",
      addressCountry: "IN",
    },
    openingHours: ["Mo-Fr 09:00-19:00", "Sa 10:00-16:00"],
    sameAs: [
      "https://xicombinator.lovable.app",
      "https://www.linkedin.com/company/xicombinator",
      "https://twitter.com/xicombinator",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact Xi Combinator — Offices, Support & Partnerships</title>
        <meta name="description" content="Get in touch with Xi Combinator. Offices in Bangalore, Mumbai, Delhi, and Hyderabad. Program questions, partnerships, and press inquiries." />
        <link rel="canonical" href="/contact" />
        <meta property="og:title" content="Contact Xi Combinator" />
        <meta property="og:description" content="Offices, support, and partnership contacts for Xi Combinator." />
        <meta property="og:url" content="/contact" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
      </Helmet>
      <Navigation />
      
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
                 Get in Touch
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Contact{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
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
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="Your first name" required value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Your last name" required value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="your@email.com" required value={form.email} onChange={(e) => setField("email", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+1 555 000 1234" value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="company">Company/Startup</Label>
                    <Input id="company" placeholder="Company name (optional)" value={form.company} onChange={(e) => setField("company", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="inquiryType">Inquiry Type *</Label>
                    <Select value={form.inquiryType} onValueChange={(v) => setField("inquiryType", v)}>
                      <SelectTrigger id="inquiryType">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Program Application">Program Application</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Mentorship">Mentorship</SelectItem>
                        <SelectItem value="Investment">Investment</SelectItem>
                        <SelectItem value="Media & Press">Media & Press</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" placeholder="Brief subject line" required value={form.subject} onChange={(e) => setField("subject", e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="hero" className="flex-1" disabled={submitting}>
                    {submitting ? "Sending..." : "Send Message"}
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
              <Card key={index} className="p-6 bg-card-gradient border-border text-left hover:shadow-orange-glow transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="shrink-0">{office.type}</Badge>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{office.city}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{office.address}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 text-primary" />
                        <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">{office.phone}</a>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4 text-primary" />
                        <a href={`mailto:${office.email}`} className="hover:text-primary transition-colors">{office.email}</a>
                      </div>
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary mt-0.5" />
                        <span>{office.hours}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={office.mapsUrl} target="_blank" rel="noopener noreferrer">
                      Get Directions <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </a>
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
            <ConsultationDialog title="Schedule a Call" description="Tell us what to discuss and we'll get back within 24 hours.">
              <Button variant="hero" size="lg">
                Schedule a Call
              </Button>
            </ConsultationDialog>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
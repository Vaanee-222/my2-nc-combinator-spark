import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Globe, Heart, Lightbulb, Linkedin, MapPin, Phone, Mail, Clock, Building2, ExternalLink } from "lucide-react";
import ApplicationDialog from "@/components/ApplicationDialog";
import { Link } from "react-router-dom";
import { type AdvisorTier } from "@/data/advisoryBoard";
import { useAdvisors } from "@/hooks/useAdvisors";

const AboutUs = () => {
  const { data: advisors = [] } = useAdvisors();
  const values = [
    {
      icon: Heart,
      title: "Founder-First Approach",
      description: "We put founders at the center of everything we do, providing personalized support and guidance."
    },
    {
      icon: Lightbulb,
      title: "Innovation & Excellence",
      description: "We foster a culture of innovation while maintaining the highest standards of excellence."
    },
    {
      icon: Users,
      title: "Community Building",
      description: "We believe in the power of community and creating lasting connections between entrepreneurs."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "We aim to create solutions that have a positive impact on a global scale."
    }
  ];

  const tiers: AdvisorTier[] = ["Founding Advisors", "Strategic Advisors", "Regional Partners", "Industry Experts"];

  const stats = [
    { number: "500+", label: "Startups Mentored" },
    { number: "$120M+", label: "Funding Raised" },
    { number: "50+", label: "Global Partners" },
    { number: "30+", label: "Countries" }
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

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Xi Combinator",
    url: "https://xicombinator.lovable.app",
    logo: "https://xicombinator.lovable.app/logo.png",
    email: "hello@xicombinator.in",
    telephone: "+91 80 4567 8900",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Xi Combinator HQ, 5th Block Koramangala",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560034",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.linkedin.com/company/xicombinator",
      "https://twitter.com/xicombinator",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About Xi Combinator — Mission, Team & Offices</title>
        <meta name="description" content="Learn about Xi Combinator's mission, values, advisory board, and office locations across Bangalore, Mumbai, Delhi NCR, and Hyderabad." />
        <link rel="canonical" href="/about" />
        <meta property="og:title" content="About Xi Combinator" />
        <meta property="og:description" content="Mission, team, and office locations for Xi Combinator." />
        <meta property="og:url" content="/about" />
        <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      </Helmet>

      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
                About Xi Combinator
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold">
                Empowering Innovation
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                A global startup accelerator transforming bold ideas into market-ready products
                and scalable businesses — across every continent.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 bg-card-gradient">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <Card className="p-8 bg-card-gradient border-border">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Our Mission</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize entrepreneurship by providing world-class mentorship, 
                    resources, and support to help innovative startups build products that 
                    solve real-world problems and create lasting impact.
                  </p>
                </div>
              </Card>

              <Card className="p-8 bg-card-gradient border-border">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Our Vision</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the leading catalyst for global innovation, fostering a thriving 
                    ecosystem where entrepreneurs can transform their ideas into successful, 
                    globally competitive businesses.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide our work and define our culture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {values.map((value, index) => (
                <Card key={index} className="p-6 bg-card-gradient border-border text-center">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <Badge variant="secondary" className="bg-primary/10 text-primary">Our Locations</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Where to Find Us</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Headquartered in Bangalore with regional offices and a tech hub across India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12">
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

            <div className="max-w-3xl mx-auto">
              <Card className="p-6 bg-card-gradient border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <MapPin className="w-6 h-6 text-primary mx-auto" />
                    <h4 className="font-semibold">Headquarters</h4>
                    <p className="text-sm text-muted-foreground">Xi Combinator HQ, 5th Block Koramangala, Bangalore 560034</p>
                  </div>
                  <div className="space-y-2">
                    <Phone className="w-6 h-6 text-primary mx-auto" />
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-sm text-muted-foreground">+91 80 4567 8900</p>
                  </div>
                  <div className="space-y-2">
                    <Mail className="w-6 h-6 text-primary mx-auto" />
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-sm text-muted-foreground">hello@xicombinator.in</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Advisory Board */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="secondary" className="bg-primary/10 text-primary">Global Network</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Advisory Board</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Operators, investors, and industry experts from across 12+ countries guiding Xi Combinator founders.
              </p>
            </div>

            {tiers.map((tier) => {
              const members = advisors.filter((a) => a.tier === tier);
              if (!members.length) return null;
              return (
                <div key={tier} className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-xl font-semibold">{tier}</h3>
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">{members.length} members</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {members.map((advisor) => (
                      <Card key={advisor.name} className="p-6 bg-card-gradient border-border text-center hover:border-primary/40 transition-colors">
                        <div className="space-y-3">
                          <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                            <Users className="w-8 h-8 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-base font-semibold">{advisor.name}</h4>
                            <p className="text-xs text-primary font-medium">{advisor.role}</p>
                            <p className="text-xs text-muted-foreground">{advisor.company}</p>
                            <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                              <Globe className="h-3 w-3" /> {advisor.country}
                            </p>
                            <p className="text-xs text-muted-foreground italic pt-1">{advisor.description}</p>
                          </div>
                          <a
                            href={advisor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                          >
                            <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                          </a>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Join Our Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="p-8 md:p-12 bg-card-gradient border-border text-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Join Our Mission
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Whether you're a founder with a revolutionary idea or an experienced professional 
                  looking to mentor the next generation, we'd love to have you join our community.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <ApplicationDialog program="Founder Application">
                    <Button variant="hero" size="lg">
                      Apply as Founder
                    </Button>
                  </ApplicationDialog>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/become-mentor">
                      Become a Mentor
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;

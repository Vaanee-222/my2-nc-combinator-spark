
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Globe, Heart, Lightbulb, TrendingUp, Shield } from "lucide-react";
import ApplicationDialog from "@/components/ApplicationDialog";
import { Link } from "react-router-dom";

const AboutUs = () => {
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

  const advisoryBoard = [
    {
      name: "Dr. Priya Nair",
      role: "Former VP Engineering, Google India",
      expertise: "AI/ML, Product Development",
      image: "/placeholder.svg",
      description: "20+ years leading tech teams at scale"
    },
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO, TechFlow Ventures",
      expertise: "Venture Capital, Growth Strategy",
      image: "/placeholder.svg",
      description: "Invested in 50+ successful startups"
    },
    {
      name: "Anitha Reddy",
      role: "Former Director, Microsoft India",
      expertise: "Enterprise Sales, B2B Strategy",
      image: "/placeholder.svg",
      description: "Built enterprise divisions from ground up"
    },
    {
      name: "Vikram Singh",
      role: "Serial Entrepreneur",
      expertise: "Healthcare, FinTech",
      image: "/placeholder.svg",
      description: "3 successful exits, $500M+ value created"
    }
  ];

  const stats = [
    { number: "500+", label: "Startups Mentored" },
    { number: "₹100Cr+", label: "Funding Raised" },
    { number: "50+", label: "Industry Partners" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-background">
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
                Empowering{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Innovation
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                We're India's premier startup accelerator, dedicated to transforming innovative ideas 
                into market-ready products and scalable businesses.
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
                    To be the leading catalyst for innovation in India, fostering a thriving 
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

        {/* Advisory Board */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Advisory Board</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Guidance from industry leaders and experts who shape our strategic direction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {advisoryBoard.map((advisor, index) => (
                <Card key={index} className="p-6 bg-card-gradient border-border text-center">
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{advisor.name}</h3>
                      <p className="text-sm text-primary font-medium">{advisor.role}</p>
                      <p className="text-xs text-muted-foreground">{advisor.expertise}</p>
                      <p className="text-xs text-muted-foreground italic">{advisor.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Join Our Mission */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <Card className="p-8 md:p-12 bg-card-gradient border-border text-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Join Our{" "}
                  <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                    Mission
                  </span>
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

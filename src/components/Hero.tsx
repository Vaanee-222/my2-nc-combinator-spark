import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDown, Rocket, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import ApplicationDialog from "@/components/ApplicationDialog";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Xi Combinator Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background"></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 text-center space-y-8 animate-fade-in pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary">
          <Rocket className="w-4 h-4" />
          Build the improbable. Ship the inevitable.
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            We need{" "}
            <span className="text-primary underline decoration-primary/40 decoration-4 underline-offset-8">
              crazy founders
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Where visionary Indian entrepreneurs transform impossible ideas 
            into scalable solutions for mass problems.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <ApplicationDialog program="Xi Lab">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6 font-semibold">
              Apply to Xi Lab
            </Button>
          </ApplicationDialog>
          <Link to="/current-cohort">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              View Current Cohort
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
          {[
            { icon: Rocket, value: "500+", label: "Startups Accelerated" },
            { icon: TrendingUp, value: "$1000Cr+", label: "Total Funding Raised" },
            { icon: Users, value: "50+", label: "Unicorn Potential" },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
              <div className="text-center space-y-2">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          role="img"
          aria-label="Scroll down to see more"
        >
          <ArrowDown className="w-6 h-6 text-primary/60" aria-hidden="true" />
          <span className="sr-only">Scroll down</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

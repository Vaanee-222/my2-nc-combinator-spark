import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Rocket, Zap, Shield, Users, Briefcase, Globe, BookOpen, Headphones } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Money } from "@/components/Money";

const subscriptionPlans = [
  {
    name: "Starter",
    price: 999,
    period: "/quarter",
    badge: "Popular",
    icon: Rocket,
    description: "Essential support for early-stage startups looking to scale",
    features: [
      "Exclusive Investor Connect (2 intros/month)",
      "Startup Mixers Access (monthly events)",
      "Basic Media Coverage & PR mentions",
      "Community Mentorship Sessions",
      "Technical Support for MVP (5 hrs/month)",
      "GTM Strategy Templates & Guides",
      "Access to Resource Library",
      "Monthly Founder Roundtables",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    price: 1399,
    period: "/quarter",
    badge: "Best Value",
    icon: Zap,
    description: "Accelerated growth with premium investor and media access",
    features: [
      "Exclusive Investor Connect (5 intros/month)",
      "Priority Media Coverage & Featured Articles",
      "VIP Event & Conference Invitations",
      "Startup Mixers Access (unlimited)",
      "Dedicated Mentorship (10 hrs/month)",
      "Technical Support for MVP (15 hrs/month)",
      "GTM Strategy Consulting (1:1 sessions)",
      "Due Diligence Support with Startup Lawyer",
      "Pitch Deck Review & Optimization",
      "Quarterly Investor Readiness Assessment",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: 1499,
    period: "/quarter",
    badge: "Premium",
    icon: Crown,
    description: "Full-spectrum support with dedicated team and legal backing",
    features: [
      "Unlimited Investor Connections & Warm Intros",
      "Dedicated PR & Media Campaign Management",
      "VIP Access to All Events & Conferences",
      "Exclusive Startup Mixers & Founder Retreats",
      "Dedicated CTO/Technical Advisor (20 hrs/month)",
      "Full GTM Execution Support",
      "Complete Due Diligence with Legal Team",
      "Board Advisory & Governance Support",
      "Fundraising Strategy & Term Sheet Review",
      "Priority Deal Flow & Co-investment Access",
      "Custom Market Research Reports",
      "Dedicated Account Manager",
    ],
    highlight: false,
  },
];

const membershipTiers = [
  {
    name: "Founder",
    price: 49,
    period: "/month",
    icon: Users,
    description: "Basic membership for startup founders with community access",
    features: [
      "Founder Community Access",
      "Monthly Webinars & Workshops",
      "Startup Directory Listing",
      "Basic Resource Library",
      "Peer Networking Events",
      "Founder Slack Channel",
    ],
  },
  {
    name: "Scale-Up",
    price: 149,
    period: "/month",
    icon: Briefcase,
    description: "For startups ready to scale with mentorship and investor access",
    features: [
      "Everything in Founder tier",
      "Mentor Matching (2 sessions/month)",
      "Investor Directory Access",
      "Priority Event Registration",
      "Co-founder Matching Priority",
      "Monthly Office Hours with Experts",
      "Pitch Practice Sessions",
    ],
    highlight: true,
  },
  {
    name: "Unicorn",
    price: 299,
    period: "/month",
    icon: Crown,
    description: "Premium membership with full access to the ecosystem",
    features: [
      "Everything in Scale-Up tier",
      "Unlimited Mentor Sessions",
      "Direct Investor Introductions",
      "Featured Startup Spotlight",
      "Board Seat Advisory Access",
      "Exclusive Deal Room Access",
      "White-Glove Onboarding",
      "Custom Partnership Facilitation",
    ],
  },
];

const services = [
  {
    name: "Pitch Deck Design",
    price: "From $500",
    icon: BookOpen,
    description: "Professional pitch deck creation with storytelling and data visualization",
    details: ["10-15 slide deck", "2 revision rounds", "Investor-ready format", "Data visualization"],
  },
  {
    name: "Market Research",
    price: "From $1,200",
    icon: Globe,
    description: "Comprehensive market analysis with competitive landscape and sizing",
    details: ["TAM/SAM/SOM analysis", "Competitor mapping", "Customer persona research", "Industry trend report"],
  },
  {
    name: "Legal Advisory",
    price: "From $800",
    icon: Shield,
    description: "Startup legal support including incorporation and IP protection",
    details: ["Company incorporation", "IP protection guidance", "Term sheet review", "Compliance checklist"],
  },
  {
    name: "Technical Consulting",
    price: "From $1,500",
    icon: Headphones,
    description: "CTO-level technical guidance for architecture and MVP development",
    details: ["Architecture review", "Tech stack advisory", "MVP roadmap", "Security audit"],
  },
];

const Subscription = () => {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number | string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubscribe = (plan: { name: string; price: number | string }) => {
    setSelectedPlan(plan);
    setPaymentOpen(true);
  };

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate demo payment processing
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    setPaymentOpen(false);
    toast({
      title: " Payment Successful (Demo)",
      description: `You've subscribed to the ${selectedPlan?.name} plan. This is a demo transaction — no real charges were made.`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Plans & Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Invest in Your Startup's <span className="text-primary">Growth</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that fits your stage. All plans include access to the Xi Combinator community.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="subscription" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-10 bg-secondary">
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>

            {/* MEMBERSHIP TAB */}
            <TabsContent value="membership">
              <p className="text-center text-muted-foreground mb-8">
                Monthly membership plans exclusively for startup founders.
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {membershipTiers.map((tier) => (
                  <Card
                    key={tier.name}
                    className={`relative border transition-all duration-300 hover:scale-[1.02] ${
                      tier.highlight
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border bg-card"
                    }`}
                  >
                    {tier.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-2">
                      <tier.icon className="h-10 w-10 text-primary mx-auto mb-2" />
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <CardDescription className="text-sm">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="mb-6">
                        <Money usd={tier.price} className="text-4xl font-bold text-foreground" />
                        <span className="text-muted-foreground">{tier.period}</span>
                      </div>
                      <ul className="space-y-2 text-left text-sm">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={tier.highlight ? "default" : "outline"}
                        onClick={() => handleSubscribe({ name: tier.name, price: tier.price })}
                      >
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* SUBSCRIPTION TAB */}
            <TabsContent value="subscription">
              <p className="text-center text-muted-foreground mb-8">
                Quarterly subscription plans for all user types — startups, investors, mentors & co-founders.
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {subscriptionPlans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`relative border transition-all duration-300 hover:scale-[1.02] ${
                      plan.highlight
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className={plan.highlight ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}>
                        {plan.badge}
                      </Badge>
                    </div>
                    <CardHeader className="text-center pb-2">
                      <plan.icon className="h-10 w-10 text-primary mx-auto mb-2" />
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-sm">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="mb-6">
                        <Money usd={plan.price} className="text-5xl font-bold text-foreground" />
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      <ul className="space-y-2 text-left text-sm">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={plan.highlight ? "default" : "outline"}
                        onClick={() => handleSubscribe({ name: plan.name, price: plan.price })}
                      >
                        Subscribe Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* SERVICES TAB */}
            <TabsContent value="services">
              <p className="text-center text-muted-foreground mb-8">
                One-time professional services to accelerate your startup journey.
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {services.map((svc) => (
                  <Card key={svc.name} className="border-border bg-card hover:border-primary/40 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <svc.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{svc.name}</CardTitle>
                          <p className="text-primary font-semibold text-sm">{svc.price}</p>
                        </div>
                      </div>
                      <CardDescription>{svc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1.5 text-sm">
                        {svc.details.map((d) => (
                          <li key={d} className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="text-muted-foreground">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => handleSubscribe({ name: svc.name, price: svc.price })}>
                        Request Quote
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Demo Payment Dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Demo Payment Gateway</DialogTitle>
            <DialogDescription>
              This is a test payment form. No real charges will be made. Pre-filled with demo card details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Test Mode — Use the pre-filled demo card</span>
            </div>
            <div>
              <Label>Plan</Label>
              <p className="font-semibold text-foreground">
                {selectedPlan?.name} — {typeof selectedPlan?.price === "number" ? `$${selectedPlan.price}` : selectedPlan?.price}
              </p>
            </div>
            <div>
              <Label htmlFor="card">Card Number</Label>
              <Input id="card" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="exp">Expiry</Label>
                <Input id="exp" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" value={cvc} onChange={(e) => setCvc(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>Cancel</Button>
            <Button onClick={handlePayment} disabled={processing}>
              {processing ? "Processing..." : "Pay Now (Demo)"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Subscription;

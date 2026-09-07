import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Youtube } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";

const emailSchema = z.string().trim().email({ message: "Enter a valid email address" }).max(255);

const DEFAULTS = {
  contactEmail: "hello@xicombinator.in",
  contactPhone: "+91 80 4567 8900",
  address: "5th Block Koramangala, Bangalore 560034, India",
  footerText:
    "A global startup accelerator and incubator empowering founders across continents to build the next generation of breakout companies.",
};

const Footer = () => {
  const { data: siteSettings } = useSiteSettings();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const contactEmail = siteSettings?.contact_email || DEFAULTS.contactEmail;
  const contactPhone = siteSettings?.contact_phone || DEFAULTS.contactPhone;
  const address = siteSettings?.address || DEFAULTS.address;
  const footerText = siteSettings?.footer_text || DEFAULTS.footerText;

  const socials = [
    { icon: Linkedin, url: siteSettings?.linkedin_url || "https://www.linkedin.com/company/xi-combinator", label: "LinkedIn" },
    { icon: Twitter, url: siteSettings?.twitter_url || "https://twitter.com/xicombinator", label: "Twitter" },
    { icon: Youtube, url: siteSettings?.youtube_url || "https://www.youtube.com/@xicombinator", label: "YouTube" },
    { icon: Instagram, url: "https://www.instagram.com/xicombinator", label: "Instagram" },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast({ title: "Invalid email", description: parsed.error.issues[0]?.message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("newsletter_subscribers" as never)
      .insert({ email: parsed.data.toLowerCase() } as never);
    setSubmitting(false);
    if (error) {
      if ((error as { code?: string }).code === "23505") {
        toast({ title: "Already subscribed", description: "This email is already on the list." });
      } else {
        toast({ title: "Subscription failed", description: "Please try again later.", variant: "destructive" });
      }
      return;
    }
    toast({ title: "Subscribed", description: "You're on the list — watch your inbox." });
    setEmail("");
  };

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              {siteSettings?.site_name || "Xi Combinator"}
            </h3>
            <p className="text-sm text-muted-foreground">{footerText}</p>
            <div className="flex space-x-2">
              {socials.map(({ icon: Icon, url, label }) => (
                <Button key={label} variant="ghost" size="icon" asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              <Link to="/partners" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Partners</Link>
              <Link to="/hackathon" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Hackathons</Link>
              <Link to="/investor-centre" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Investor Centre</Link>
              <Link to="/startup-directory" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Startup Directory</Link>
              <Link to="/success-stories" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Success Stories</Link>
              <Link to="/current-cohort" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Current Cohort</Link>
              <Link to="/news" className="block text-sm text-muted-foreground hover:text-primary transition-colors">News</Link>

              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Programs</h3>
            <div className="space-y-2">
              <Link to="/mvp-lab" className="block text-sm text-muted-foreground hover:text-primary transition-colors">MVP Lab</Link>
              <Link to="/xi-lab" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Xi Lab</Link>
              <Link to="/meet-cofounder" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Meet Co-founder</Link>
              <Link to="/resources" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Resources</Link>
              <Link to="/blogs" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Blogs</Link>
              <Link to="/monthly-top-10" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Monthly Top 10</Link>
              <Link to="/quarterly-top-5" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Quarterly Top 5</Link>
              <Link to="/leaderboard" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Community Leaderboard</Link>
              <Link to="/partnership" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Partnership</Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-2">
              <Link to="/subscription" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Subscription & Plans</Link>
              <Link to="/startup-advisor" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Startup Advisor</Link>
              <Link to="/deals" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Deals & Offers</Link>
              <Link to="/cloud-credits" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Cloud Credits</Link>
              <Link to="/grants-funding" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Grants & Funding</Link>
              <Link to="/consultation-booking" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Book Consultation</Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            </h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-primary transition-colors">{contactEmail}</a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">{contactPhone}</a>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Newsletter email"
                />
                <Button size="sm" type="submit" disabled={submitting}>
                  {submitting ? "..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteSettings?.site_name || "Xi Combinator"}. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

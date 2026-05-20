import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Globe2 } from "lucide-react";

const partnerRegions = [
  {
    region: "India",
    flag: "🇮🇳",
    description: "Headquarters & primary operations",
    partners: [
      { name: "DJ Partners & Consulting", note: "Strategy & advisory" },
      { name: "Bengaluru Innovation Hub", note: "Tech ecosystem" },
      { name: "Mumbai VC Network", note: "Early-stage capital" },
    ],
  },
  {
    region: "Middle East",
    flag: "🇦🇪",
    description: "Dubai & Oman — Gulf expansion",
    partners: [
      { name: "Dubai Future Foundation", note: "Govt. innovation" },
      { name: "Oman Tech Fund", note: "Sovereign investment" },
      { name: "DIFC Innovation Hub", note: "Fintech & scale-ups" },
    ],
  },
  {
    region: "Europe",
    flag: "🇪🇺",
    description: "United Kingdom & Switzerland",
    partners: [
      { name: "London Tech Bridge", note: "UK market entry" },
      { name: "Swiss Startup Association", note: "Deep-tech & R&D" },
      { name: "Zurich Capital Partners", note: "Growth funding" },
    ],
  },
  {
    region: "Asia",
    flag: "🌏",
    description: "Singapore & Hong Kong",
    partners: [
      { name: "Singapore Enterprise Hub", note: "APAC HQ partner" },
      { name: "Hong Kong Cyberport", note: "Tech accelerator" },
      { name: "SEA Founders Network", note: "Regional founders" },
    ],
  },
  {
    region: "North America",
    flag: "🇺🇸",
    description: "USA & Canada",
    partners: [
      { name: "Silicon Valley Connect", note: "Bay Area access" },
      { name: "NYC Venture Alliance", note: "East Coast capital" },
      { name: "Toronto Innovation Council", note: "Canadian ecosystem" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              IC Combinator
            </h3>
            <p className="text-sm text-muted-foreground">
              India's leading startup accelerator and incubator, empowering entrepreneurs to build the next generation of innovative companies.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon"><Facebook className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Twitter className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Instagram className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Linkedin className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              <Link to="/partnership" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Partners</Link>
              <Link to="/hackathon" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Hackathons</Link>
              <Link to="/investor-centre" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Investor Centre</Link>
              <Link to="/startup-directory" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Startup Directory</Link>
              <Link to="/news" className="block text-sm text-muted-foreground hover:text-primary transition-colors">News</Link>
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Programs</h3>
            <div className="space-y-2">
              <Link to="/mvp-lab" className="block text-sm text-muted-foreground hover:text-primary transition-colors">MVP Lab</Link>
              <Link to="/inclab" className="block text-sm text-muted-foreground hover:text-primary transition-colors">INC Lab</Link>
              <Link to="/meet-cofounder" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Meet Co-founder</Link>
              <Link to="/resources" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Resources</Link>
              <Link to="/blogs" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Blogs</Link>
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
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Bangalore, Karnataka, India</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@iccombinator.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Newsletter</h4>
              <div className="flex space-x-2">
                <Input placeholder="Your email" className="flex-1" />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Global Partners Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Our Global Partners
                </h3>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                A trusted network of strategic partners, accelerators, and investors across five regions — helping our founders go global from day one.
              </p>
            </div>
            <Link
              to="/partnership"
              className="text-sm font-medium text-primary hover:underline self-start md:self-auto"
            >
              Become a Partner →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {partnerRegions.map((r) => (
              <div
                key={r.region}
                className="rounded-xl border border-border/60 bg-background/40 p-4 hover:border-primary/40 hover:bg-background/70 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg" aria-hidden>{r.flag}</span>
                  <h4 className="text-sm font-semibold">{r.region}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{r.description}</p>
                <ul className="space-y-2">
                  {r.partners.map((p) => (
                    <li key={p.name} className="text-xs">
                      <div className="font-medium text-foreground/90">{p.name}</div>
                      <div className="text-muted-foreground">{p.note}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 IC Combinator. All rights reserved.
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

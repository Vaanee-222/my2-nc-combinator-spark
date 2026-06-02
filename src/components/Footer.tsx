import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              Xi Combinator
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
              <Link to="/partners" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Partners</Link>
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
              <Link to="/inclab" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Xi Lab</Link>
              <Link to="/meet-cofounder" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Meet Co-founder</Link>
              <Link to="/resources" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Resources</Link>
              <Link to="/blogs" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Blogs</Link>
              <Link to="/monthly-top-10" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Monthly Top 10</Link>
              <Link to="/quarterly-top-5" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Quarterly Top 5</Link>
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
                <span>hello@xicombinator.com</span>
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

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 Xi Combinator. All rights reserved.
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

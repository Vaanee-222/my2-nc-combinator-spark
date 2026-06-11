
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, User, Briefcase, DollarSign, Target, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InvestorSettings = () => {
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Investor profile has been successfully updated.",
    });
  };

  const handleInvestmentPreferences = () => {
    toast({
      title: "Preferences Updated",
      description: "Investment preferences have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="investor-name">Investor/Firm Name</Label>
              <Input id="investor-name" defaultValue="Sarah Investment Capital" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact Person</Label>
              <Input id="contact-name" defaultValue="Sarah Johnson" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="sarah@sarahinvestments.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+91 9876543210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">About</Label>
              <Textarea id="bio" placeholder="Tell us about your investment focus..." />
            </div>
            <Button onClick={handleSaveProfile} className="w-full">
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Investment Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Investment Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="check-size">Check Size Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Min ($)" />
                <Input placeholder="Max ($)" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Preferred Sectors</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">FinTech</Badge>
                <Badge variant="secondary">HealthTech</Badge>
                <Badge variant="secondary">EdTech</Badge>
                <Badge variant="outline">+ Add More</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Investment Stages</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Seed</Badge>
                <Badge variant="default">Series A</Badge>
                <Badge variant="secondary">Series B</Badge>
                <Badge variant="outline">+ Add More</Badge>
              </div>
            </div>
            <Button onClick={handleInvestmentPreferences} className="w-full">
              Update Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="deal-alerts">New Deal Alerts</Label>
              <Switch id="deal-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="portfolio-updates">Portfolio Updates</Label>
              <Switch id="portfolio-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="market-insights">Market Insights</Label>
              <Switch id="market-insights" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-digest">Weekly Email Digest</Label>
              <Switch id="email-digest" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Account Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="flex items-center space-x-2">
                <Badge variant="default">Verified Investor</Badge>
                <Badge variant="secondary">Premium</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Download Investment History
            </Button>
            <Button variant="outline" className="w-full">
              Manage Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorSettings;

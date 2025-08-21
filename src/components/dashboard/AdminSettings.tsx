
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, User, Shield, Database, Mail, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Admin profile has been successfully updated.",
    });
  };

  const handleNotificationChange = (type: string, enabled: boolean) => {
    toast({
      title: "Notification Settings",
      description: `${type} notifications ${enabled ? 'enabled' : 'disabled'}.`,
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
              <span>Profile Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Admin User" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@inccombinator.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="System Administrator" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" placeholder="Enter admin bio..." />
            </div>
            <Button onClick={handleSaveProfile} className="w-full">
              Save Profile
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
              <Label htmlFor="email-notif">Email Notifications</Label>
              <Switch 
                id="email-notif" 
                onCheckedChange={(checked) => handleNotificationChange("Email", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="startup-notif">New Startup Applications</Label>
              <Switch 
                id="startup-notif" 
                defaultChecked
                onCheckedChange={(checked) => handleNotificationChange("Startup Application", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="investor-notif">Investor Activities</Label>
              <Switch 
                id="investor-notif" 
                defaultChecked
                onCheckedChange={(checked) => handleNotificationChange("Investor Activity", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="system-notif">System Alerts</Label>
              <Switch 
                id="system-notif" 
                defaultChecked
                onCheckedChange={(checked) => handleNotificationChange("System Alert", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security & Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Permissions</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Full Admin Access</Badge>
                <Badge variant="secondary">User Management</Badge>
                <Badge variant="secondary">Content Management</Badge>
                <Badge variant="secondary">System Settings</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Manage API Keys
            </Button>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>System Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance">Maintenance Mode</Label>
              <Switch id="maintenance" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="registration">Open Registration</Label>
              <Switch id="registration" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">Analytics Tracking</Label>
              <Switch id="analytics" defaultChecked />
            </div>
            <Button variant="outline" className="w-full">
              Export System Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;

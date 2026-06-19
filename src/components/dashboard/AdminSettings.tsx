import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, User, Shield, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/authErrors";
import { logAudit } from "@/lib/audit";

const AdminSettings = () => {
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,email,bio").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      setFullName(data?.full_name || "");
      setEmail(data?.email || user.email || "");
      setBio(data?.bio || "");
    });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, email, bio }).eq("user_id", user.id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    logAudit({ action: "update", table: "profiles", recordId: user.id, details: { self: true } });
    toast({ title: "Profile saved" });
  };

  const changePassword = async () => {
    if (newPwd.length < 6) return toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
    if (newPwd !== confirmPwd) return toast({ title: "Passwords don't match", variant: "destructive" });
    setPwdSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setPwdSaving(false);
    if (error) return toast({ title: "Couldn't change password", description: friendlyAuthError(error), variant: "destructive" });
    logAudit({ action: "password_change", table: "auth.users", recordId: user?.id });
    toast({ title: "Password updated" });
    setPwdOpen(false);
    setNewPwd("");
    setConfirmPwd("");
  };

  const handleNotificationChange = (type: string, enabled: boolean) => {
    toast({ title: "Notification settings", description: `${type} notifications ${enabled ? "enabled" : "disabled"}.` });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><User className="h-5 w-5" /><span>Profile</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-2"><Label>Role</Label><Input value={userRole || "—"} disabled /></div>
            <div className="space-y-2"><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} /></div>
            <Button onClick={saveProfile} disabled={saving} className="w-full">{saving ? "Saving..." : "Save Profile"}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Bell className="h-5 w-5" /><span>Notifications</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><Label>Email notifications</Label><Switch onCheckedChange={(c) => handleNotificationChange("Email", c)} /></div>
            <div className="flex items-center justify-between"><Label>New startup applications</Label><Switch defaultChecked onCheckedChange={(c) => handleNotificationChange("Startup application", c)} /></div>
            <div className="flex items-center justify-between"><Label>Investor activities</Label><Switch defaultChecked onCheckedChange={(c) => handleNotificationChange("Investor activity", c)} /></div>
            <div className="flex items-center justify-between"><Label>System alerts</Label><Switch defaultChecked onCheckedChange={(c) => handleNotificationChange("System alert", c)} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Shield className="h-5 w-5" /><span>Security & Access</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current permissions</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">{userRole === "admin" ? "Full Admin Access" : "Limited Access"}</Badge>
                <Badge variant="secondary">User Management</Badge>
                <Badge variant="secondary">Content Management</Badge>
                <Badge variant="secondary">System Settings</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setPwdOpen(true)}>Change Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Database className="h-5 w-5" /><span>System Configuration</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><Label>Maintenance mode</Label><Switch /></div>
            <div className="flex items-center justify-between"><Label>Open registration</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Analytics tracking</Label><Switch defaultChecked /></div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>New password</Label><Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} /></div>
            <div><Label>Confirm new password</Label><Input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} /></div>
            <p className="text-xs text-muted-foreground">Minimum 6 characters. You'll stay signed in after the change.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPwdOpen(false)}>Cancel</Button>
            <Button onClick={changePassword} disabled={pwdSaving}>{pwdSaving ? "Updating..." : "Update Password"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSettings;

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KeyRound, LogOut, Save, UserRound } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile, formatDate } from "@/hooks/useMyData";
import { useToast } from "@/hooks/use-toast";

const PREFS_KEY = "dashboard-notification-prefs";

type Prefs = { email_updates: boolean; product_news: boolean; weekly_digest: boolean };

const defaultPrefs: Prefs = { email_updates: true, product_news: false, weekly_digest: true };

const loadPrefs = (): Prefs => {
  try {
    return { ...defaultPrefs, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") };
  } catch {
    return defaultPrefs;
  }
};

const AccountSettingsPanel = () => {
  const { user, userRole, signOut } = useAuth();
  const { data: profile } = useMyProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [form, setForm] = useState({ full_name: "", phone: "", city: "", bio: "", avatar_url: "" });
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [password, setPassword] = useState({ next: "", confirm: "" });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        city: profile.city ?? "",
        bio: profile.bio ?? "",
        avatar_url: profile.avatar_url ?? "",
      });
    }
  }, [profile]);

  const fields = [form.full_name, user?.email, form.phone, form.city, form.bio, form.avatar_url];
  const completion = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ ...form, email: user.email })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Could not save profile", description: error.message, variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    toast({ title: "Profile updated", description: "Your details are now up to date." });
  };

  const savePrefs = (next: Prefs) => {
    setPrefs(next);
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    toast({ title: "Preferences saved" });
  };

  const changePassword = async () => {
    if (password.next.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    if (password.next !== password.confirm) {
      toast({ title: "Passwords do not match", description: "Re-enter the same password twice.", variant: "destructive" });
      return;
    }
    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: password.next });
    setUpdatingPassword(false);
    if (error) {
      toast({ title: "Password update failed", description: error.message, variant: "destructive" });
      return;
    }
    setPassword({ next: "", confirm: "" });
    toast({ title: "Password updated", description: "Use your new password next time you sign in." });
  };

  const initials = (form.full_name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="bg-card-gradient border-border lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription>This information is shown to founders, investors and mentors you work with.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={form.avatar_url || undefined} alt={form.full_name || "Profile photo"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label htmlFor="avatar_url">Avatar image URL</Label>
              <Input
                id="avatar_url"
                value={form.avatar_url}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                placeholder="https://…"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Short bio</Label>
              <Textarea id="bio" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
          </div>

          <Button onClick={saveProfile} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-card-gradient border-border">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Role, membership and profile strength.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Role</span>
              <Badge variant="secondary" className="capitalize">{userRole ?? "member"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span>{formatDate(profile?.created_at)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Profile completion</span>
              <span className="font-semibold text-primary">{completion}%</span>
            </div>
            <Separator />
            <Button variant="outline" className="w-full" onClick={async () => { await signOut(); navigate("/login"); }}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient border-border">
          <CardHeader>
            <CardTitle>Notification preferences</CardTitle>
            <CardDescription>Choose what we email you about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {([
              ["email_updates", "Status updates", "Applications, requests and approvals"],
              ["product_news", "Platform news", "New programs, cohorts and features"],
              ["weekly_digest", "Weekly digest", "A summary of your activity"],
            ] as const).map(([key, label, description]) => (
              <div key={key} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <Switch checked={prefs[key]} onCheckedChange={(checked) => savePrefs({ ...prefs, [key]: checked })} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card-gradient border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Password
            </CardTitle>
            <CardDescription>Use at least 8 characters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={password.next}
                onChange={(e) => setPassword({ ...password, next: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              />
            </div>
            <Button className="w-full" onClick={changePassword} disabled={updatingPassword}>
              {updatingPassword ? "Updating…" : "Update password"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettingsPanel;

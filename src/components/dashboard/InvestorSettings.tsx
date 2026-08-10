import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, User, Target, Settings, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useInvestorPreferences, useMyPortfolio, toCsv } from "@/hooks/useInvestorData";

type Prefs = {
  firm_name: string;
  contact_person: string;
  email: string;
  phone: string;
  bio: string;
  investor_type: string;
  check_size_min: string | number;
  check_size_max: string | number;
  sectors: string[];
  stages: string[];
  regions: string[];
  notify_new_deals: boolean;
  notify_portfolio_updates: boolean;
  notify_market_insights: boolean;
  notify_weekly_digest: boolean;
};

const defaults: Prefs = {
  firm_name: "",
  contact_person: "",
  email: "",
  phone: "",
  bio: "",
  investor_type: "",
  check_size_min: "",
  check_size_max: "",
  sectors: [],
  stages: [],
  regions: [],
  notify_new_deals: true,
  notify_portfolio_updates: true,
  notify_market_insights: false,
  notify_weekly_digest: true,
};

const TagEditor = ({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) => {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {values.length === 0 && <span className="text-sm text-muted-foreground">None selected</span>}
        {values.map((v) => (
          <Badge key={v} variant="secondary" className="gap-1">
            {v}
            <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(values.filter((x) => x !== v))}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={`Add ${label.toLowerCase()}`}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add}>Add</Button>
      </div>
    </div>
  );
};

const InvestorSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: saved, isLoading } = useInvestorPreferences();
  const { data: holdings = [] } = useMyPortfolio();
  const [form, setForm] = useState<Prefs>(defaults);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (saved) {
      setForm({
        ...defaults,
        ...saved,
        check_size_min: saved.check_size_min ?? "",
        check_size_max: saved.check_size_max ?? "",
        sectors: saved.sectors ?? [],
        stages: saved.stages ?? [],
        regions: saved.regions ?? [],
      } as Prefs);
    } else if (user) {
      setForm((f) => ({ ...f, email: f.email || user.email || "" }));
    }
  }, [saved, user]);

  const persist = async (fields: Partial<Prefs>, successMessage: string) => {
    setSaving(true);
    const next = { ...form, ...fields };
    const payload = {
      user_id: user!.id,
      firm_name: next.firm_name || null,
      contact_person: next.contact_person || null,
      email: next.email || null,
      phone: next.phone || null,
      bio: next.bio || null,
      investor_type: next.investor_type || null,
      check_size_min: next.check_size_min === "" ? null : Number(next.check_size_min),
      check_size_max: next.check_size_max === "" ? null : Number(next.check_size_max),
      sectors: next.sectors,
      stages: next.stages,
      regions: next.regions,
      notify_new_deals: next.notify_new_deals,
      notify_portfolio_updates: next.notify_portfolio_updates,
      notify_market_insights: next.notify_market_insights,
      notify_weekly_digest: next.notify_weekly_digest,
    };
    const { error } = await supabase.from("investor_preferences").upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    setForm(next);
    toast({ title: successMessage });
    queryClient.invalidateQueries({ queryKey: ["investor-preferences", user?.id] });
  };

  const changePassword = async () => {
    if (password.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Could not update password", description: error.message, variant: "destructive" });
      return;
    }
    setPassword("");
    setConfirmPassword("");
    toast({ title: "Password updated" });
  };

  const downloadHistory = () => {
    if (holdings.length === 0) {
      toast({ title: "Nothing to export yet", description: "Add portfolio holdings first." });
      return;
    }
    toCsv(
      holdings.map((h: any) => ({
        Company: h.company_name,
        Sector: h.sector,
        Stage: h.stage,
        "Invested (USD)": h.amount_invested,
        "Ownership %": h.ownership_pct,
        "Current value (USD)": h.current_valuation,
        "Invested on": h.invested_on,
        Status: h.status,
      })),
      "investment-history.csv",
    );
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading settings…</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firm-name">Investor / Firm name</Label>
              <Input id="firm-name" value={form.firm_name} onChange={(e) => setForm({ ...form, firm_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact person</Label>
              <Input id="contact-name" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="investor-type">Investor type</Label>
              <Input id="investor-type" placeholder="Venture Capital" value={form.investor_type} onChange={(e) => setForm({ ...form, investor_type: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">About</Label>
              <Textarea id="bio" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell founders about your investment focus…" />
            </div>
            <Button className="w-full" disabled={saving} onClick={() => persist({}, "Profile saved")}>
              {saving ? "Saving…" : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Investment Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Check size range (USD)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Min" value={form.check_size_min} onChange={(e) => setForm({ ...form, check_size_min: e.target.value })} />
                <Input type="number" placeholder="Max" value={form.check_size_max} onChange={(e) => setForm({ ...form, check_size_max: e.target.value })} />
              </div>
            </div>
            <TagEditor label="Preferred sectors" values={form.sectors} onChange={(v) => setForm({ ...form, sectors: v })} />
            <TagEditor label="Investment stages" values={form.stages} onChange={(v) => setForm({ ...form, stages: v })} />
            <TagEditor label="Regions" values={form.regions} onChange={(v) => setForm({ ...form, regions: v })} />
            <Button className="w-full" disabled={saving} onClick={() => persist({}, "Preferences saved")}>
              {saving ? "Saving…" : "Update Preferences"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {([
              ["notify_new_deals", "New deal alerts"],
              ["notify_portfolio_updates", "Portfolio updates"],
              ["notify_market_insights", "Market insights"],
              ["notify_weekly_digest", "Weekly email digest"],
            ] as const).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key}>{label}</Label>
                <Switch
                  id={key}
                  checked={form[key]}
                  onCheckedChange={(checked) => persist({ [key]: checked } as Partial<Prefs>, "Notification preference saved")}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Account Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button variant="outline" className="w-full" onClick={changePassword}>Change Password</Button>
            <Button variant="outline" className="w-full" onClick={downloadHistory}>Download Investment History</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorSettings;

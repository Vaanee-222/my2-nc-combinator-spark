import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Role = "startup" | "investor" | "mentor" | "cofounder";

interface FeaturePermission {
  tabKey: string;
  feature: string;
  category: string;
  startup: boolean;
  investor: boolean;
  mentor: boolean;
  cofounder: boolean;
}

const defaultPermissions: FeaturePermission[] = [
  { tabKey: "overview", feature: "Overview", category: "Command Center", startup: true, investor: true, mentor: true, cofounder: true },
  { tabKey: "analytics", feature: "Analytics", category: "Command Center", startup: false, investor: true, mentor: false, cofounder: false },
  { tabKey: "inbox", feature: "Inbox", category: "Applications", startup: false, investor: true, mentor: false, cofounder: false },
  { tabKey: "applications", feature: "Applications", category: "Applications", startup: true, investor: false, mentor: true, cofounder: false },
  { tabKey: "hackathons", feature: "Hackathons", category: "Applications", startup: false, investor: false, mentor: true, cofounder: false },
  { tabKey: "incubation", feature: "Incubation", category: "Applications", startup: false, investor: false, mentor: true, cofounder: false },
  { tabKey: "mvplab", feature: "MVP Lab", category: "Applications", startup: false, investor: false, mentor: true, cofounder: false },
  { tabKey: "inclab", feature: "Xi Lab", category: "Applications", startup: false, investor: false, mentor: true, cofounder: false },
  { tabKey: "cofounders", feature: "Co-founders", category: "Applications", startup: false, investor: false, mentor: true, cofounder: true },
  { tabKey: "introductions", feature: "Introductions", category: "Applications", startup: false, investor: true, mentor: false, cofounder: false },
  { tabKey: "health", feature: "Health Score", category: "Applications", startup: false, investor: false, mentor: true, cofounder: false },
  { tabKey: "inquiries", feature: "Investor Inquiries", category: "Applications", startup: false, investor: true, mentor: false, cofounder: false },
  { tabKey: "credits", feature: "Cloud Credits", category: "Applications", startup: true, investor: false, mentor: false, cofounder: false },
  { tabKey: "plans", feature: "Subscriptions", category: "Commerce", startup: true, investor: false, mentor: false, cofounder: false },
  { tabKey: "deals", feature: "Deals & Offers", category: "Commerce", startup: true, investor: false, mentor: false, cofounder: false },
  { tabKey: "grants", feature: "Grants", category: "Applications", startup: true, investor: false, mentor: false, cofounder: false },
  { tabKey: "startups", feature: "Portfolio", category: "Ecosystem", startup: false, investor: true, mentor: false, cofounder: false },
  { tabKey: "directory", feature: "Directory", category: "Ecosystem", startup: false, investor: true, mentor: false, cofounder: false },
  { tabKey: "cohorts", feature: "Cohorts", category: "Ecosystem", startup: false, investor: true, mentor: false, cofounder: false },
  { tabKey: "advisors", feature: "Advisory Board", category: "Ecosystem", startup: false, investor: false, mentor: true, cofounder: false },
];

const roles: { value: Role; label: string }[] = [
  { value: "startup", label: "Startup", color: "bg-blue-500/10 text-blue-500" },
  { value: "investor", label: "Investor", color: "bg-green-500/10 text-green-500" },
  { value: "mentor", label: "Mentor", color: "bg-purple-500/10 text-purple-500" },
  { value: "cofounder", label: "Co-founder", color: "bg-orange-500/10 text-orange-500" },
].map(({ value, label }) => ({ value: value as Role, label }));

const ACLManagement = () => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<FeaturePermission[]>(defaultPermissions);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await (supabase.from("admin_tab_permissions" as any) as any).select("role,tab_key,is_allowed");
      if (error) return toast({ title: "Permissions unavailable", description: error.message, variant: "destructive" });
      setPermissions(defaultPermissions.map((permission) => {
        const next = { ...permission };
        roles.forEach(({ value }) => {
          const saved = data?.find((row: any) => row.role === value && row.tab_key === permission.tabKey);
          if (saved) next[value] = saved.is_allowed;
        });
        return next;
      }));
    };
    load();
  }, [toast]);

  const categories = [...new Set(permissions.map(p => p.category))];
  const filtered = categoryFilter === "all" ? permissions : permissions.filter(p => p.category === categoryFilter);

  const togglePermission = (feature: string, role: Role) => {
    setPermissions(prev =>
      prev.map(p => p.feature === feature ? { ...p, [role]: !p[role] } : p)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const rows = permissions.flatMap((permission) => roles.map(({ value }) => ({ role: value, tab_key: permission.tabKey, is_allowed: permission[value] })));
    const { error } = await (supabase.from("admin_tab_permissions" as any) as any).upsert(rows, { onConflict: "role,tab_key" });
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Permissions saved", description: "Workspace access is now enforced for each role." });
  };

  const getRoleSummary = (role: Role) => {
    const total = permissions.length;
    const granted = permissions.filter(p => p[role]).length;
    return { total, granted, pct: Math.round((granted / total) * 100) };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Access Control (ACL)</h2>
          <p className="text-muted-foreground">Manage feature access and permissions for each role</p>
        </div>
        <Button onClick={handleSave} disabled={saving}><Shield className="h-4 w-4 mr-1" /> {saving ? "Saving…" : "Save ACL"}</Button>
      </div>

      {/* Role Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {roles.map(r => {
          const s = getRoleSummary(r.value);
          return (
            <Card key={r.value}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{r.label}</Badge>
                </div>
                <p className="text-2xl font-bold">{s.granted}/{s.total}</p>
                <p className="text-xs text-muted-foreground">{s.pct}% features enabled</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Filter category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Feature</TableHead>
                    <TableHead>Category</TableHead>
                    {roles.map(r => <TableHead key={r.value} className="text-center">{r.label}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.feature}>
                      <TableCell className="font-medium">{p.feature}</TableCell>
                      <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                      {roles.map(r => (
                        <TableCell key={r.value} className="text-center">
                          <Switch
                            checked={p[r.value]}
                            onCheckedChange={() => togglePermission(p.feature, r.value)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default ACLManagement;

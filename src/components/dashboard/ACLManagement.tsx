import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, Lock, Unlock, Settings, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Role = "admin" | "startup" | "investor" | "mentor" | "cofounder";

interface FeaturePermission {
  feature: string;
  category: string;
  admin: boolean;
  startup: boolean;
  investor: boolean;
  mentor: boolean;
  cofounder: boolean;
}

const defaultPermissions: FeaturePermission[] = [
  // Dashboard
  { feature: "Admin Dashboard", category: "Dashboard", admin: true, startup: false, investor: false, mentor: false, cofounder: false },
  { feature: "Startup Dashboard", category: "Dashboard", admin: true, startup: true, investor: false, mentor: false, cofounder: false },
  { feature: "Investor Dashboard", category: "Dashboard", admin: true, startup: false, investor: true, mentor: false, cofounder: false },
  { feature: "Mentor Dashboard", category: "Dashboard", admin: true, startup: false, investor: false, mentor: true, cofounder: false },
  { feature: "Co-founder Dashboard", category: "Dashboard", admin: true, startup: false, investor: false, mentor: false, cofounder: true },
  // Programs
  { feature: "Apply to Programs", category: "Programs", admin: true, startup: true, investor: false, mentor: false, cofounder: true },
  { feature: "Manage Programs", category: "Programs", admin: true, startup: false, investor: false, mentor: false, cofounder: false },
  { feature: "View Program Details", category: "Programs", admin: true, startup: true, investor: true, mentor: true, cofounder: true },
  // Hackathon
  { feature: "Register for Hackathon", category: "Hackathon", admin: true, startup: true, investor: false, mentor: false, cofounder: true },
  { feature: "Manage Hackathons", category: "Hackathon", admin: true, startup: false, investor: false, mentor: false, cofounder: false },
  // Incubation
  { feature: "Apply for Incubation", category: "Incubation", admin: true, startup: true, investor: false, mentor: false, cofounder: false },
  { feature: "Review Incubation Apps", category: "Incubation", admin: true, startup: false, investor: false, mentor: true, cofounder: false },
  // Investor Centre
  { feature: "Browse Startups", category: "Investor Centre", admin: true, startup: false, investor: true, mentor: true, cofounder: false },
  { feature: "Submit Investment Interest", category: "Investor Centre", admin: true, startup: false, investor: true, mentor: false, cofounder: false },
  { feature: "View Investor Profiles", category: "Investor Centre", admin: true, startup: true, investor: true, mentor: true, cofounder: false },
  // Messaging
  { feature: "Send Messages", category: "Messaging", admin: true, startup: true, investor: true, mentor: true, cofounder: true },
  { feature: "Broadcast Messages", category: "Messaging", admin: true, startup: false, investor: false, mentor: false, cofounder: false },
  // AI Advisor
  { feature: "Startup Advisor (AI)", category: "AI", admin: true, startup: true, investor: false, mentor: false, cofounder: true },
  { feature: "Health Scoring", category: "AI", admin: true, startup: true, investor: true, mentor: true, cofounder: false },
  // Billing
  { feature: "View Subscriptions", category: "Billing", admin: true, startup: true, investor: true, mentor: false, cofounder: false },
  { feature: "Manage Billing", category: "Billing", admin: true, startup: false, investor: false, mentor: false, cofounder: false },
  // Content
  { feature: "Manage Blogs / News", category: "Content", admin: true, startup: false, investor: false, mentor: false, cofounder: false },
  { feature: "View Blogs / News", category: "Content", admin: true, startup: true, investor: true, mentor: true, cofounder: true },
  // Settings
  { feature: "Platform Configuration", category: "Settings", admin: true, startup: false, investor: false, mentor: false, cofounder: false },
  { feature: "User Management", category: "Settings", admin: true, startup: false, investor: false, mentor: false, cofounder: false },
  { feature: "Email Management", category: "Settings", admin: true, startup: false, investor: false, mentor: false, cofounder: false },
];

const roles: { value: Role; label: string; color: string }[] = [
  { value: "admin", label: "Admin", color: "bg-red-500/10 text-red-500" },
  { value: "startup", label: "Startup", color: "bg-blue-500/10 text-blue-500" },
  { value: "investor", label: "Investor", color: "bg-green-500/10 text-green-500" },
  { value: "mentor", label: "Mentor", color: "bg-purple-500/10 text-purple-500" },
  { value: "cofounder", label: "Co-founder", color: "bg-orange-500/10 text-orange-500" },
];

const ACLManagement = () => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<FeaturePermission[]>(defaultPermissions);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [...new Set(permissions.map(p => p.category))];
  const filtered = categoryFilter === "all" ? permissions : permissions.filter(p => p.category === categoryFilter);

  const togglePermission = (feature: string, role: Role) => {
    if (role === "admin") {
      toast({ title: "Cannot Modify", description: "Admin always has full access.", variant: "destructive" });
      return;
    }
    setPermissions(prev =>
      prev.map(p => p.feature === feature ? { ...p, [role]: !p[role] } : p)
    );
    toast({ title: "Permission Updated", description: `${feature} access updated for ${role}.` });
  };

  const handleSave = () => {
    toast({ title: "ACL Saved", description: "Access control settings have been saved successfully." });
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
        <Button onClick={handleSave}><Shield className="h-4 w-4 mr-1" /> Save ACL</Button>
      </div>

      {/* Role Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {roles.map(r => {
          const s = getRoleSummary(r.value);
          return (
            <Card key={r.value}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={r.color}>{r.label}</Badge>
                </div>
                <p className="text-2xl font-bold">{s.granted}/{s.total}</p>
                <p className="text-xs text-muted-foreground">{s.pct}% features enabled</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
          <TabsTrigger value="by-role">By Role</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
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
                            disabled={r.value === "admin"}
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
        </TabsContent>

        <TabsContent value="by-role" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(r => (
              <Card key={r.value}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Badge className={r.color}>{r.label}</Badge>
                    <span>{r.label} Permissions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {permissions.map(p => (
                      <div key={p.feature} className="flex items-center justify-between text-sm">
                        <span className={p[r.value] ? "text-foreground" : "text-muted-foreground line-through"}>
                          {p.feature}
                        </span>
                        {p[r.value]
                          ? <Unlock className="h-3.5 w-3.5 text-green-500" />
                          : <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        }
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ACLManagement;

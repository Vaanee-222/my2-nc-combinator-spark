import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminOverview from "@/components/dashboard/AdminOverview";
import StartupManagement from "@/components/dashboard/StartupManagement";
import ApplicationManagement from "@/components/dashboard/ApplicationManagement";
import InvestorManagement from "@/components/dashboard/InvestorManagement";
import AdminSettings from "@/components/dashboard/AdminSettings";
import ProgramManagement from "@/components/dashboard/ProgramManagement";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import StartupHealthScore from "@/components/dashboard/StartupHealthScore";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [hackathonRegs, setHackathonRegs] = useState<any[]>([]);
  const [incubationApps, setIncubationApps] = useState<any[]>([]);
  const [cofounderReqs, setCofounderReqs] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [appsRes, hackRes, incRes, cofRes, profRes] = await Promise.all([
      supabase.from("applications").select("*").order("created_at", { ascending: false }),
      supabase.from("hackathon_registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("incubation_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("cofounder_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*"),
    ]);
    setApplications(appsRes.data ?? []);
    setHackathonRegs(hackRes.data ?? []);
    setIncubationApps(incRes.data ?? []);
    setCofounderReqs(cofRes.data ?? []);
    setProfiles(profRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const stats = {
    totalApplications: applications.length,
    totalHackathonRegs: hackathonRegs.length,
    totalIncubationApps: incubationApps.length,
    totalCofounderReqs: cofounderReqs.length,
    totalUsers: profiles.length,
  };

  // Static data kept for investors/deals tabs
  const investors = [
    { id: 1, name: "Sequoia Capital India", checkSize: "₹5-50Cr", portfolio: 45, stage: "Series A+", status: "Active" },
    { id: 2, name: "Accel Partners", checkSize: "₹2-25Cr", portfolio: 38, stage: "Seed-Series B", status: "Active" },
    { id: 3, name: "Matrix Partners", checkSize: "₹1-15Cr", portfolio: 52, stage: "Pre-Seed-Series A", status: "Active" },
  ];

  const topStartups = [
    { id: 1, name: "AI Healthcare Solutions", sector: "HealthTech", valuation: "₹50Cr", growth: "+45%", status: "Series A" },
    { id: 2, name: "GreenTech Innovations", sector: "CleanTech", valuation: "₹30Cr", growth: "+38%", status: "Seed" },
    { id: 3, name: "EdTech Platform", sector: "Education", valuation: "₹25Cr", growth: "+32%", status: "Pre-Seed" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage Inc Combinator ecosystem and operations</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex flex-wrap gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
            <TabsTrigger value="incubation">Incubation</TabsTrigger>
            <TabsTrigger value="cofounders">Co-founders</TabsTrigger>
            <TabsTrigger value="health">Health Score</TabsTrigger>
            <TabsTrigger value="startups">Startups</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminOverview
              stats={stats}
              applications={applications}
              hackathonRegs={hackathonRegs}
              incubationApps={incubationApps}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard
              applications={applications}
              hackathonRegs={hackathonRegs}
              incubationApps={incubationApps}
              cofounderReqs={cofounderReqs}
              profiles={profiles}
            />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationManagement applications={applications} onRefresh={fetchData} />
          </TabsContent>

          <TabsContent value="hackathons" className="space-y-6">
            <HackathonManagement registrations={hackathonRegs} onRefresh={fetchData} />
          </TabsContent>

          <TabsContent value="incubation" className="space-y-6">
            <IncubationManagement applications={incubationApps} onRefresh={fetchData} />
          </TabsContent>

          <TabsContent value="cofounders" className="space-y-6">
            <CofounderManagement requests={cofounderReqs} />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <StartupHealthScore incubationApps={incubationApps} />
          </TabsContent>

          <TabsContent value="startups" className="space-y-6">
            <StartupManagement startups={topStartups} />
          </TabsContent>

          <TabsContent value="investors" className="space-y-6">
            <InvestorManagement investors={investors} />
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <ProgramManagement />
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <DocumentationView />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// ── Hackathon Management Tab ──
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const HackathonManagement = ({ registrations, onRefresh }: { registrations: any[]; onRefresh: () => void }) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? registrations : registrations.filter(r => r.status === filter);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("hackathon_registrations").update({ status }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Status Updated", description: `Registration marked as ${status}` });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hackathon Registrations ({registrations.length})</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>College</TableHead>
              <TableHead>Languages</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell className="font-medium">{reg.full_name}</TableCell>
                <TableCell>{reg.email}</TableCell>
                <TableCell>{reg.city || "—"}</TableCell>
                <TableCell>{reg.college || "—"}</TableCell>
                <TableCell className="max-w-[150px] truncate">{reg.programming_languages || "—"}</TableCell>
                <TableCell>{reg.experience || "—"}</TableCell>
                <TableCell>
                  <Badge variant={reg.status === "approved" ? "default" : reg.status === "rejected" ? "destructive" : "secondary"}>
                    {reg.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => updateStatus(reg.id, "approved")}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(reg.id, "rejected")}>Reject</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No registrations found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

// ── Incubation Management Tab ──
const IncubationManagement = ({ applications, onRefresh }: { applications: any[]; onRefresh: () => void }) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("incubation_applications").update({ status }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Status Updated", description: `Application marked as ${status}` });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Incubation Applications ({applications.length})</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Founder</TableHead>
              <TableHead>Startup</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Team Size</TableHead>
              <TableHead>Funding</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.founder_name}</TableCell>
                <TableCell>{app.startup_name || "—"}</TableCell>
                <TableCell>{app.industry || "—"}</TableCell>
                <TableCell>{app.stage || "—"}</TableCell>
                <TableCell>{app.team_size || "—"}</TableCell>
                <TableCell>{app.funding_status || "—"}</TableCell>
                <TableCell>
                  <Badge variant={app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"}>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, "approved")}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, "rejected")}>Reject</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No applications found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

// ── Co-founder Management Tab ──
const CofounderManagement = ({ requests }: { requests: any[] }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Co-founder Requests ({requests.length})</h2>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Skills Needed</TableHead>
              <TableHead>Equity</TableHead>
              <TableHead>Commitment</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.title}</TableCell>
                <TableCell className="max-w-[150px] truncate">{req.skills_needed || "—"}</TableCell>
                <TableCell>{req.equity_offered || "—"}</TableCell>
                <TableCell>{req.commitment || "—"}</TableCell>
                <TableCell>{req.location || "—"}</TableCell>
                <TableCell>{req.contact_email || "—"}</TableCell>
                <TableCell>
                  <Badge variant={req.status === "active" ? "default" : "secondary"}>{req.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No requests found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

// ── Documentation View Tab ──
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Database, Shield, Key, CreditCard, Bot } from "lucide-react";

const DocumentationView = () => {
  const sections = [
    {
      title: "Architecture",
      icon: Database,
      content: `**Tech Stack:** React 18, TypeScript 5, Vite 5, Tailwind CSS v3, shadcn/ui, Lovable Cloud (PostgreSQL, Auth, RLS, Edge Functions)\n\n**State:** React Context (Auth), TanStack React Query\n**Routing:** React Router v6 with role-based protection`,
    },
    {
      title: "Authentication",
      icon: Key,
      content: `**Sign Up:** Email/password with role → profile auto-created → role inserted\n**Sign In:** Email/password via Auth\n**Password Reset:** Email link → /reset-password\n**Session:** localStorage, auto-refresh via onAuthStateChange\n\n**Roles:** admin, startup, investor, mentor, cofounder\nRole check via \`has_role()\` security-definer function`,
    },
    {
      title: "Database Tables",
      icon: Database,
      content: `| Table | Purpose |\n|---|---|\n| profiles | User profiles (auto-created) |\n| user_roles | Role assignments |\n| applications | Program applications |\n| hackathon_registrations | Hackathon signups |\n| incubation_applications | Incubation program apps |\n| cofounder_requests | Co-founder matching |`,
    },
    {
      title: "Security & RLS",
      icon: Shield,
      content: `All tables have Row Level Security enabled.\n\n- Users can only view their own data\n- Admins can view and update all records\n- Auth users can create new records\n- Role checking uses \`has_role()\` to avoid RLS recursion`,
    },
    {
      title: "Demo Accounts",
      icon: Key,
      content: `All demo accounts use password: **Demo@1234**\n\n| Email | Role |\n|---|---|\n| admin@incombinator.com | Admin |\n| startup@incombinator.com | Startup |\n| investor@incombinator.com | Investor |\n| mentor@incombinator.com | Mentor |\n| cofounder@incombinator.com | Co-founder |`,
    },
    {
      title: "Subscription Plans",
      icon: CreditCard,
      content: `**Membership (Monthly):** Starter $49, Growth $149, Scale $299\n**Subscription (Quarterly):** Launchpad $999, Accelerate $1,399, Unicorn $1,499\n**Services:** Pitch Deck Review, Market Research, Tech Architecture, Legal Setup, Brand Identity`,
    },
    {
      title: "AI Agents",
      icon: Bot,
      content: `**Mock VC / Angel:** Pitch practice & valuation feedback\n**AI Startup Lawyer:** Legal guidance on incorporation, equity, compliance\n**GTM Adviser:** Go-to-market strategy, pricing, customer acquisition\n**Startup Buddy:** Brainstorming, mentorship, emotional support\n\nPowered by Lovable AI via Edge Functions.`,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Platform Documentation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[250px]">
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {section.content}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;

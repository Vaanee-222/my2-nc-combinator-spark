import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Users, FileText, Briefcase, UserCheck } from "lucide-react";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";

interface AnalyticsDashboardProps {
  applications: any[];
  hackathonRegs: any[];
  incubationApps: any[];
  cofounderReqs: any[];
  profiles: any[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  active: "#3b82f6",
};

const AnalyticsDashboard = ({ applications, hackathonRegs, incubationApps, cofounderReqs, profiles }: AnalyticsDashboardProps) => {
  const last30Days = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 29);
    return eachDayOfInterval({ start, end });
  }, []);

  // Application trends over 30 days
  const trendData = useMemo(() => {
    return last30Days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayStart = startOfDay(day).toISOString();
      const dayEnd = new Date(startOfDay(day).getTime() + 86400000).toISOString();
      const countIn = (arr: any[]) => arr.filter((a) => a.created_at >= dayStart && a.created_at < dayEnd).length;
      return {
        date: format(day, "MMM dd"),
        Applications: countIn(applications),
        Hackathon: countIn(hackathonRegs),
        Incubation: countIn(incubationApps),
      };
    });
  }, [last30Days, applications, hackathonRegs, incubationApps]);

  // Conversion rates
  const conversionData = useMemo(() => {
    const calc = (arr: any[], label: string) => {
      const total = arr.length;
      const approved = arr.filter((a) => a.status === "approved").length;
      const rejected = arr.filter((a) => a.status === "rejected").length;
      const pending = arr.filter((a) => a.status === "pending").length;
      return { name: label, total, approved, rejected, pending, rate: total > 0 ? Math.round((approved / total) * 100) : 0 };
    };
    return [
      calc(applications, "Applications"),
      calc(hackathonRegs, "Hackathon"),
      calc(incubationApps, "Incubation"),
    ];
  }, [applications, hackathonRegs, incubationApps]);

  // Status distribution pie
  const statusDistribution = useMemo(() => {
    const all = [...applications, ...hackathonRegs, ...incubationApps];
    const counts: Record<string, number> = {};
    all.forEach((item) => { counts[item.status] = (counts[item.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [applications, hackathonRegs, incubationApps]);

  // Cohort performance - group by month
  const cohortData = useMemo(() => {
    const months: Record<string, { month: string; apps: number; approved: number; rejected: number }> = {};
    [...applications, ...hackathonRegs, ...incubationApps].forEach((item) => {
      const m = format(new Date(item.created_at), "MMM yyyy");
      if (!months[m]) months[m] = { month: m, apps: 0, approved: 0, rejected: 0 };
      months[m].apps++;
      if (item.status === "approved") months[m].approved++;
      if (item.status === "rejected") months[m].rejected++;
    });
    return Object.values(months).slice(-6);
  }, [applications, hackathonRegs, incubationApps]);

  const totalAll = applications.length + hackathonRegs.length + incubationApps.length;
  const totalApproved = [...applications, ...hackathonRegs, ...incubationApps].filter((a) => a.status === "approved").length;
  const overallRate = totalAll > 0 ? Math.round((totalApproved / totalAll) * 100) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics & Insights</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Submissions" value={totalAll} icon={FileText} trend={`${applications.length} apps`} />
        <KPICard title="Approval Rate" value={`${overallRate}%`} icon={TrendingUp} trend={`${totalApproved} approved`} positive={overallRate > 50} />
        <KPICard title="Active Users" value={profiles.length} icon={Users} trend="Registered" />
        <KPICard title="Co-founder Posts" value={cofounderReqs.length} icon={UserCheck} trend={`${cofounderReqs.filter((r) => r.status === "active").length} active`} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Application Trends (30 Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
                <Area type="monotone" dataKey="Applications" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="Hackathon" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="Incubation" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusDistribution.map((entry, i) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Conversion Rates by Program</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Cohort Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="apps" name="Total" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="approved" name="Approved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="rejected" name="Rejected" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Summary Table */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Program Conversion Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {conversionData.map((item) => (
              <div key={item.name} className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">{item.name}</h4>
                <div className="text-3xl font-bold mb-1">{item.rate}%</div>
                <p className="text-xs text-muted-foreground">{item.approved} approved / {item.total} total</p>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${item.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const KPICard = ({ title, value, icon: Icon, trend, positive = true }: { title: string; value: string | number; icon: any; trend: string; positive?: boolean }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{trend}</p>
    </CardContent>
  </Card>
);

export default AnalyticsDashboard;

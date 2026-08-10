import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Money from "@/components/Money";
import { useMyPortfolio, useMyDeals, portfolioMetrics, PIPELINE_STAGES, num } from "@/hooks/useInvestorData";

const COLORS = ["hsl(var(--primary))", "#22c55e", "#3b82f6", "#eab308", "#a855f7", "#ef4444"];

const InvestorAnalytics = () => {
  const { data: holdings = [], isLoading } = useMyPortfolio();
  const { data: deals = [] } = useMyDeals();

  const metrics = useMemo(() => portfolioMetrics(holdings), [holdings]);

  const bySector = useMemo(() => {
    const map = new Map<string, number>();
    holdings.forEach((h: any) => {
      const key = h.sector || "Unspecified";
      map.set(key, (map.get(key) ?? 0) + num(h.amount_invested));
    });
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [holdings]);

  const byStage = useMemo(() => {
    const map = new Map<string, number>();
    holdings.forEach((h: any) => {
      const key = h.stage || "Unspecified";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map, ([name, count]) => ({ name, count }));
  }, [holdings]);

  const deployedByYear = useMemo(() => {
    const map = new Map<string, number>();
    holdings.forEach((h: any) => {
      const year = h.invested_on ? new Date(h.invested_on).getFullYear().toString() : "Unknown";
      map.set(year, (map.get(year) ?? 0) + num(h.amount_invested));
    });
    return Array.from(map, ([year, amount]) => ({ year, amount })).sort((a, b) => a.year.localeCompare(b.year));
  }, [holdings]);

  const funnel = useMemo(
    () => PIPELINE_STAGES.map((s) => ({ name: s, count: deals.filter((d: any) => d.stage === s).length })),
    [deals],
  );

  const conversion = deals.length > 0 ? Math.round((deals.filter((d: any) => d.stage === "Closed").length / deals.length) * 100) : 0;

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading analytics…</p>;

  if (holdings.length === 0 && deals.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Analytics appear once you add portfolio holdings or pipeline deals.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card-gradient border-border">
          <CardHeader><CardTitle>Portfolio performance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Value vs cost</span>
                <span>{metrics.roi}%</span>
              </div>
              <Progress value={Math.min(metrics.roi, 200) / 2} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Holdings above cost</span>
                <span>{metrics.successRate}%</span>
              </div>
              <Progress value={metrics.successRate} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pipeline conversion</span>
                <span>{conversion}%</span>
              </div>
              <Progress value={conversion} />
            </div>
            <div className="pt-2 text-sm text-muted-foreground">
              Deployed <Money usd={metrics.invested} compact className="font-semibold text-foreground" /> across {metrics.total} companies,
              now valued at <Money usd={metrics.value} compact className="font-semibold text-foreground" />.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient border-border">
          <CardHeader><CardTitle>Capital by sector</CardTitle></CardHeader>
          <CardContent className="h-64">
            {bySector.length === 0 ? (
              <p className="text-sm text-muted-foreground">No holdings yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bySector} dataKey="value" nameKey="name" outerRadius={80} label>
                    {bySector.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card-gradient border-border">
          <CardHeader><CardTitle>Holdings by stage</CardTitle></CardHeader>
          <CardContent className="h-64">
            {byStage.length === 0 ? (
              <p className="text-sm text-muted-foreground">No holdings yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStage}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card-gradient border-border">
          <CardHeader><CardTitle>Capital deployed over time</CardTitle></CardHeader>
          <CardContent className="h-64">
            {deployedByYear.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add investment dates to see this chart.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deployedByYear}>
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card-gradient border-border">
          <CardHeader><CardTitle>Pipeline funnel</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical">
                <XAxis type="number" allowDecimals={false} fontSize={12} />
                <YAxis type="category" dataKey="name" width={100} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorAnalytics;

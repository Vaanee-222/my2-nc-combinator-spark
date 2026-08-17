import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, TrendingUp, Building, Calendar, DollarSign, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Money from "@/components/Money";
import {
  useMyPortfolio,
  useSourceableStartups,
  portfolioMetrics,
  growthPct,
  num,
  toCsv,
} from "@/hooks/useInvestorData";

const STATUSES = ["active", "exited", "written off"];

const emptyHolding = {
  company_name: "",
  sector: "",
  stage: "Seed",
  amount_invested: 0,
  ownership_pct: 0,
  current_valuation: 0,
  invested_on: "",
  status: "active",
  notes: "",
  startup_id: null as string | null,
};

const PortfolioManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: holdings = [], isLoading } = useMyPortfolio();
  const { data: startups = [] } = useSourceableStartups();

  const [editing, setEditing] = useState<any | null>(null);
  const [picking, setPicking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const metrics = useMemo(() => portfolioMetrics(holdings), [holdings]);

  const filtered = useMemo(
    () =>
      holdings.filter((h: any) => {
        const matchesSearch =
          !search ||
          `${h.company_name} ${h.sector ?? ""} ${h.stage ?? ""}`.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || h.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [holdings, search, statusFilter],
  );

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["investor-portfolio", user?.id] });

  const save = async () => {
    if (!editing?.company_name?.trim()) {
      toast({ title: "Company name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      user_id: user!.id,
      startup_id: editing.startup_id || null,
      company_name: editing.company_name.trim(),
      sector: editing.sector || null,
      stage: editing.stage || null,
      amount_invested: num(editing.amount_invested),
      ownership_pct: num(editing.ownership_pct),
      current_valuation: num(editing.current_valuation),
      invested_on: editing.invested_on || null,
      status: editing.status || "active",
      notes: editing.notes || null,
    };
    const { error } = editing.id
      ? await supabase.from("investor_portfolio").update(payload).eq("id", editing.id)
      : await supabase.from("investor_portfolio").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editing.id ? "Holding updated" : "Holding added" });
    setEditing(null);
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this holding from your portfolio?")) return;
    const { error } = await supabase.from("investor_portfolio").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Holding removed" });
    refresh();
  };

  const addFromDirectory = (startup: any) => {
    setPicking(false);
    setEditing({
      ...emptyHolding,
      startup_id: startup.id,
      company_name: startup.name,
      sector: startup.sector ?? "",
      stage: startup.stage ?? "Seed",
    });
  };

  const exportCsv = () =>
    toCsv(
      filtered.map((h: any) => ({
        Company: h.company_name,
        Sector: h.sector,
        Stage: h.stage,
        "Invested (USD)": h.amount_invested,
        "Ownership %": h.ownership_pct,
        "Current value (USD)": h.current_valuation,
        "Invested on": h.invested_on,
        Status: h.status,
      })),
      "portfolio.csv",
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl font-bold">Portfolio Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => setPicking(true)}>
            From directory
          </Button>
          <Button onClick={() => setEditing({ ...emptyHolding })}>
            <Plus className="mr-2 h-4 w-4" />
            Add Holding
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{metrics.total}</p>
                <p className="text-xs text-muted-foreground">Portfolio Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold"><Money usd={metrics.invested} compact /></p>
                <p className="text-xs text-muted-foreground">Total Invested</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold"><Money usd={metrics.value} compact /></p>
                <p className="text-xs text-muted-foreground">Portfolio Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.roi}%</p>
                <p className="text-xs text-muted-foreground">Value / Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search company, sector or stage"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4"><SkeletonList count={4} /></div>
          ) : filtered.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon={Briefcase}
                title="No portfolio companies yet"
                description="Add one manually or pull a company from the startup directory to start tracking value."
              />
            </div>
          ) : (

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Invested</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Ownership</TableHead>
                  <TableHead>Growth</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((h: any) => {
                  const g = growthPct(h);
                  return (
                    <TableRow key={h.id}>
                      <TableCell className="font-medium">{h.company_name}</TableCell>
                      <TableCell>{h.sector ? <Badge variant="outline">{h.sector}</Badge> : "—"}</TableCell>
                      <TableCell><Money usd={num(h.amount_invested)} compact /></TableCell>
                      <TableCell><Money usd={num(h.current_valuation)} compact /></TableCell>
                      <TableCell>{num(h.ownership_pct)}%</TableCell>
                      <TableCell>
                        {g === null ? (
                          "—"
                        ) : (
                          <span className={g >= 0 ? "font-semibold text-green-600" : "font-semibold text-destructive"}>
                            {g >= 0 ? "+" : ""}{g}%
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={h.status === "active" ? "default" : "secondary"} className="capitalize">
                          {h.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setEditing(h)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => remove(h.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pick from directory */}
      <Dialog open={picking} onOpenChange={setPicking}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add from startup directory</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {startups.length === 0 && <p className="text-sm text-muted-foreground">No startups available.</p>}
            {startups.map((s: any) => (
              <Card key={s.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{s.name}</h4>
                    <div className="flex gap-2 mt-1">
                      {s.sector && <Badge variant="outline">{s.sector}</Badge>}
                      {s.stage && <Badge variant="secondary">{s.stage}</Badge>}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => addFromDirectory(s)}>Add</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add / edit holding */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit holding" : "Add holding"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Company name *</Label>
                <Input value={editing.company_name ?? ""} onChange={(e) => setEditing({ ...editing, company_name: e.target.value })} />
              </div>
              <div>
                <Label>Sector</Label>
                <Input value={editing.sector ?? ""} onChange={(e) => setEditing({ ...editing, sector: e.target.value })} />
              </div>
              <div>
                <Label>Stage</Label>
                <Input value={editing.stage ?? ""} onChange={(e) => setEditing({ ...editing, stage: e.target.value })} />
              </div>
              <div>
                <Label>Amount invested (USD)</Label>
                <Input type="number" value={editing.amount_invested ?? 0} onChange={(e) => setEditing({ ...editing, amount_invested: e.target.value })} />
              </div>
              <div>
                <Label>Current valuation (USD)</Label>
                <Input type="number" value={editing.current_valuation ?? 0} onChange={(e) => setEditing({ ...editing, current_valuation: e.target.value })} />
              </div>
              <div>
                <Label>Ownership %</Label>
                <Input type="number" value={editing.ownership_pct ?? 0} onChange={(e) => setEditing({ ...editing, ownership_pct: e.target.value })} />
              </div>
              <div>
                <Label>Investment date</Label>
                <Input type="date" value={editing.invested_on ?? ""} onChange={(e) => setEditing({ ...editing, invested_on: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editing.status ?? "active"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Notes</Label>
                <Textarea rows={3} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioManagement;

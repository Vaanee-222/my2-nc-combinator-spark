import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ConsultationDialog from "@/components/ConsultationDialog";
import Money from "@/components/Money";
import { useMyDeals, PIPELINE_STAGES, progressForStage, num, toCsv } from "@/hooks/useInvestorData";

const emptyDeal = {
  company_name: "",
  sector: "",
  stage: "Sourced",
  ask_amount: 0,
  revenue: "",
  team_size: 0,
  founded_year: new Date().getFullYear(),
  source: "Manual",
  contact_email: "",
  notes: "",
  startup_id: null as string | null,
};

const DealPipeline = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: deals = [], isLoading } = useMyDeals();
  const [editing, setEditing] = useState<any | null>(null);
  const [viewing, setViewing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [stageFilter, setStageFilter] = useState("all");

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["investor-deals", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["investor-portfolio", user?.id] });
  };

  const filtered = useMemo(
    () => (stageFilter === "all" ? deals : deals.filter((d: any) => d.stage === stageFilter)),
    [deals, stageFilter],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    PIPELINE_STAGES.forEach((s) => (map[s] = deals.filter((d: any) => d.stage === s).length));
    return map;
  }, [deals]);

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
      stage: editing.stage || "Sourced",
      progress: progressForStage(editing.stage || "Sourced"),
      ask_amount: num(editing.ask_amount),
      revenue: editing.revenue || null,
      team_size: editing.team_size ? Number(editing.team_size) : null,
      founded_year: editing.founded_year ? Number(editing.founded_year) : null,
      source: editing.source || "Manual",
      contact_email: editing.contact_email || null,
      notes: editing.notes || null,
    };
    const { error } = editing.id
      ? await supabase.from("investor_deals").update(payload).eq("id", editing.id)
      : await supabase.from("investor_deals").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editing.id ? "Deal updated" : "Deal added to pipeline" });
    setEditing(null);
    refresh();
  };

  const moveStage = async (deal: any, stage: string) => {
    const { error } = await supabase
      .from("investor_deals")
      .update({ stage, progress: progressForStage(stage) })
      .eq("id", deal.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `${deal.company_name} moved to ${stage}` });
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this deal from the pipeline?")) return;
    const { error } = await supabase.from("investor_deals").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deal removed" });
    refresh();
  };

  const convertToHolding = async (deal: any) => {
    const { error } = await supabase.from("investor_portfolio").insert({
      user_id: user!.id,
      startup_id: deal.startup_id,
      company_name: deal.company_name,
      sector: deal.sector,
      stage: deal.stage === "Closed" ? "Seed" : deal.stage,
      amount_invested: num(deal.ask_amount),
      current_valuation: num(deal.ask_amount),
      ownership_pct: 0,
      invested_on: new Date().toISOString().slice(0, 10),
      status: "active",
      notes: deal.notes,
    });
    if (error) {
      toast({ title: "Could not add to portfolio", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.from("investor_deals").update({ stage: "Closed", progress: 100 }).eq("id", deal.id);
    toast({ title: "Added to portfolio", description: `${deal.company_name} is now a holding.` });
    refresh();
  };

  const exportCsv = () =>
    toCsv(
      filtered.map((d: any) => ({
        Company: d.company_name,
        Sector: d.sector,
        Stage: d.stage,
        "Ask (USD)": d.ask_amount,
        Revenue: d.revenue,
        Source: d.source,
      })),
      "deal-pipeline.csv",
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl font-bold">Deal Pipeline</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setEditing({ ...emptyDeal })}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Deal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {PIPELINE_STAGES.map((s) => (
          <Card
            key={s}
            className={`cursor-pointer transition-colors ${stageFilter === s ? "border-primary" : ""}`}
            onClick={() => setStageFilter(stageFilter === s ? "all" : s)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{counts[s] ?? 0}</div>
              <div className="text-xs text-muted-foreground">{s}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading pipeline…</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No deals in this view. Add a deal manually or source one from the New Deals tab.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((deal: any) => (
            <Card key={deal.id} className="bg-card-gradient border-border">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="text-lg font-semibold">{deal.company_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {[deal.sector, deal.founded_year ? `Founded ${deal.founded_year}` : null, deal.team_size ? `${deal.team_size} team members` : null]
                          .filter(Boolean)
                          .join(" • ") || "No company details yet"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span><strong>Ask:</strong> <Money usd={num(deal.ask_amount)} compact /></span>
                      {deal.revenue && <span><strong>Revenue:</strong> {deal.revenue}</span>}
                      {deal.source && <Badge variant="outline">{deal.source}</Badge>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stage: {deal.stage}</span>
                        <span>{deal.progress}%</span>
                      </div>
                      <Progress value={deal.progress} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 lg:w-64">
                    <Select value={deal.stage} onValueChange={(v) => moveStage(deal, v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PIPELINE_STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => setViewing(deal)}>Details</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(deal)}>Notes</Button>
                      <ConsultationDialog title={`Schedule Call: ${deal.company_name}`} description="Set up a call with the founder.">
                        <Button variant="outline" size="sm">Schedule Call</Button>
                      </ConsultationDialog>
                      <Button size="sm" onClick={() => convertToHolding(deal)}>Add to portfolio</Button>
                      <Button size="sm" variant="outline" onClick={() => remove(deal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{viewing?.company_name}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              {[
                ["Sector", viewing.sector],
                ["Stage", viewing.stage],
                ["Ask", viewing.ask_amount ? `$${Number(viewing.ask_amount).toLocaleString()}` : null],
                ["Revenue", viewing.revenue],
                ["Team size", viewing.team_size],
                ["Founded", viewing.founded_year],
                ["Source", viewing.source],
                ["Contact", viewing.contact_email],
                ["Notes", viewing.notes],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between gap-4 border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-right font-medium break-all">{value || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit deal" : "Add deal"}</DialogTitle></DialogHeader>
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
                <Label>Pipeline stage</Label>
                <Select value={editing.stage ?? "Sourced"} onValueChange={(v) => setEditing({ ...editing, stage: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PIPELINE_STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ask amount (USD)</Label>
                <Input type="number" value={editing.ask_amount ?? 0} onChange={(e) => setEditing({ ...editing, ask_amount: e.target.value })} />
              </div>
              <div>
                <Label>Revenue</Label>
                <Input value={editing.revenue ?? ""} onChange={(e) => setEditing({ ...editing, revenue: e.target.value })} placeholder="$60K ARR" />
              </div>
              <div>
                <Label>Team size</Label>
                <Input type="number" value={editing.team_size ?? 0} onChange={(e) => setEditing({ ...editing, team_size: e.target.value })} />
              </div>
              <div>
                <Label>Founded year</Label>
                <Input type="number" value={editing.founded_year ?? ""} onChange={(e) => setEditing({ ...editing, founded_year: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Founder contact email</Label>
                <Input type="email" value={editing.contact_email ?? ""} onChange={(e) => setEditing({ ...editing, contact_email: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Reviewer notes</Label>
                <Textarea rows={4} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
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

export default DealPipeline;

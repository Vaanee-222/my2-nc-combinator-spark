import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { logAudit } from "@/lib/audit";
import { SkeletonRows } from "@/components/dashboard/EmptyState";

type Row = Tables<"cohort_startups">;

const empty: Partial<Row> = {
  name: "",
  founder: "",
  category: "",
  description: "",
  stage: "Seed",
  traction: "",
  status: "Selected",
  cohort_type: "monthly",
  period: "",
  highlight: "",
  is_visible: true,
  sort_order: 0,
};

const CohortManagement = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-cohort-startups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cohort_startups")
        .select("*")
        .order("period", { ascending: false })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Row[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const periods = useMemo(() => Array.from(new Set(rows.map((r) => r.period))).sort().reverse(), [rows]);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (typeFilter === "all" || r.cohort_type === typeFilter) &&
          (periodFilter === "all" || r.period === periodFilter) &&
          (!search ||
            `${r.name} ${r.founder ?? ""} ${r.category ?? ""}`.toLowerCase().includes(search.toLowerCase())),
      ),
    [rows, typeFilter, periodFilter, search],
  );

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-cohort-startups"] });

  const save = async () => {
    if (!editing?.name || !editing?.period) {
      return toast({ title: "Name and period are required", variant: "destructive" });
    }
    const payload = {
      name: editing.name,
      founder: editing.founder ?? null,
      category: editing.category ?? null,
      description: editing.description ?? null,
      stage: editing.stage ?? null,
      traction: editing.traction ?? null,
      status: editing.status || "Selected",
      cohort_type: editing.cohort_type || "monthly",
      period: editing.period,
      highlight: editing.highlight ?? null,
      is_visible: editing.is_visible ?? true,
      sort_order: Number(editing.sort_order) || 0,
    };
    const { error } = editing.id
      ? await supabase.from("cohort_startups").update(payload).eq("id", editing.id)
      : await supabase.from("cohort_startups").insert(payload);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    logAudit({ action: editing.id ? "update" : "create", table: "cohort_startups", recordId: editing.id, details: payload });
    toast({ title: editing.id ? "Cohort entry updated" : "Cohort entry created" });
    setEditing(null);
    refresh();
  };

  const toggleVisible = async (row: Row) => {
    const { error } = await supabase.from("cohort_startups").update({ is_visible: !row.is_visible }).eq("id", row.id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    logAudit({ action: "update", table: "cohort_startups", recordId: row.id, details: { is_visible: !row.is_visible } });
    refresh();
  };

  const remove = async (row: Row) => {
    const { error } = await supabase.from("cohort_startups").delete().eq("id", row.id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    logAudit({ action: "delete", table: "cohort_startups", recordId: row.id, details: { name: row.name } });
    toast({ title: "Entry deleted" });
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input className="w-64" placeholder="Search startups…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cohorts</SelectItem>
            <SelectItem value="monthly">Monthly Top 10</SelectItem>
            <SelectItem value="quarterly">Quarterly Top 5</SelectItem>
          </SelectContent>
        </Select>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All periods</SelectItem>
            {periods.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button className="ml-auto" onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4 mr-1" /> Add entry</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Startup</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <SkeletonRows rows={5} cols={7} />}
              {!isLoading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No cohort entries found.</TableCell></TableRow>
              )}
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.founder}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{r.cohort_type === "monthly" ? "Monthly" : "Quarterly"}</Badge></TableCell>
                  <TableCell>{r.period}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell><Badge variant="secondary">{r.status}</Badge></TableCell>
                  <TableCell><Switch checked={!!r.is_visible} onCheckedChange={() => toggleVisible(r)} /></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(r)} aria-label={`Edit ${r.name}`}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(r)} aria-label={`Delete ${r.name}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit cohort entry" : "Add cohort entry"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Startup name</Label><Input value={editing?.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Founder</Label><Input value={editing?.founder || ""} onChange={(e) => setEditing({ ...editing, founder: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Cohort type</Label>
              <Select value={editing?.cohort_type || "monthly"} onValueChange={(v) => setEditing({ ...editing, cohort_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Top 10</SelectItem>
                  <SelectItem value="quarterly">Quarterly Top 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Period (2026-06 or 2026-Q2)</Label><Input value={editing?.period || ""} onChange={(e) => setEditing({ ...editing, period: e.target.value })} /></div>
            <div className="space-y-2"><Label>Category</Label><Input value={editing?.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
            <div className="space-y-2"><Label>Stage</Label><Input value={editing?.stage || ""} onChange={(e) => setEditing({ ...editing, stage: e.target.value })} /></div>
            <div className="space-y-2"><Label>Traction</Label><Input value={editing?.traction || ""} onChange={(e) => setEditing({ ...editing, traction: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editing?.status || "Selected"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Selected">Selected</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Highlight</Label><Input value={editing?.highlight || ""} onChange={(e) => setEditing({ ...editing, highlight: e.target.value })} /></div>
            <div className="space-y-2"><Label>Sort order</Label><Input type="number" value={editing?.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea rows={3} value={editing?.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="flex items-center justify-between md:col-span-2">
              <Label>Visible on public pages</Label>
              <Switch checked={editing?.is_visible ?? true} onCheckedChange={(c) => setEditing({ ...editing, is_visible: c })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CohortManagement;

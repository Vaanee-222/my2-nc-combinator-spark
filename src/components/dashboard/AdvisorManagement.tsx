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

type Row = Tables<"advisors">;

const TIERS = ["Founding Advisors", "Strategic Advisors", "Regional Partners", "Industry Experts"];

const empty: Partial<Row> = {
  name: "",
  role: "",
  company: "",
  country: "",
  expertise: "",
  description: "",
  linkedin_url: "",
  tier: "Strategic Advisors",
  is_active: true,
  sort_order: 0,
};

const AdvisorManagement = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-advisors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("advisors").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Row[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (tierFilter === "all" || r.tier === tierFilter) &&
          (!search || `${r.name} ${r.company ?? ""} ${r.expertise ?? ""}`.toLowerCase().includes(search.toLowerCase())),
      ),
    [rows, tierFilter, search],
  );

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-advisors"] });
    qc.invalidateQueries({ queryKey: ["advisors", "public"] });
  };

  const save = async () => {
    if (!editing?.name) return toast({ title: "Name is required", variant: "destructive" });
    const payload = {
      name: editing.name,
      role: editing.role ?? null,
      company: editing.company ?? null,
      country: editing.country ?? null,
      expertise: editing.expertise ?? null,
      description: editing.description ?? null,
      linkedin_url: editing.linkedin_url ?? null,
      tier: editing.tier || "Strategic Advisors",
      is_active: editing.is_active ?? true,
      sort_order: Number(editing.sort_order) || 0,
    };
    const { error } = editing.id
      ? await supabase.from("advisors").update(payload).eq("id", editing.id)
      : await supabase.from("advisors").insert(payload);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    logAudit({ action: editing.id ? "update" : "create", table: "advisors", recordId: editing.id, details: payload });
    toast({ title: editing.id ? "Advisor updated" : "Advisor added" });
    setEditing(null);
    refresh();
  };

  const toggleActive = async (row: Row) => {
    const { error } = await supabase.from("advisors").update({ is_active: !row.is_active }).eq("id", row.id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    logAudit({ action: "update", table: "advisors", recordId: row.id, details: { is_active: !row.is_active } });
    refresh();
  };

  const remove = async (row: Row) => {
    const { error } = await supabase.from("advisors").delete().eq("id", row.id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    logAudit({ action: "delete", table: "advisors", recordId: row.id, details: { name: row.name } });
    toast({ title: "Advisor removed" });
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input className="w-64" placeholder="Search advisors…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tiers</SelectItem>
            {TIERS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button className="ml-auto" onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4 mr-1" /> Add advisor</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Advisor</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
              {!isLoading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No advisors found.</TableCell></TableRow>
              )}
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </TableCell>
                  <TableCell>{r.company}</TableCell>
                  <TableCell>{r.country}</TableCell>
                  <TableCell><Badge variant="outline">{r.tier}</Badge></TableCell>
                  <TableCell><Switch checked={!!r.is_active} onCheckedChange={() => toggleActive(r)} /></TableCell>
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
          <DialogHeader><DialogTitle>{editing?.id ? "Edit advisor" : "Add advisor"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Name</Label><Input value={editing?.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Role</Label><Input value={editing?.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></div>
            <div className="space-y-2"><Label>Company</Label><Input value={editing?.company || ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })} /></div>
            <div className="space-y-2"><Label>Country</Label><Input value={editing?.country || ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} /></div>
            <div className="space-y-2"><Label>Expertise</Label><Input value={editing?.expertise || ""} onChange={(e) => setEditing({ ...editing, expertise: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Tier</Label>
              <Select value={editing?.tier || "Strategic Advisors"} onValueChange={(v) => setEditing({ ...editing, tier: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TIERS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>LinkedIn URL</Label><Input value={editing?.linkedin_url || ""} onChange={(e) => setEditing({ ...editing, linkedin_url: e.target.value })} /></div>
            <div className="space-y-2"><Label>Sort order</Label><Input type="number" value={editing?.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea rows={3} value={editing?.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="flex items-center justify-between md:col-span-2">
              <Label>Show on the public About page</Label>
              <Switch checked={editing?.is_active ?? true} onCheckedChange={(c) => setEditing({ ...editing, is_active: c })} />
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

export default AdvisorManagement;

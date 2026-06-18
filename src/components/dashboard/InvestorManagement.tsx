import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const empty = { name: "", check_size: "", portfolio_count: 0, stage: "", status: "Active", website_url: "", notes: "" };

const InvestorManagement = () => {
  const { toast } = useToast();
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [viewing, setViewing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from("investors").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setInvestors(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.name) return toast({ title: "Investor name required", variant: "destructive" });
    setSaving(true);
    const payload = {
      name: editing.name,
      check_size: editing.check_size || null,
      portfolio_count: Number(editing.portfolio_count ?? 0),
      stage: editing.stage || null,
      status: editing.status || "Active",
      website_url: editing.website_url || null,
      notes: editing.notes || null,
    };
    const { error } = editing.id
      ? await (supabase as any).from("investors").update(payload).eq("id", editing.id)
      : await (supabase as any).from("investors").insert(payload);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: editing.id ? "Investor updated" : "Investor added" });
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this investor?")) return;
    const { error } = await (supabase as any).from("investors").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Investor deleted" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investor Management</h2>
        <Button onClick={() => setEditing(empty)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Investor
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? <div className="p-8 text-center text-muted-foreground">Loading…</div> : <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor Name</TableHead>
                <TableHead>Check Size</TableHead>
                <TableHead>Portfolio</TableHead>
                <TableHead>Investment Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investors.map((investor) => (
                <TableRow key={investor.id}>
                  <TableCell className="font-medium">{investor.name}</TableCell>
                  <TableCell>{investor.check_size || "—"}</TableCell>
                  <TableCell>{investor.portfolio_count ?? 0} startups</TableCell>
                  <TableCell>{investor.stage}</TableCell>
                  <TableCell>
                    <Badge variant={investor.status === "Active" ? "default" : "secondary"}>
                      {investor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setViewing(investor)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditing(investor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => remove(investor.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {investors.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No investors yet.</TableCell></TableRow>}
            </TableBody>
          </Table>}
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent><DialogHeader><DialogTitle>Investor Details</DialogTitle></DialogHeader>{viewing && <div className="space-y-3 text-sm"><p><strong>Name:</strong> {viewing.name}</p><p><strong>Check size:</strong> {viewing.check_size || "—"}</p><p><strong>Stage:</strong> {viewing.stage || "—"}</p><p><strong>Website:</strong> {viewing.website_url || "—"}</p><p className="whitespace-pre-wrap"><strong>Notes:</strong> {viewing.notes || "—"}</p></div>}</DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Investor" : "Add Investor"}</DialogTitle></DialogHeader>
          {editing && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Name *</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><Label>Check size</Label><Input value={editing.check_size ?? ""} onChange={(e) => setEditing({ ...editing, check_size: e.target.value })} /></div>
            <div><Label>Portfolio count</Label><Input type="number" value={editing.portfolio_count ?? 0} onChange={(e) => setEditing({ ...editing, portfolio_count: Number(e.target.value) })} /></div>
            <div><Label>Stage</Label><Input value={editing.stage ?? ""} onChange={(e) => setEditing({ ...editing, stage: e.target.value })} /></div>
            <div><Label>Status</Label><Input value={editing.status ?? "Active"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} /></div>
            <div><Label>Website URL</Label><Input value={editing.website_url ?? ""} onChange={(e) => setEditing({ ...editing, website_url: e.target.value })} /></div>
            <div className="md:col-span-2"><Label>Notes</Label><Textarea rows={3} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
          </div>}
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestorManagement;
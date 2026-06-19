import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Edit, Eye, Plus, Trash2, Check, X } from "lucide-react";
import { logAudit } from "@/lib/audit";

interface ApplicationManagementProps {
  applications: any[];
  onRefresh: () => void;
}

const STAGES = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const ApplicationManagement = ({ applications, onRefresh }: ApplicationManagementProps) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewing, setViewing] = useState<any | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [bulkStage, setBulkStage] = useState<string>("under_review");
  const [bulkNotes, setBulkNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<{ title: string; description: string; action: () => Promise<void> } | null>(null);
  const askConfirm = (title: string, description: string, action: () => Promise<any>) => setConfirm({ title, description, action: async () => { await action(); } });

  const emptyApplication = {
    program: "MVP Lab",
    applicant_name: "",
    email: "",
    phone: "",
    startup_name: "",
    description: "",
    status: "submitted",
    review_notes: "",
  };

  const filtered = useMemo(
    () => (filter === "all" ? applications : applications.filter((a) => a.status === filter)),
    [filter, applications]
  );

  const toggle = (id: string) => {
    setSelected((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const toggleAll = () => {
    setSelected((p) => (p.size === filtered.length ? new Set() : new Set(filtered.map((a) => a.id))));
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    logAudit({ action: "status_change", table: "applications", recordId: id, details: { status } });
    toast({ title: "Status Updated", description: `Marked as ${status}` });
    onRefresh();
  };

  const saveApplication = async () => {
    if (!editing?.applicant_name || !editing?.email || !editing?.program) {
      return toast({ title: "Applicant, email, and program are required", variant: "destructive" });
    }
    setBusy(true);
    const payload = {
      program: editing.program,
      applicant_name: editing.applicant_name,
      email: editing.email,
      phone: editing.phone || null,
      startup_name: editing.startup_name || null,
      description: editing.description || null,
      status: editing.status || "submitted",
      review_notes: editing.review_notes || null,
      reviewed_at: editing.review_notes ? new Date().toISOString() : editing.reviewed_at ?? null,
    };
    const isUpdate = !!editing.id;
    const { error } = isUpdate
      ? await supabase.from("applications").update(payload).eq("id", editing.id)
      : await supabase.from("applications").insert(payload as any);
    setBusy(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    logAudit({ action: isUpdate ? "update" : "create", table: "applications", recordId: editing.id || null, details: { program: editing.program, status: payload.status, has_notes: !!payload.review_notes } });
    if (isUpdate && editing.review_notes) logAudit({ action: "note", table: "applications", recordId: editing.id, details: { note: editing.review_notes } });
    toast({ title: isUpdate ? "Application updated" : "Application created" });
    setEditing(null);
    onRefresh();
  };

  const deleteApplication = async (id: string) => {
    const snapshot = applications.find((a) => a.id === id);
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    logAudit({ action: "delete", table: "applications", recordId: id, details: { snapshot } });
    toast({
      title: "Application deleted",
      action: (snapshot ? (
        <Button size="sm" variant="outline" onClick={async () => {
          const { id: _, created_at, ...rest } = snapshot;
          await supabase.from("applications").insert({ ...rest, id } as any);
          logAudit({ action: "create", table: "applications", recordId: id, details: { restored: true } });
          toast({ title: "Restored" });
          onRefresh();
        }}>Undo</Button>
      ) : undefined) as any,
    });
    onRefresh();
  };

  const bulkDelete = async () => {
    const ids = Array.from(selected);
    const snapshots = applications.filter((a) => ids.includes(a.id));
    const { error } = await supabase.from("applications").delete().in("id", ids);
    if (error) return toast({ title: "Bulk delete failed", description: error.message, variant: "destructive" });
    logAudit({ action: "bulk_delete", table: "applications", details: { count: ids.length, ids } });
    toast({
      title: `${ids.length} application(s) deleted`,
      action: (
        <Button size="sm" variant="outline" onClick={async () => {
          for (const s of snapshots) {
            const { id, created_at, ...rest } = s;
            await supabase.from("applications").insert({ ...rest, id } as any);
          }
          logAudit({ action: "create", table: "applications", details: { restored: snapshots.length } });
          toast({ title: "Restored" });
          onRefresh();
        }}>Undo</Button>
      ) as any,
    });
    setSelected(new Set());
    onRefresh();
  };

  const runBulk = async () => {
    if (selected.size === 0) return toast({ title: "Select at least one application" });
    const ids = Array.from(selected);
    const snapshots = applications.filter((a) => ids.includes(a.id)).map((a) => ({ id: a.id, status: a.status, review_notes: a.review_notes }));
    setBusy(true);
    const payload: any = { status: bulkStage, reviewed_at: new Date().toISOString() };
    if (bulkNotes.trim()) payload.review_notes = bulkNotes.trim();
    const { error } = await supabase.from("applications").update(payload).in("id", ids);
    setBusy(false);
    if (error) return toast({ title: "Bulk update failed", description: error.message, variant: "destructive" });
    logAudit({ action: "bulk_update", table: "applications", details: { count: ids.length, status: bulkStage, has_notes: !!bulkNotes.trim() } });
    if (bulkNotes.trim()) logAudit({ action: "note", table: "applications", details: { count: ids.length, note: bulkNotes.trim() } });
    toast({
      title: "Bulk update complete",
      description: `${ids.length} applications updated`,
      action: (
        <Button size="sm" variant="outline" onClick={async () => {
          for (const s of snapshots) {
            await supabase.from("applications").update({ status: s.status, review_notes: s.review_notes }).eq("id", s.id);
          }
          logAudit({ action: "bulk_update", table: "applications", details: { rollback: true, count: snapshots.length } });
          toast({ title: "Reverted" });
          onRefresh();
        }}>Undo</Button>
      ) as any,
    });
    setSelected(new Set());
    setBulkNotes("");
    onRefresh();
  };

  const allSelected = filtered.length > 0 && selected.size === filtered.length;



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Application Management ({applications.length})</h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => setEditing(emptyApplication)}><Plus className="mr-2 h-4 w-4" />New</Button>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STAGES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
              <SelectItem value="pending">Pending (legacy)</SelectItem>
              <SelectItem value="approved">Approved (legacy)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk actions */}
      <Card className="border-primary/30">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={selected.size ? "default" : "secondary"}>
              {selected.size} selected
            </Badge>
            <Select value={bulkStage} onValueChange={setBulkStage}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>Set to {s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => askConfirm("Apply bulk update?", `Set ${selected.size} application(s) to "${bulkStage}"${bulkNotes.trim() ? " with reviewer notes" : ""}?`, runBulk)} disabled={busy || selected.size === 0}>
              Apply to {selected.size || 0}
            </Button>
            <Button variant="outline" size="sm" disabled={!selected.size} onClick={() => askConfirm("Approve selected?", `Mark ${selected.size} application(s) as accepted?`, async () => { setBulkStage("accepted"); await new Promise(r => setTimeout(r, 0)); await runBulk(); })}>
              <Check className="mr-1 h-4 w-4" />Approve
            </Button>
            <Button variant="outline" size="sm" disabled={!selected.size} onClick={() => askConfirm("Reject selected?", `Mark ${selected.size} application(s) as rejected?`, async () => { setBulkStage("rejected"); await new Promise(r => setTimeout(r, 0)); await runBulk(); })}>
              <X className="mr-1 h-4 w-4" />Reject
            </Button>
            <Button variant="destructive" size="sm" disabled={!selected.size} onClick={() => askConfirm("Delete selected?", `Permanently delete ${selected.size} application(s)? You can undo this from the toast.`, bulkDelete)}>
              <Trash2 className="mr-1 h-4 w-4" />Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())} disabled={selected.size === 0}>
              Clear
            </Button>
          </div>
          <Textarea
            rows={2}
            placeholder="Reviewer notes applied to all selected (optional)"
            value={bulkNotes}
            onChange={(e) => setBulkNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                </TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Startup</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((app) => (
                <TableRow key={app.id} data-state={selected.has(app.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox checked={selected.has(app.id)} onCheckedChange={() => toggle(app.id)} />
                  </TableCell>
                  <TableCell className="font-medium">{app.applicant_name}</TableCell>
                  <TableCell>{app.startup_name || "—"}</TableCell>
                  <TableCell>{app.program}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{format(new Date(app.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={app.status === "accepted" || app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setViewing(app)}><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditing(app)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, "accepted")}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, "rejected")}>Reject</Button>
                      <Button size="icon" variant="ghost" onClick={() => askConfirm("Delete application?", `Permanently delete ${app.applicant_name}'s application? You can undo from the toast.`, () => deleteApplication(app.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No applications found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Application Details</DialogTitle></DialogHeader>
          {viewing && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {Object.entries(viewing).map(([key, value]) => (
              <div key={key} className={key === "description" || key === "review_notes" ? "md:col-span-2" : ""}>
                <p className="text-xs font-medium text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                <p className="break-words whitespace-pre-wrap">{value ? String(value) : "—"}</p>
              </div>
            ))}
          </div>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Application" : "New Application"}</DialogTitle></DialogHeader>
          {editing && <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Applicant *</Label><Input value={editing.applicant_name ?? ""} onChange={(e) => setEditing({ ...editing, applicant_name: e.target.value })} /></div>
              <div><Label>Email *</Label><Input type="email" value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
              <div><Label>Startup</Label><Input value={editing.startup_name ?? ""} onChange={(e) => setEditing({ ...editing, startup_name: e.target.value })} /></div>
              <div><Label>Program *</Label><Input value={editing.program ?? ""} onChange={(e) => setEditing({ ...editing, program: e.target.value })} /></div>
              <div><Label>Status</Label><Select value={editing.status ?? "submitted"} onValueChange={(value) => setEditing({ ...editing, status: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div><Label>Description</Label><Textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <div><Label>Reviewer notes</Label><Textarea rows={3} value={editing.review_notes ?? ""} onChange={(e) => setEditing({ ...editing, review_notes: e.target.value })} /></div>
          </div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveApplication} disabled={busy}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirm?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { const c = confirm; setConfirm(null); await c?.action(); }}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApplicationManagement;

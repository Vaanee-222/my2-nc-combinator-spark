import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { History } from "lucide-react";
import { SkeletonList } from "@/components/dashboard/EmptyState";

const reviewBadge = (s: string) =>
  s === "approved"
    ? "bg-emerald-600/15 text-emerald-500 border border-emerald-600/40"
    : s === "rejected"
    ? "bg-destructive/15 text-destructive border border-destructive/40"
    : "bg-amber-500/15 text-amber-500 border border-amber-500/40";

const CofounderManagement = ({ requests, onRefresh }: { requests: any[]; onRefresh: () => void }) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [reviewFilter, setReviewFilter] = useState("pending");
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Bulk moderation
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<"approved" | "rejected" | null>(null);
  const [bulkNotes, setBulkNotes] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);

  // Audit history
  const [historyFor, setHistoryFor] = useState<any | null>(null);
  const [historyRows, setHistoryRows] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const filtered = requests.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      (reviewFilter === "all" || (r.review_status ?? "pending") === reviewFilter),
  );
  const pendingCount = requests.filter((r) => (r.review_status ?? "pending") === "pending").length;
  const allSelected = filtered.length > 0 && selected.length === filtered.length;

  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((r) => r.id));
  const toggleOne = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const setReview = async (row: any, review_status: "approved" | "rejected" | "pending") => {
    const { error } = await api.cofounders.review(row.id, review_status);
    if (error) return toast({ title: "Error", description: error, variant: "destructive" });
    if (row.contact_email && review_status !== "pending") {
      api.notifications.send({
        event: review_status === "approved" ? "cofounder_approved" : "cofounder_rejected",
        to: row.contact_email,
        recipientName: row.title,
        subjectContext: row.title,
        notes: row.review_notes,
        recordId: row.id,
      });
    }
    toast({
      title: review_status === "approved" ? "Post approved" : review_status === "rejected" ? "Post rejected" : "Moved back to review",
      description:
        review_status === "approved"
          ? "It is now visible on the public Community Posts tab."
          : "It is hidden from the public site.",
    });
    onRefresh();
  };

  const runBulk = async () => {
    if (!bulkAction || selected.length === 0) return;
    setBulkBusy(true);
    const snapshot = requests.filter((r) => selected.includes(r.id)).map((r) => ({ id: r.id, review_status: r.review_status ?? "pending" }));
    const { data, error } = await api.cofounders.bulkReview(selected, bulkAction, bulkNotes.trim() || null);
    setBulkBusy(false);
    if (error) return toast({ title: "Bulk action failed", description: error, variant: "destructive" });

    // Notify each affected poster
    requests
      .filter((r) => selected.includes(r.id) && r.contact_email)
      .forEach((r) =>
        api.notifications.send({
          event: bulkAction === "approved" ? "cofounder_approved" : "cofounder_rejected",
          to: r.contact_email,
          recipientName: r.title,
          subjectContext: r.title,
          notes: bulkNotes.trim() || r.review_notes,
          recordId: r.id,
        }),
      );

    toast({
      title: `${data?.length ?? 0} post(s) ${bulkAction}`,
      description: "Reviewer notes and audit entries were recorded.",
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            for (const s of snapshot) await api.cofounders.review(s.id, s.review_status as any);
            toast({ title: "Bulk action reverted" });
            onRefresh();
          }}
        >
          Undo
        </Button>
      ),
    });
    setBulkAction(null);
    setBulkNotes("");
    setSelected([]);
    onRefresh();
  };

  const openHistory = async (row: any) => {
    setHistoryFor(row);
    setHistoryLoading(true);
    const { data } = await api.audit.history("cofounder_requests", row.id);
    setHistoryRows(data ?? []);
    setHistoryLoading(false);
  };

  const save = async () => {
    if (!editing?.title) return toast({ title: "Title required", variant: "destructive" });
    setSaving(true);
    const payload = {
      title: editing.title,
      skills_needed: editing.skills_needed || null,
      equity_offered: editing.equity_offered || null,
      commitment: editing.commitment || null,
      location: editing.location || null,
      contact_email: editing.contact_email || null,
      description: editing.description || null,
      status: editing.status || "active",
      review_status: editing.review_status || "pending",
      review_notes: editing.review_notes || null,
      reviewed_at: new Date().toISOString(),
    };
    const { error } = await api.cofounders.update(editing.id, payload);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error, variant: "destructive" });
    if (editing.contact_email) {
      api.notifications.send({
        event: "cofounder_updated",
        to: editing.contact_email,
        recipientName: editing.title,
        subjectContext: editing.title,
        notes: editing.review_notes,
        recordId: editing.id,
      });
    }
    toast({ title: "Request updated", description: "Change recorded in the audit log." });
    setEditing(null);
    onRefresh();
  };

  const remove = async () => {
    if (!deleteId) return;
    const { error } = await api.cofounders.remove(deleteId);
    setDeleteId(null);
    if (error) return toast({ title: "Delete failed", description: error, variant: "destructive" });
    toast({ title: "Request deleted" });
    onRefresh();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await api.cofounders.update(id, { status });
    if (error) return toast({ title: "Error", description: error, variant: "destructive" });
    toast({ title: "Status updated", description: `Marked as ${status}` });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Co-founder Review Queue ({requests.length})</h2>
          <p className="text-sm text-muted-foreground">
            {pendingCount} awaiting review. Every approve, reject and edit is written to the admin audit log.
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={reviewFilter} onValueChange={setReviewFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selected.length > 0 && (
        <Card className="border-primary/40">
          <CardContent className="flex flex-wrap items-center gap-3 py-4">
            <span className="text-sm font-medium">{selected.length} selected</span>
            <Button size="sm" onClick={() => setBulkAction("approved")}>Approve Selected</Button>
            <Button size="sm" variant="outline" onClick={() => setBulkAction("rejected")}>Reject Selected</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
          </CardContent>
        </Card>
      )}

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all requests" />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Equity</TableHead>
              <TableHead>Commitment</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Reviewer notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((req) => (
              <TableRow key={req.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(req.id)}
                    onCheckedChange={() => toggleOne(req.id)}
                    aria-label={`Select ${req.title}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{req.title}</TableCell>
                <TableCell className="max-w-[150px] truncate">{req.skills_needed || "—"}</TableCell>
                <TableCell>{req.equity_offered || "—"}</TableCell>
                <TableCell>{req.commitment || "—"}</TableCell>
                <TableCell>{req.contact_email || "—"}</TableCell>
                <TableCell><Badge variant={req.status === "active" ? "default" : "secondary"}>{req.status}</Badge></TableCell>
                <TableCell><Badge className={reviewBadge(req.review_status ?? "pending")}>{req.review_status ?? "pending"}</Badge></TableCell>
                <TableCell className="max-w-[180px] truncate text-xs text-muted-foreground" title={req.review_notes ?? ""}>
                  {req.review_notes || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(req.review_status ?? "pending") !== "approved" && (
                      <Button size="sm" onClick={() => setReview(req, "approved")}>Approve</Button>
                    )}
                    {(req.review_status ?? "pending") !== "rejected" && (
                      <Button size="sm" variant="outline" onClick={() => setReview(req, "rejected")}>Reject</Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setEditing({ ...req })}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => openHistory(req)}>
                      <History className="h-3.5 w-3.5 mr-1" /> History
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(req.id, req.status === "active" ? "closed" : "active")}>
                      {req.status === "active" ? "Close" : "Reopen"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteId(req.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No requests found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>

      {/* Bulk confirmation */}
      <AlertDialog open={!!bulkAction} onOpenChange={(o) => !o && setBulkAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === "approved" ? "Approve" : "Reject"} {selected.length} post(s)?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bulkAction === "approved"
                ? "These posts become publicly visible under Community Posts."
                : "These posts are hidden from the public site."}{" "}
              Posters with a contact email are notified, and the action is logged. You can undo right after.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label>Reviewer notes (applied to all selected)</Label>
            <Textarea rows={3} value={bulkNotes} onChange={(e) => setBulkNotes(e.target.value)} placeholder="Optional note shown in the audit trail and email…" />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={runBulk} disabled={bulkBusy}>
              {bulkBusy ? "Working…" : `Confirm ${bulkAction === "approved" ? "approve" : "reject"}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Audit history */}
      <Dialog open={!!historyFor} onOpenChange={(o) => !o && setHistoryFor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Review history — {historyFor?.title}</DialogTitle></DialogHeader>
          {historyLoading ? (
            <SkeletonList count={3} />
          ) : historyRows.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No recorded actions yet for this post.</p>
          ) : (
            <div className="max-h-[420px] overflow-y-auto space-y-3">
              {historyRows.map((h) => (
                <div key={h.id} className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <Badge variant={h.action_type?.includes("delete") ? "destructive" : "secondary"}>{h.action_type}</Badge>
                    <span className="text-muted-foreground">{format(new Date(h.created_at), "MMM d, yyyy HH:mm")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{h.admin_email || h.admin_user_id}</p>
                  {h.details?.review_status && (
                    <p className="text-sm mt-2">Review status → <b>{h.details.review_status}</b></p>
                  )}
                  {h.details?.review_notes && (
                    <p className="text-sm mt-1 border-l-2 border-primary pl-2">{h.details.review_notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Co-founder Request</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Title *</Label><Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Skills Needed</Label><Input value={editing.skills_needed ?? ""} onChange={(e) => setEditing({ ...editing, skills_needed: e.target.value })} /></div>
                <div><Label>Equity Offered</Label><Input value={editing.equity_offered ?? ""} onChange={(e) => setEditing({ ...editing, equity_offered: e.target.value })} /></div>
                <div><Label>Commitment</Label><Input value={editing.commitment ?? ""} onChange={(e) => setEditing({ ...editing, commitment: e.target.value })} /></div>
                <div><Label>Location</Label><Input value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></div>
                <div><Label>Contact Email</Label><Input value={editing.contact_email ?? ""} onChange={(e) => setEditing({ ...editing, contact_email: e.target.value })} /></div>
                <div><Label>Status</Label><Input value={editing.status ?? "active"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} /></div>
                <div>
                  <Label>Review Status</Label>
                  <Select value={editing.review_status ?? "pending"} onValueChange={(v) => setEditing({ ...editing, review_status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved (public)</SelectItem>
                      <SelectItem value="rejected">Rejected (hidden)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Reviewer Notes</Label><Textarea rows={3} value={editing.review_notes ?? ""} onChange={(e) => setEditing({ ...editing, review_notes: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this request?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. It will be recorded in the audit log.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CofounderManagement;

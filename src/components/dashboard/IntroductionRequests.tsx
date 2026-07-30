import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/lib/api";

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-500 border border-amber-500/40",
  approved: "bg-emerald-600/15 text-emerald-500 border border-emerald-600/40",
  rejected: "bg-destructive/15 text-destructive border border-destructive/40",
};

const IntroductionRequests = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [filter, setFilter] = useState("pending");
  const [notesFor, setNotesFor] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("introduction_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  const setStatus = async (row: any, status: "approved" | "rejected" | "pending") => {
    const { error } = await api.introductions.setStatus(row, status);
    if (error) return toast({ title: "Update failed", description: error, variant: "destructive" });
    toast({
      title: `Request ${status}`,
      description: row.contact_email && status !== "pending" ? `Notification email sent to ${row.contact_email}.` : undefined,
    });
    load();
  };

  const saveNotes = async () => {
    if (!notesFor) return;
    setSaving(true);
    const { error } = await api.introductions.setNotes(notesFor, notesFor.admin_notes || null);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error, variant: "destructive" });
    setNotesFor(null);
    toast({ title: "Notes saved", description: "Requester notified and change recorded in the audit log." });
    load();
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Introduction Requests ({rows.length})</h2>
          <p className="text-sm text-muted-foreground">
            {rows.filter((r) => r.status === "pending").length} pending. Founders see this status on the investor pages.
          </p>
        </div>
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
              <TableHead>Investor</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Startup</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.investor_name}</TableCell>
                <TableCell>{r.requester_name}</TableCell>
                <TableCell>{r.contact_email}</TableCell>
                <TableCell>{r.startup_name || "—"}</TableCell>
                <TableCell className="max-w-[260px] truncate" title={r.message}>{r.message}</TableCell>
                <TableCell><Badge className={STATUS_CLASS[r.status]}>{r.status}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {r.status !== "approved" && <Button size="sm" onClick={() => setStatus(r, "approved")}>Approve</Button>}
                    {r.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => setStatus(r, "rejected")}>Reject</Button>}
                    <Button size="sm" variant="outline" onClick={() => setNotesFor({ ...r })}>Notes</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No introduction requests found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={!!notesFor} onOpenChange={(o) => !o && setNotesFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reviewer notes</DialogTitle></DialogHeader>
          {notesFor && (
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea rows={4} value={notesFor.admin_notes ?? ""} onChange={(e) => setNotesFor({ ...notesFor, admin_notes: e.target.value })} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesFor(null)}>Cancel</Button>
            <Button onClick={saveNotes} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntroductionRequests;

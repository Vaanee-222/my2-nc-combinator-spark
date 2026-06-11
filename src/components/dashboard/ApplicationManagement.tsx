import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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
  const [bulkStage, setBulkStage] = useState<string>("under_review");
  const [bulkNotes, setBulkNotes] = useState("");
  const [busy, setBusy] = useState(false);

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
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Status Updated", description: `Marked as ${status}` });
    onRefresh();
  };

  const runBulk = async () => {
    if (selected.size === 0) return toast({ title: "Select at least one application" });
    setBusy(true);
    const payload: any = { status: bulkStage, reviewed_at: new Date().toISOString() };
    if (bulkNotes.trim()) payload.review_notes = bulkNotes.trim();
    const { error } = await supabase.from("applications").update(payload).in("id", Array.from(selected));
    setBusy(false);
    if (error) return toast({ title: "Bulk update failed", description: error.message, variant: "destructive" });
    toast({ title: "Bulk update complete", description: `${selected.size} applications updated` });
    setSelected(new Set());
    setBulkNotes("");
    onRefresh();
  };

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Application Management ({applications.length})</h2>
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
            <Button onClick={runBulk} disabled={busy || selected.size === 0}>
              Apply to {selected.size || 0}
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
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, "accepted")}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, "rejected")}>Reject</Button>
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
    </div>
  );
};

export default ApplicationManagement;

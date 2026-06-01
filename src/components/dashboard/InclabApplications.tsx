import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent } from "@/lib/analytics";
import { Eye } from "lucide-react";

type InclabApp = any;

const STATUSES = ["pending", "under_review", "accepted", "rejected"] as const;

const InclabApplications = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [apps, setApps] = useState<InclabApp[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<InclabApp | null>(null);
  const [notes, setNotes] = useState("");

  const fetchApps = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("inclab_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setApps(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  const updateStatus = async (id: string, status: string, admin_notes?: string) => {
    const { error } = await (supabase as any).from("inclab_applications").update({
      status, admin_notes: admin_notes ?? undefined, reviewed_by: user?.id, reviewed_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    trackEvent("application_status_changed", { program: "INClab", new_status: status });
    toast({ title: "Updated", description: `Application marked ${status}` });
    setSelected(null);
    fetchApps();
  };

  const statusVariant = (s: string): any =>
    s === "accepted" ? "default" : s === "rejected" ? "destructive" : s === "under_review" ? "secondary" : "outline";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">INC Lab Applications ({apps.length})</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Founder</TableHead><TableHead>Startup</TableHead><TableHead>Industry</TableHead>
            <TableHead>Stage</TableHead><TableHead>Funding</TableHead><TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead><TableHead>Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
            {!loading && filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.founder_name}</TableCell>
                <TableCell>{a.startup_name || "—"}</TableCell>
                <TableCell>{a.industry || "—"}</TableCell>
                <TableCell>{a.stage || "—"}</TableCell>
                <TableCell>{a.funding_ask || "—"}</TableCell>
                <TableCell><Badge variant={statusVariant(a.status)}>{a.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => { setSelected(a); setNotes(a.admin_notes || ""); }}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No applications.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Application Review</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Founder" value={selected.founder_name} />
                <Field label="Email" value={selected.email} />
                <Field label="Phone" value={selected.phone} />
                <Field label="Startup" value={selected.startup_name} />
                <Field label="Industry" value={selected.industry} />
                <Field label="Stage" value={selected.stage} />
                <Field label="Team Size" value={selected.team_size} />
                <Field label="Funding Ask" value={selected.funding_ask} />
              </div>
              <Field label="Problem" value={selected.problem} multiline />
              <Field label="Solution" value={selected.solution} multiline />
              <Field label="Market" value={selected.market} multiline />
              <Field label="Traction" value={selected.traction} multiline />
              <Field label="Why INC Lab" value={selected.why_inclab} multiline />
              {selected.pitch_deck_url && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Pitch Deck</div>
                  <a href={selected.pitch_deck_url} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">{selected.pitch_deck_url}</a>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t">
                <div className="text-xs font-medium text-muted-foreground">Admin Notes</div>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Internal notes…" />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {STATUSES.map((s) => (
                  <Button key={s} size="sm" variant={selected.status === s ? "default" : "outline"} onClick={() => updateStatus(selected.id, s, notes)}>
                    Mark {s.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Field = ({ label, value, multiline }: { label: string; value?: string | null; multiline?: boolean }) => (
  <div>
    <div className="text-xs font-medium text-muted-foreground mb-1">{label}</div>
    <div className={multiline ? "whitespace-pre-wrap" : ""}>{value || <span className="text-muted-foreground">—</span>}</div>
  </div>
);

export default InclabApplications;

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Sparkles, Trash2, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAudit } from "@/lib/audit";
import { EVENT_LABELS } from "@/hooks/useGamification";
import { EmptyState } from "@/components/dashboard/EmptyState";

type Member = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  total_points: number;
  level: number;
  level_name: string;
};

type Event = {
  id: string;
  event_key: string;
  points: number;
  source_table: string | null;
  source_id: string | null;
  awarded_at: string;
};

/** Admin points editor: manual grants/deductions and voiding individual ledger entries. */
const PointsAdmin = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [voidTarget, setVoidTarget] = useState<Event | null>(null);

  const members = useQuery({
    queryKey: ["admin-points-directory", query],
    queryFn: async (): Promise<Member[]> => {
      const { data, error } = await supabase.rpc("admin_points_directory", { _search: query || null, _limit: 100 });
      if (error) throw error;
      return (data ?? []) as Member[];
    },
  });

  const events = useQuery({
    queryKey: ["admin-point-events", selected?.user_id],
    enabled: !!selected?.user_id,
    queryFn: async (): Promise<Event[]> => {
      const { data, error } = await supabase
        .from("point_events")
        .select("id, event_key, points, source_table, source_id, awarded_at")
        .eq("user_id", selected!.user_id)
        .order("awarded_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-points-directory"] });
    qc.invalidateQueries({ queryKey: ["admin-point-events"] });
    qc.invalidateQueries({ queryKey: ["leaderboard"] });
  };

  const adjust = async (sign: 1 | -1) => {
    if (!selected) return;
    const value = Math.abs(parseInt(amount, 10));
    if (!value) {
      toast({ title: "Enter an amount", description: "Points must be a non-zero number.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.rpc("admin_adjust_points", {
      _user_id: selected.user_id,
      _points: sign * value,
      _reason: reason || "manual adjustment",
    });
    setSaving(false);
    if (error) {
      toast({ title: "Adjustment failed", description: error.message, variant: "destructive" });
      return;
    }
    await logAudit({
      action: "update",
      table: "point_events",
      recordId: selected.user_id,
      details: { adjustment: sign * value, reason, member: selected.email ?? selected.full_name },
    });
    toast({ title: "Points updated", description: `${sign > 0 ? "+" : "-"}${value} XP for ${selected.full_name ?? "member"}.` });
    setAmount("");
    setReason("");
    refresh();
  };

  const voidEvent = async () => {
    if (!voidTarget || !selected) return;
    const { error } = await supabase.rpc("admin_void_point_event", { _event_id: voidTarget.id });
    if (error) {
      toast({ title: "Could not void entry", description: error.message, variant: "destructive" });
      return;
    }
    await logAudit({
      action: "delete",
      table: "point_events",
      recordId: voidTarget.id,
      details: { event_key: voidTarget.event_key, points: voidTarget.points, member: selected.email ?? selected.full_name },
    });
    toast({ title: "Entry voided", description: "Totals and level recalculated." });
    setVoidTarget(null);
    refresh();
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Points & Levels
          </CardTitle>
          <CardDescription>Grant or deduct XP, void ledger entries. Every change is written to the audit log.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="flex flex-wrap gap-2"
            onSubmit={(e) => { e.preventDefault(); setQuery(search.trim()); }}
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="max-w-sm"
            />
            <Button type="submit" variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>

          {members.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (members.data ?? []).length === 0 ? (
            <EmptyState icon={Sparkles} title="No members found" description="Try a different name or email." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">XP</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(members.data ?? []).map((m) => (
                    <TableRow key={m.user_id}>
                      <TableCell>
                        <p className="font-medium">{m.full_name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </TableCell>
                      <TableCell className="capitalize">{m.role}</TableCell>
                      <TableCell className="text-right font-medium text-primary">{m.total_points.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">L{m.level} {m.level_name}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelected(m)}>Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.full_name ?? "Member"} — {selected?.total_points.toLocaleString()} XP</DialogTitle>
            <DialogDescription>{selected?.email}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pts-amount">Points</Label>
                <Input id="pts-amount" type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="50" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pts-reason">Reason</Label>
                <Input id="pts-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Demo day contribution" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => adjust(1)} disabled={saving}>
                <Plus className="mr-2 h-4 w-4" />
                Grant XP
              </Button>
              <Button variant="outline" onClick={() => adjust(-1)} disabled={saving}>
                <Minus className="mr-2 h-4 w-4" />
                Deduct XP
              </Button>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Ledger</p>
              {events.isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (events.data ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No point events yet.</p>
              ) : (
                <div className="space-y-2">
                  {(events.data ?? []).map((e) => (
                    <div key={e.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{EVENT_LABELS[e.event_key] ?? e.event_key}</p>
                        <p className="text-xs text-muted-foreground">{new Date(e.awarded_at).toLocaleString()}</p>
                      </div>
                      <Badge variant={e.points >= 0 ? "secondary" : "destructive"}>{e.points > 0 ? "+" : ""}{e.points} XP</Badge>
                      <Button size="icon" variant="ghost" onClick={() => setVoidTarget(e)} aria-label="Void entry">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!voidTarget} onOpenChange={(o) => !o && setVoidTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Void this point entry?</AlertDialogTitle>
            <AlertDialogDescription>
              {voidTarget?.points} XP will be removed and the member's total and level recalculated. This is logged in the audit trail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={voidEvent}>Void entry</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PointsAdmin;

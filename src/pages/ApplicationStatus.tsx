import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { FileText, ShieldCheck } from "lucide-react";

const STAGES = ["submitted", "under_review", "shortlisted", "accepted", "rejected"] as const;
type Stage = typeof STAGES[number];

const LABEL: Record<Stage, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  accepted: "Accepted",
  rejected: "Rejected",
};

// Map legacy values
const normalize = (s: string | null): Stage => {
  const v = (s ?? "submitted").toLowerCase();
  if (v === "pending") return "submitted";
  if (v === "approved") return "accepted";
  if ((STAGES as readonly string[]).includes(v)) return v as Stage;
  return "submitted";
};

const PROGRESS: Record<Stage, number> = {
  submitted: 20, under_review: 50, shortlisted: 75, accepted: 100, rejected: 100,
};

const variantFor = (s: Stage) =>
  s === "accepted" ? "default" : s === "rejected" ? "destructive" : "secondary";

const ApplicationStatusPage = () => {
  const { user, userRole } = useAuth() as any;
  const isAdmin = userRole === "admin";
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Stage>("all");
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const q = supabase.from("applications").select("*").order("created_at", { ascending: false });
    const { data } = await q;
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user, isAdmin]);

  const visible = useMemo(() => {
    let out = rows;
    if (filter !== "all") out = out.filter((r) => normalize(r.status) === filter);
    return out;
  }, [rows, filter]);

  const updateStatus = async (id: string, status: Stage) => {
    const payload: any = { status, reviewed_at: new Date().toISOString() };
    if (reviewNotes[id]) payload.review_notes = reviewNotes[id];
    const { error } = await supabase.from("applications").update(payload).eq("id", id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    toast({ title: `Marked as ${LABEL[status]}` });
    load();
  };

  // Applicant summary view: latest application
  const myLatest = rows[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Application Status
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Review and progress applications through the pipeline." : "Track your Xi Combinator applications."}
          </p>
        </div>

        {!user ? (
          <Card><CardContent className="py-10 text-center text-muted-foreground">Please sign in to view your applications.</CardContent></Card>
        ) : (
          <>
            {!isAdmin && myLatest && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {myLatest.program}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Submitted on {format(new Date(myLatest.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge variant={variantFor(normalize(myLatest.status)) as any}>
                      {LABEL[normalize(myLatest.status)]}
                    </Badge>
                  </div>
                  <Progress value={PROGRESS[normalize(myLatest.status)]} className="h-2" />
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                    {STAGES.map((s) => {
                      const current = normalize(myLatest.status);
                      const idx = STAGES.indexOf(s);
                      const currIdx = STAGES.indexOf(current);
                      const reached = s === "rejected" ? current === "rejected" : idx <= currIdx && current !== "rejected";
                      return (
                        <div key={s} className={`p-3 rounded-lg border ${reached ? "border-primary/40 bg-primary/5" : "opacity-50"}`}>
                          <p className="text-xs font-medium">{LABEL[s]}</p>
                        </div>
                      );
                    })}
                  </div>
                  {myLatest.review_notes && (
                    <div className="rounded-lg bg-muted/50 p-3 text-sm">
                      <p className="font-medium mb-1">Reviewer notes</p>
                      <p className="text-muted-foreground whitespace-pre-line">{myLatest.review_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {isAdmin && <ShieldCheck className="h-5 w-5 text-primary" />}
                  {isAdmin ? `All Applications (${rows.length})` : "Your Applications"}
                </CardTitle>
                <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stages</SelectItem>
                    {STAGES.map((s) => <SelectItem key={s} value={s}>{LABEL[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading…</div>
                ) : visible.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No applications.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Stage</TableHead>
                        {isAdmin && <TableHead>Update</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visible.map((app) => {
                        const stage = normalize(app.status);
                        return (
                          <TableRow key={app.id}>
                            <TableCell>
                              <div className="font-medium">{app.applicant_name}</div>
                              <div className="text-xs text-muted-foreground">{app.email}</div>
                            </TableCell>
                            <TableCell>
                              <div>{app.program}</div>
                              {app.startup_name && <div className="text-xs text-muted-foreground">{app.startup_name}</div>}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(app.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              <Badge variant={variantFor(stage) as any}>{LABEL[stage]}</Badge>
                            </TableCell>
                            {isAdmin && (
                              <TableCell>
                                <div className="space-y-2 min-w-[220px]">
                                  <Textarea
                                    placeholder="Reviewer notes (optional)"
                                    rows={2}
                                    value={reviewNotes[app.id] ?? app.review_notes ?? ""}
                                    onChange={(e) => setReviewNotes((p) => ({ ...p, [app.id]: e.target.value }))}
                                  />
                                  <div className="flex flex-wrap gap-1">
                                    {STAGES.map((s) => (
                                      <Button key={s} size="sm" variant={stage === s ? "default" : "outline"} onClick={() => updateStatus(app.id, s)}>
                                        {LABEL[s]}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ApplicationStatusPage;

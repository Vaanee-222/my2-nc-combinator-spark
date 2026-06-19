import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { logAudit } from "@/lib/audit";
import { friendlyAuthError } from "@/lib/authErrors";

const STAGES = ["submitted", "under_review", "shortlisted", "accepted", "rejected"];

const AdminWorkflow = () => {
  const { toast } = useToast();
  const { userRole } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1 — Validate registration / find user
  const [email, setEmail] = useState("");
  const [matchedProfile, setMatchedProfile] = useState<any | null>(null);

  // Step 2 — Create application
  const [program, setProgram] = useState("MVP Lab");
  const [applicantName, setApplicantName] = useState("");
  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [createdApp, setCreatedApp] = useState<any | null>(null);

  // Step 3 — Stage update & notes
  const [stage, setStage] = useState("under_review");
  const [notes, setNotes] = useState("");

  // Step 4 — recent audit entries for this record
  const [audit, setAudit] = useState<any[]>([]);

  useEffect(() => {
    if (!createdApp?.id) return;
    supabase.from("admin_audit_log").select("*").eq("record_id", createdApp.id).order("created_at", { ascending: false }).then(({ data }) => setAudit(data ?? []));
  }, [createdApp?.id, step]);

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  const validateRegistration = async () => {
    if (!email) return toast({ title: "Enter an email", variant: "destructive" });
    const { data, error } = await supabase.from("profiles").select("*").eq("email", email.trim().toLowerCase()).maybeSingle();
    if (error) return toast({ title: "Lookup failed", description: friendlyAuthError(error), variant: "destructive" });
    setMatchedProfile(data);
    if (data) {
      setApplicantName(data.full_name || "");
      toast({ title: "Registration found", description: data.full_name || data.email });
      setStep(2);
    } else {
      toast({ title: "No registered user with that email", variant: "destructive" });
    }
  };

  const submitApplication = async () => {
    if (!applicantName || !program) return toast({ title: "Name and program are required", variant: "destructive" });
    const payload = {
      program,
      applicant_name: applicantName,
      email,
      startup_name: startupName || null,
      description: description || null,
      status: "submitted",
    } as any;
    const { data, error } = await supabase.from("applications").insert(payload).select().single();
    if (error) return toast({ title: "Submit failed", description: error.message, variant: "destructive" });
    setCreatedApp(data);
    logAudit({ action: "create", table: "applications", recordId: data.id, details: { program, applicant_name: applicantName } });
    toast({ title: "Application submitted", description: `ID: ${data.id.slice(0, 8)}` });
    setStep(3);
  };

  const updateStage = async () => {
    if (!createdApp) return;
    const payload: any = { status: stage, reviewed_at: new Date().toISOString() };
    if (notes.trim()) payload.review_notes = notes.trim();
    const { error } = await supabase.from("applications").update(payload).eq("id", createdApp.id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    logAudit({ action: "status_change", table: "applications", recordId: createdApp.id, details: { stage, notes: notes || null } });
    if (notes.trim()) logAudit({ action: "note", table: "applications", recordId: createdApp.id, details: { note: notes.trim() } });
    toast({ title: "Stage updated", description: `Marked as ${stage}` });
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">End-to-End Admin Workflow</h1>
          <p className="text-muted-foreground">Validate a registration → submit application → update stage → review audit trail.</p>
        </div>

        <div className="flex items-center justify-between mb-8 text-xs">
          {["Validate", "Submit", "Stage & Notes", "Audit"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold ${step > i ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {step > i + 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={step === i + 1 ? "font-medium" : "text-muted-foreground"}>{label}</span>
              {i < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader><CardTitle>1. Validate registration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>User email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="founder@startup.com" /></div>
              <Button onClick={validateRegistration}>Validate</Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader><CardTitle>2. Submit application</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {matchedProfile && <Badge variant="secondary">Verified: {matchedProfile.email}</Badge>}
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Applicant name</Label><Input value={applicantName} onChange={(e) => setApplicantName(e.target.value)} /></div>
                <div><Label>Program</Label><Select value={program} onValueChange={setProgram}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["MVP Lab", "Xi Lab", "Incubation", "Hackathon"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                <div className="col-span-2"><Label>Startup name</Label><Input value={startupName} onChange={(e) => setStartupName(e.target.value)} /></div>
                <div className="col-span-2"><Label>Description</Label><Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={submitApplication}>Submit application</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && createdApp && (
          <Card>
            <CardHeader><CardTitle>3. Update stage & reviewer notes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Stage</Label><Select value={stage} onValueChange={setStage}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Reviewer notes</Label><Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={updateStage}>Update stage</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && createdApp && (
          <Card>
            <CardHeader><CardTitle>4. Audit trail for this record</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Application ID: <code>{createdApp.id}</code></p>
              {audit.length === 0 && <p className="text-sm text-muted-foreground">No audit events recorded yet.</p>}
              {audit.map((a) => (
                <div key={a.id} className="border rounded-md p-3 text-sm">
                  <div className="flex justify-between mb-1"><Badge>{a.action_type}</Badge><span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span></div>
                  <p className="text-xs text-muted-foreground">{a.admin_email}</p>
                  {a.details && <pre className="text-xs mt-1 whitespace-pre-wrap">{JSON.stringify(a.details, null, 2)}</pre>}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => { setStep(1); setEmail(""); setMatchedProfile(null); setCreatedApp(null); setNotes(""); setStartupName(""); setDescription(""); }}>Start new workflow</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminWorkflow;

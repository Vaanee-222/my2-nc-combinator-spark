import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { z } from "zod";

const schema = z.object({
  founder_name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  startup_name: z.string().trim().max(150).optional().or(z.literal("")),
  stage: z.string().optional(),
  industry: z.string().trim().max(100).optional().or(z.literal("")),
  team_size: z.string().optional(),
  problem: z.string().trim().min(20, "Please describe the problem (min 20 chars)").max(2000),
  solution: z.string().trim().min(20, "Please describe the solution").max(2000),
  market: z.string().trim().min(10).max(2000),
  traction: z.string().trim().max(2000).optional().or(z.literal("")),
  funding_ask: z.string().trim().max(100).optional().or(z.literal("")),
  why_inclab: z.string().trim().min(20, "Tell us why Xi Lab").max(2000),
  pitch_deck_url: z.string().trim().url("Must be a valid URL").max(500).optional().or(z.literal("")),
});

interface Props {
  children: React.ReactNode;
  title?: string;
}

const InclabApplicationDialog = ({ children, title = "Apply to Xi Lab" }: Props) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    founder_name: "", email: "", phone: "", startup_name: "",
    stage: "", industry: "", team_size: "",
    problem: "", solution: "", market: "", traction: "",
    funding_ask: "", why_inclab: "", pitch_deck_url: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please log in", description: "You need an account to submit.", variant: "destructive" });
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast({ title: "Validation error", description: first.message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const payload: any = {
        user_id: user.id,
        ...parsed.data,
        phone: parsed.data.phone || null,
        startup_name: parsed.data.startup_name || null,
        stage: parsed.data.stage || null,
        industry: parsed.data.industry || null,
        team_size: parsed.data.team_size || null,
        traction: parsed.data.traction || null,
        funding_ask: parsed.data.funding_ask || null,
        pitch_deck_url: parsed.data.pitch_deck_url || null,
        status: "pending",
      };
      const { error } = await (supabase as any).from("inclab_applications").insert(payload);
      if (error) throw error;
      trackEvent("application_submitted", { program: "Xi Lab", startup_name: parsed.data.startup_name || "" });
      toast({ title: "Application submitted! 🚀", description: "Our team will review and get back within 1-2 weeks." });
      setOpen(false);
      setForm({ founder_name: "", email: "", phone: "", startup_name: "", stage: "", industry: "", team_size: "", problem: "", solution: "", market: "", traction: "", funding_ask: "", why_inclab: "", pitch_deck_url: "" });
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            India's most selective accelerator. Tell us about your startup — our team reviews every application within 1-2 weeks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Founder Name *</Label><Input value={form.founder_name} onChange={(e) => set("founder_name", e.target.value)} required /></div>
            <div className="space-y-2"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div className="space-y-2"><Label>Startup Name</Label><Input value={form.startup_name} onChange={(e) => set("startup_name", e.target.value)} /></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Stage</Label>
              <Select value={form.stage} onValueChange={(v) => set("stage", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="mvp">MVP</SelectItem>
                  <SelectItem value="early-traction">Early Traction</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Industry</Label><Input value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="e.g. FinTech" /></div>
            <div className="space-y-2">
              <Label>Team Size</Label>
              <Select value={form.team_size} onValueChange={(v) => set("team_size", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="2-3">2-3</SelectItem>
                  <SelectItem value="4-10">4-10</SelectItem>
                  <SelectItem value="10+">10+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2"><Label>Problem you're solving *</Label><Textarea rows={3} value={form.problem} onChange={(e) => set("problem", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Your solution *</Label><Textarea rows={3} value={form.solution} onChange={(e) => set("solution", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Target market *</Label><Textarea rows={2} value={form.market} onChange={(e) => set("market", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Current traction</Label><Textarea rows={2} value={form.traction} onChange={(e) => set("traction", e.target.value)} placeholder="Users, revenue, partnerships…" /></div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Funding Ask</Label><Input value={form.funding_ask} onChange={(e) => set("funding_ask", e.target.value)} placeholder="e.g. $50L" /></div>
            <div className="space-y-2"><Label>Pitch Deck URL</Label><Input value={form.pitch_deck_url} onChange={(e) => set("pitch_deck_url", e.target.value)} placeholder="https://…" /></div>
          </div>

          <div className="space-y-2"><Label>Why Xi Lab? *</Label><Textarea rows={3} value={form.why_inclab} onChange={(e) => set("why_inclab", e.target.value)} required /></div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="hero" className="flex-1" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Application"}
            </Button>
          </div>
          {!user && <p className="text-sm text-destructive text-center">You must be logged in to submit.</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InclabApplicationDialog;

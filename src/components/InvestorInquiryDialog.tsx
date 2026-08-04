import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { markCta, useCtaState } from "@/hooks/useCtaState";
import { Check, ShieldCheck } from "lucide-react";

interface InvestorInquiryDialogProps {
  children: React.ReactNode;
  startupName: string;
}

const INVESTOR_TYPES = ["Angel", "Syndicate", "Micro VC", "Venture Capital", "Family Office", "Corporate / Strategic"];
const TICKET_SIZES = ["Under $25K", "$25K - $100K", "$100K - $500K", "$500K - $2M", "$2M+"];
const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B+"];
const INSTRUMENTS = ["SAFE", "Convertible Note", "Priced Equity", "Secondary"];
const TIMELINES = ["Immediate", "1-3 months", "3-6 months", "Exploratory"];

const emptyForm = {
  investorName: "",
  email: "",
  phone: "",
  firm: "",
  investorType: "",
  ticketSize: "",
  stagePreference: "",
  instrument: "",
  timeline: "",
  profileUrl: "",
  message: "",
};

/**
 * Investor-side inquiry form. Collects only information relevant to an
 * investor expressing interest in a startup — no pitch decks or founder data.
 * A live summary panel shows exactly what will be shared before submitting.
 */
const InvestorInquiryDialog = ({ children, startupName }: InvestorInquiryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "review">("form");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const ctaKey = `invest:${startupName}`;
  const { acted } = useCtaState(ctaKey);
  const [form, setForm] = useState(emptyForm);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const summary = useMemo(
    () => [
      { label: "Your name", value: form.investorName, required: true },
      { label: "Fund / firm", value: form.firm || "Individual investor" },
      { label: "Work email", value: form.email, required: true },
      { label: "Phone", value: form.phone },
      { label: "Investor type", value: form.investorType, required: true },
      { label: "Typical ticket size", value: form.ticketSize, required: true },
      { label: "Stage preference", value: form.stagePreference },
      { label: "Preferred instrument", value: form.instrument },
      { label: "Decision timeline", value: form.timeline },
      { label: "LinkedIn / fund website", value: form.profileUrl },
      { label: "Message to founders", value: form.message },
    ],
    [form],
  );

  const missing = summary.filter((f) => f.required && !f.value.trim()).map((f) => f.label);

  const goReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please log in", description: "You need an account to send an investment inquiry.", variant: "destructive" });
      return;
    }
    if (missing.length) {
      toast({ title: "Missing details", description: `Please provide: ${missing.join(", ")}`, variant: "destructive" });
      return;
    }
    setStep("review");
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("investor_inquiries").insert({
        user_id: user.id,
        startup_name: startupName,
        investor_name: form.investorName,
        email: form.email,
        phone: form.phone || null,
        firm: form.firm || null,
        investor_type: form.investorType,
        ticket_size: form.ticketSize,
        stage_preference: form.stagePreference || null,
        instrument: form.instrument || null,
        timeline: form.timeline || null,
        profile_url: form.profileUrl || null,
        message: form.message || null,
      });
      if (error) throw error;

      trackEvent("investment_inquiry_submitted", { startup_name: startupName });
      markCta(ctaKey);
      toast({ title: "Inquiry sent", description: `Your investment interest in ${startupName} has been shared with the team.` });
      setOpen(false);
      setStep("form");
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setStep("form"); }}>
      <DialogTrigger asChild disabled={acted}>
        {acted ? (
          <button
            type="button"
            disabled
            aria-pressed="true"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-600/40 bg-emerald-600/15 px-4 py-2 text-sm font-semibold text-emerald-500 cursor-default"
          >
            <Check className="h-4 w-4" /> Interest Sent
          </button>
        ) : (
          children
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90dvh] flex flex-col overflow-hidden p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border shrink-0">
          <DialogTitle>Investment Inquiry — {startupName}</DialogTitle>
          <DialogDescription>
            Investor-only details. We never ask investors for pitch decks or document uploads.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          {step === "form" ? (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
              <form onSubmit={goReview} className="space-y-4" id="investor-inquiry-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investorName">Your Name *</Label>
                    <Input id="investorName" value={form.investorName} onChange={(e) => set("investorName", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firm">Fund / Firm</Label>
                    <Input id="firm" placeholder="e.g., Lightspeed, or Individual" value={form.firm} onChange={(e) => set("firm", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email *</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Investor Type *</Label>
                    <Select value={form.investorType} onValueChange={(v) => set("investorType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {INVESTOR_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Typical Ticket Size *</Label>
                    <Select value={form.ticketSize} onValueChange={(v) => set("ticketSize", v)}>
                      <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                      <SelectContent>
                        {TICKET_SIZES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Stage Preference</Label>
                    <Select value={form.stagePreference} onValueChange={(v) => set("stagePreference", v)}>
                      <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                      <SelectContent>
                        {STAGES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Instrument</Label>
                    <Select value={form.instrument} onValueChange={(v) => set("instrument", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {INSTRUMENTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Decision Timeline</Label>
                    <Select value={form.timeline} onValueChange={(v) => set("timeline", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {TIMELINES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileUrl">LinkedIn / Fund Website</Label>
                  <Input id="profileUrl" placeholder="https://" value={form.profileUrl} onChange={(e) => set("profileUrl", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message to the Founders</Label>
                  <Textarea
                    id="message"
                    className="min-h-[100px]"
                    placeholder="What interests you about this company, and what would you like to see next?"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                </div>

                {!user && <p className="text-sm text-destructive">You must be logged in to send an inquiry.</p>}
              </form>

              {/* Live summary */}
              <aside className="rounded-lg border border-border bg-muted/30 p-4 h-fit lg:sticky lg:top-0 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">What you'll share</h3>
                </div>
                <ul className="space-y-2">
                  {summary.map((f) => (
                    <li key={f.label} className="text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">{f.label}{f.required && " *"}</span>
                        {f.value.trim() ? (
                          <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                        ) : (
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">empty</span>
                        )}
                      </div>
                      {f.value.trim() && <p className="font-medium break-words line-clamp-2">{f.value}</p>}
                    </li>
                  ))}
                </ul>
                <Badge variant="outline" className="w-full justify-center border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                  No pitch deck required
                </Badge>
              </aside>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review your inquiry for <span className="font-medium text-foreground">{startupName}</span>. Nothing is sent until you confirm.
              </p>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {summary.filter((f) => f.value.trim()).map((f) => (
                  <div key={f.label} className="rounded-md border border-border p-3">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</dt>
                    <dd className="text-sm font-medium break-words">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-muted-foreground">
                Investor inquiries collect investor-relevant details only — no pitch decks, files or founder documents are requested or accepted.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-border shrink-0">
          {step === "form" ? (
            <>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" form="investor-inquiry-form">Review Inquiry</Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={() => setStep("form")}>Back to edit</Button>
              <Button type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Sending..." : "Confirm & Send"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestorInquiryDialog;

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { markCta, useCtaState } from "@/hooks/useCtaState";
import { Check } from "lucide-react";

interface InvestorInquiryDialogProps {
  children: React.ReactNode;
  startupName: string;
}

/**
 * Investor-side inquiry form. Collects only information relevant to an
 * investor expressing interest in a startup — no pitch decks or founder data.
 */
const InvestorInquiryDialog = ({ children, startupName }: InvestorInquiryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const ctaKey = `invest:${startupName}`;
  const { acted } = useCtaState(ctaKey);

  const [form, setForm] = useState({
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
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please log in", description: "You need an account to send an investment inquiry.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("applications").insert({
        user_id: user.id,
        program: "Investment Inquiry",
        applicant_name: form.investorName,
        email: form.email,
        phone: form.phone,
        startup_name: startupName,
        description: [
          `Investor / Firm: ${form.firm || "Individual"}`,
          `Investor type: ${form.investorType}`,
          `Ticket size: ${form.ticketSize}`,
          `Stage preference: ${form.stagePreference}`,
          `Preferred instrument: ${form.instrument}`,
          `Decision timeline: ${form.timeline}`,
          `Profile: ${form.profileUrl}`,
          `Message: ${form.message}`,
        ].join("\n"),
        status: "pending",
      });
      if (error) throw error;

      trackEvent("investment_inquiry_submitted", { startup_name: startupName });
      markCta(ctaKey);
      toast({ title: "Inquiry sent", description: `Your investment interest in ${startupName} has been shared with the team.` });
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle>Investment Inquiry — {startupName}</DialogTitle>
          <DialogDescription>
            Share your investor details and mandate. The founding team will follow up with the data room.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4" id="investor-inquiry-form">
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
                  <SelectItem value="Angel">Angel</SelectItem>
                  <SelectItem value="Syndicate">Syndicate</SelectItem>
                  <SelectItem value="Micro VC">Micro VC</SelectItem>
                  <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                  <SelectItem value="Family Office">Family Office</SelectItem>
                  <SelectItem value="Corporate / Strategic">Corporate / Strategic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Typical Ticket Size *</Label>
              <Select value={form.ticketSize} onValueChange={(v) => set("ticketSize", v)}>
                <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under $25K">Under $25K</SelectItem>
                  <SelectItem value="$25K – $100K">$25K – $100K</SelectItem>
                  <SelectItem value="$100K – $500K">$100K – $500K</SelectItem>
                  <SelectItem value="$500K – $2M">$500K – $2M</SelectItem>
                  <SelectItem value="$2M+">$2M+</SelectItem>
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
                  <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Series A">Series A</SelectItem>
                  <SelectItem value="Series B+">Series B+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Instrument</Label>
              <Select value={form.instrument} onValueChange={(v) => set("instrument", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAFE">SAFE</SelectItem>
                  <SelectItem value="Convertible Note">Convertible Note</SelectItem>
                  <SelectItem value="Priced Equity">Priced Equity</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Decision Timeline</Label>
              <Select value={form.timeline} onValueChange={(v) => set("timeline", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immediate">Immediate</SelectItem>
                  <SelectItem value="1–3 months">1–3 months</SelectItem>
                  <SelectItem value="3–6 months">3–6 months</SelectItem>
                  <SelectItem value="Exploratory">Exploratory</SelectItem>
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

        <DialogFooter className="p-6 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="investor-inquiry-form" disabled={submitting}>
            {submitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestorInquiryDialog;

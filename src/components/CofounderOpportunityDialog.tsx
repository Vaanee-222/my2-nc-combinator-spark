import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, MapPin, Briefcase, Clock, Percent } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export interface CofounderOpportunity {
  id: string;
  title?: string | null;
  description?: string | null;
  skills_needed?: string | null;
  equity_offered?: string | null;
  commitment?: string | null;
  location?: string | null;
  status?: string | null;
  created_at?: string | null;
}

interface Props {
  opportunity: CofounderOpportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Open directly on the application form */
  startInApplyMode?: boolean;
}

type Errors = Partial<Record<"applicant_name" | "email" | "message" | "linkedin_url", string>>;

const CofounderOpportunityDialog = ({ opportunity, open, onOpenChange, startInApplyMode = false }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [applying, setApplying] = useState(startInApplyMode);
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState<any>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ applicant_name: "", email: "", headline: "", message: "", skills: "", linkedin_url: "" });

  useEffect(() => {
    if (!open) return;
    setApplying(startInApplyMode);
    setErrors({});
    setExisting(null);
    if (!user || !opportunity) return;

    setForm((f) => ({
      ...f,
      applicant_name: f.applicant_name || (user.user_metadata?.full_name as string) || "",
      email: f.email || user.email || "",
    }));

    supabase
      .from("cofounder_applications")
      .select("*")
      .eq("request_id", opportunity.id)
      .eq("applicant_id", user.id)
      .maybeSingle()
      .then(({ data }) => setExisting(data ?? null));
  }, [open, user, opportunity, startInApplyMode]);

  if (!opportunity) return null;

  const skills = String(opportunity.skills_needed || "").split(",").map((s) => s.trim()).filter(Boolean);

  const validate = () => {
    const e: Errors = {};
    if (form.applicant_name.trim().length < 2) e.applicant_name = "Enter your full name (min 2 characters).";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (form.message.trim().length < 20) e.message = "Tell the founder why you're a fit (min 20 characters).";
    if (form.message.trim().length > 2000) e.message = "Please keep your message under 2000 characters.";
    if (form.linkedin_url.trim() && !/^https?:\/\//i.test(form.linkedin_url.trim())) e.linkedin_url = "Link must start with http:// or https://";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleApplyClick = () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to apply to this opportunity." });
      onOpenChange(false);
      navigate("/login");
      return;
    }
    setApplying(true);
  };

  const submit = async () => {
    if (!user || !validate()) return;
    setSubmitting(true);
    const { error } = await supabase.from("cofounder_applications").insert({
      request_id: opportunity.id,
      applicant_id: user.id,
      applicant_name: form.applicant_name.trim(),
      email: form.email.trim().toLowerCase(),
      headline: form.headline.trim() || null,
      message: form.message.trim(),
      skills: form.skills.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Could not submit application",
        description: error.message.includes("duplicate key")
          ? "You have already applied to this opportunity."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Application sent", description: "The founder can now review your application." });
    queryClient.invalidateQueries({ queryKey: ["my-cofounder-applications"] });
    queryClient.invalidateQueries({ queryKey: ["applications-to-my-posts"] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{opportunity.title || "Co-founder opportunity"}</DialogTitle>
          <DialogDescription>
            {opportunity.location ? `Based in ${opportunity.location}` : "Location flexible"}
            {opportunity.created_at ? ` • Posted ${new Date(opportunity.created_at).toLocaleDateString()}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {opportunity.equity_offered && (
              <Badge variant="outline" className="gap-1"><Percent className="h-3 w-3" />Equity {opportunity.equity_offered}</Badge>
            )}
            {opportunity.commitment && (
              <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />{opportunity.commitment}</Badge>
            )}
            {opportunity.location && (
              <Badge variant="outline" className="gap-1"><MapPin className="h-3 w-3" />{opportunity.location}</Badge>
            )}
            {opportunity.status && <Badge variant="secondary" className="capitalize">{opportunity.status}</Badge>}
          </div>

          {opportunity.description && (
            <div>
              <p className="text-sm font-medium mb-1 flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" />About the role</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{opportunity.description}</p>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Skills the founder is looking for</p>
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
              </div>
            </div>
          )}

          {existing && (
            <div className="rounded-lg border p-3 text-sm">
              You applied on {new Date(existing.created_at).toLocaleDateString()} — status{" "}
              <Badge variant="outline" className="capitalize ml-1">{existing.status}</Badge>
            </div>
          )}

          {applying && !existing && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="cf-name">Full name *</Label>
                    <Input id="cf-name" value={form.applicant_name} onChange={(e) => setForm({ ...form, applicant_name: e.target.value })} />
                    {errors.applicant_name && <p className="text-xs text-destructive mt-1">{errors.applicant_name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cf-email">Email *</Label>
                    <Input id="cf-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="cf-headline">Headline</Label>
                  <Input id="cf-headline" placeholder="e.g. Full-stack engineer, ex-fintech" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="cf-skills">Your key skills</Label>
                  <Input id="cf-skills" placeholder="React, Growth, Fundraising" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="cf-link">Profile link (LinkedIn / portfolio)</Label>
                  <Input id="cf-link" placeholder="https://linkedin.com/in/..." value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
                  {errors.linkedin_url && <p className="text-xs text-destructive mt-1">{errors.linkedin_url}</p>}
                </div>
                <div>
                  <Label htmlFor="cf-message">Why are you a fit? *</Label>
                  <Textarea id="cf-message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-destructive">{errors.message}</p>
                    <p className="text-xs text-muted-foreground">{form.message.trim().length}/2000</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {!existing && (applying ? (
            <Button onClick={submit} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          ) : (
            <Button onClick={handleApplyClick}>Apply Now</Button>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CofounderOpportunityDialog;

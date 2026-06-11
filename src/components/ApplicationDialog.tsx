import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

interface ApplicationDialogProps {
  children: React.ReactNode;
  program?: string;
  title?: string;
  type?: string;
  description?: string;
}

const ApplicationDialog = ({ children, program = "Xi Lab", title }: ApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    startupName: "", stage: "", problem: "", solution: "",
    market: "", traction: "", funding: "", why: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Please log in", description: "You need to be logged in to submit an application.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("applications").insert({
        user_id: user.id,
        program,
        applicant_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        startup_name: formData.startupName,
        description: `Problem: ${formData.problem}\nSolution: ${formData.solution}\nMarket: ${formData.market}\nTraction: ${formData.traction}\nFunding: ${formData.funding}\nWhy: ${formData.why}`,
        status: "pending",
      });

      if (error) throw error;

      trackEvent("application_submitted", { program, startup_name: formData.startupName });
      toast({ title: "Application Submitted! ", description: `Your application to ${program} has been submitted successfully.` });
      setOpen(false);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", startupName: "", stage: "", problem: "", solution: "", market: "", traction: "", funding: "", why: "" });
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title || `Apply to ${program}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input type="email" id="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input type="tel" id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startupName">Startup Name</Label>
            <Input id="startupName" value={formData.startupName} onChange={(e) => handleChange("startupName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Current Stage</Label>
            <Select value={formData.stage} onValueChange={(v) => handleChange("stage", v)}>
              <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea Stage</SelectItem>
                <SelectItem value="mvp">MVP Developed</SelectItem>
                <SelectItem value="early-traction">Early Traction</SelectItem>
                <SelectItem value="growth">Growth Stage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="problem">Problem Statement *</Label>
            <Textarea id="problem" value={formData.problem} onChange={(e) => handleChange("problem", e.target.value)} placeholder="Describe the problem you're solving..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="solution">Solution *</Label>
            <Textarea id="solution" value={formData.solution} onChange={(e) => handleChange("solution", e.target.value)} placeholder="Describe your solution..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="market">Target Market *</Label>
            <Textarea id="market" value={formData.market} onChange={(e) => handleChange("market", e.target.value)} placeholder="Describe your target market..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="traction">Current Traction</Label>
            <Textarea id="traction" value={formData.traction} onChange={(e) => handleChange("traction", e.target.value)} placeholder="Users, revenue, partnerships..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="funding">Funding Requirements</Label>
            <Input id="funding" value={formData.funding} onChange={(e) => handleChange("funding", e.target.value)} placeholder="e.g., $25L, $1Cr" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="why">Why Xi Combinator? *</Label>
            <Textarea id="why" value={formData.why} onChange={(e) => handleChange("why", e.target.value)} placeholder="Why do you want to join?" required />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
          {!user && <p className="text-sm text-destructive text-center">You must be logged in to submit an application.</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;

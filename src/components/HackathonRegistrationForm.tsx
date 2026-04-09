import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PersonalInfoSection from "./hackathon/PersonalInfoSection";
import TechnicalSkillsSection from "./hackathon/TechnicalSkillsSection";

interface HackathonRegistrationFormProps {
  children: React.ReactNode;
}

const HackathonRegistrationForm = ({ children }: HackathonRegistrationFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", age: "", city: "", college: "", graduation: "",
    programmingLanguages: "", experience: "", frameworks: "", specialization: "",
    githubProfile: "", portfolio: "", agreements: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreements) {
      toast({ title: "Agreement Required", description: "Please accept the terms", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Please log in", description: "You need to be logged in to register.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("hackathon_registrations").insert({
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        city: formData.city,
        college: formData.college,
        graduation: formData.graduation,
        programming_languages: formData.programmingLanguages,
        experience: formData.experience,
        frameworks: formData.frameworks,
        specialization: formData.specialization,
        github_profile: formData.githubProfile,
        portfolio: formData.portfolio,
      });
      if (error) throw error;
      toast({ title: "Registration Successful! 🚀", description: "You're registered for the hackathon." });
      setIsOpen(false);
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">Hackathon Registration</DialogTitle>
          <p className="text-center text-muted-foreground">Join India's premier hackathon for innovative problem solvers</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <PersonalInfoSection formData={formData} onInputChange={handleInputChange} />
          <TechnicalSkillsSection formData={formData} onInputChange={handleInputChange} />
          <div className="flex items-start space-x-2">
            <Checkbox id="agreements" checked={formData.agreements} onCheckedChange={(checked) => handleInputChange("agreements", checked as boolean)} />
            <Label htmlFor="agreements" className="text-sm leading-5">
              I agree to the hackathon rules, code of conduct, and terms & conditions.
            </Label>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register for Hackathon 🚀"}
            </Button>
          </div>
          {!user && <p className="text-sm text-destructive text-center">You must be logged in to register.</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HackathonRegistrationForm;

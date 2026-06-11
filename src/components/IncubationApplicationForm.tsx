
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import FounderInfoSection from "./incubation/FounderInfoSection";
import StartupInfoSection from "./incubation/StartupInfoSection";

interface IncubationApplicationFormProps {
  children: React.ReactNode;
}

const IncubationApplicationForm = ({ children }: IncubationApplicationFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Founder Information
    founderName: "",
    coFounderName: "",
    email: "",
    phone: "",
    linkedIn: "",
    education: "",
    experience: "",
    
    // Startup Information
    startupName: "",
    website: "",
    stage: "",
    industry: "",
    description: "",
    mission: "",
    vision: "",
    
    agreements: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreements) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms and conditions",
        variant: "destructive"
      });
      return;
    }

    console.log("Incubation application submitted:", formData);
    
    toast({
      title: "Application Submitted Successfully! ",
      description: "We'll review your application and get back to you within 7-10 business days.",
    });
    
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Incubation Program Application
          </DialogTitle>
          <p className="text-center text-muted-foreground">Apply for comprehensive startup incubation and acceleration</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <FounderInfoSection formData={formData} onInputChange={handleInputChange} />
          <StartupInfoSection formData={formData} onInputChange={handleInputChange} />

          {/* Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreements"
              checked={formData.agreements}
              onCheckedChange={(checked) => handleInputChange("agreements", checked as boolean)}
            />
            <Label htmlFor="agreements" className="text-sm leading-5">
              I agree to the incubation program terms & conditions and confirm that all information provided is accurate. 
              I understand that the selection process may include interviews and due diligence.
            </Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              Submit Application 
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IncubationApplicationForm;

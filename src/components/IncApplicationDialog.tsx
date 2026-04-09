
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

interface IncApplicationDialogProps {
  children: React.ReactNode;
}

const IncApplicationDialog = ({ children }: IncApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    startupName: "",
    founderName: "",
    email: "",
    phone: "",
    stage: "",
    sector: "",
    description: "",
    problem: "",
    solution: "",
    traction: "",
    funding: "",
    teamSize: "",
    website: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted",
      description: "Your Inc Combinator application has been submitted successfully. We'll review it within 7 days.",
    });
    setOpen(false);
    setFormData({
      startupName: "",
      founderName: "",
      email: "",
      phone: "",
      stage: "",
      sector: "",
      description: "",
      problem: "",
      solution: "",
      traction: "",
      funding: "",
      teamSize: "",
      website: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply to Inc Combinator</DialogTitle>
          <DialogDescription>
            Join India's premier startup incubator and accelerate your growth with mentorship, funding, and resources.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startupName">Startup Name *</Label>
              <Input
                id="startupName"
                value={formData.startupName}
                onChange={(e) => setFormData({...formData, startupName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="founderName">Founder Name *</Label>
              <Input
                id="founderName"
                value={formData.founderName}
                onChange={(e) => setFormData({...formData, founderName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">Current Stage *</Label>
              <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea Stage</SelectItem>
                  <SelectItem value="mvp">MVP</SelectItem>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="early-growth">Early Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector">Industry Sector *</Label>
              <Select value={formData.sector} onValueChange={(value) => setFormData({...formData, sector: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="healthtech">HealthTech</SelectItem>
                  <SelectItem value="edtech">EdTech</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="cleantech">CleanTech</SelectItem>
                  <SelectItem value="agritech">AgriTech</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                placeholder="e.g., 3"
                value={formData.teamSize}
                onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website/LinkedIn</Label>
              <Input
                id="website"
                placeholder="https://"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Startup Description *</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what your startup does..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem">Problem Statement *</Label>
              <Textarea
                id="problem"
                placeholder="What problem are you solving?"
                value={formData.problem}
                onChange={(e) => setFormData({...formData, problem: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">Solution *</Label>
              <Textarea
                id="solution"
                placeholder="How does your product/service solve this problem?"
                value={formData.solution}
                onChange={(e) => setFormData({...formData, solution: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traction">Traction & Metrics</Label>
              <Textarea
                id="traction"
                placeholder="Share your key metrics, users, revenue, partnerships..."
                value={formData.traction}
                onChange={(e) => setFormData({...formData, traction: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="funding">Funding History</Label>
              <Textarea
                id="funding"
                placeholder="Previous funding rounds, amounts, investors..."
                value={formData.funding}
                onChange={(e) => setFormData({...formData, funding: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IncApplicationDialog;

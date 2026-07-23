import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface InvestmentApplicationDialogProps {
  children: React.ReactNode;
}

const InvestmentApplicationDialog = ({ children }: InvestmentApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    investor: "",
    amount: "",
    stage: "",
    valuation: "",
    useOfFunds: "",
    businessModel: "",
    revenue: "",
    traction: "",
    teamSize: "",
    pitchDeck: "",
    financials: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Investment Application Submitted",
      description: "Your investment application has been submitted successfully.",
    });
    setOpen(false);
    // Reset form
    setFormData({
      investor: "",
      amount: "",
      stage: "",
      valuation: "",
      useOfFunds: "",
      businessModel: "",
      revenue: "",
      traction: "",
      teamSize: "",
      pitchDeck: "",
      financials: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for Investment</DialogTitle>
          <DialogDescription>
            Submit your investment application with detailed business information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investor">Target Investor</Label>
              <Select value={formData.investor} onValueChange={(value) => setFormData({...formData, investor: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select investor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequoia">Sequoia Capital India</SelectItem>
                  <SelectItem value="accel">Accel Partners</SelectItem>
                  <SelectItem value="matrix">Matrix Partners</SelectItem>
                  <SelectItem value="lightspeed">Lightspeed Ventures</SelectItem>
                  <SelectItem value="nexus">Nexus Venture Partners</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Funding Amount</Label>
              <Input
                id="amount"
                placeholder="e.g., $300K"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Funding Stage</Label>
              <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                  <SelectItem value="series-c">Series C+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="valuation">Current Valuation</Label>
              <Input
                id="valuation"
                placeholder="e.g., $1.2M"
                value={formData.valuation}
                onChange={(e) => setFormData({...formData, valuation: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useOfFunds">Use of Funds</Label>
            <Textarea
              id="useOfFunds"
              placeholder="Describe how you plan to use the funding..."
              value={formData.useOfFunds}
              onChange={(e) => setFormData({...formData, useOfFunds: e.target.value})}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessModel">Business Model</Label>
            <Textarea
              id="businessModel"
              placeholder="Describe your business model and revenue streams..."
              value={formData.businessModel}
              onChange={(e) => setFormData({...formData, businessModel: e.target.value})}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Monthly Revenue</Label>
              <Input
                id="revenue"
                placeholder="e.g., $6,000"
                value={formData.revenue}
                onChange={(e) => setFormData({...formData, revenue: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traction">User Traction</Label>
              <Input
                id="traction"
                placeholder="e.g., 10,000 users"
                value={formData.traction}
                onChange={(e) => setFormData({...formData, traction: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                placeholder="e.g., 8 people"
                value={formData.teamSize}
                onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pitchDeck">Pitch Deck URL</Label>
              <Input
                id="pitchDeck"
                placeholder="https://drive.google.com/..."
                value={formData.pitchDeck}
                onChange={(e) => setFormData({...formData, pitchDeck: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="financials">Financial Statements URL</Label>
              <Input
                id="financials"
                placeholder="https://drive.google.com/..."
                value={formData.financials}
                onChange={(e) => setFormData({...formData, financials: e.target.value})}
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

export default InvestmentApplicationDialog;
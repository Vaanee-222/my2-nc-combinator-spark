
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, TrendingUp, Building, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PortfolioManagement = () => {
  const { toast } = useToast();

  const portfolioStartups = [
    {
      id: 1,
      name: "TechFlow Solutions",
      sector: "FinTech",
      investmentAmount: "$2.5 Cr",
      investmentDate: "Jan 2023",
      currentValuation: "$15 Cr",
      ownership: "15%",
      stage: "Series A",
      status: "Active",
      growth: "+45%"
    },
    {
      id: 2,
      name: "HealthCare AI",
      sector: "HealthTech",
      investmentAmount: "$1.8 Cr",
      investmentDate: "Mar 2023",
      currentValuation: "$12 Cr",
      ownership: "12%",
      stage: "Seed",
      status: "Active",
      growth: "+38%"
    },
    {
      id: 3,
      name: "EduNext Platform",
      sector: "EdTech",
      investmentAmount: "$3.2 Cr",
      investmentDate: "Dec 2022",
      currentValuation: "$18 Cr",
      ownership: "18%",
      stage: "Series A",
      status: "Exited",
      growth: "+65%"
    }
  ];

  const availableStartups = [
    { id: 1, name: "GreenTech Solutions", sector: "CleanTech", stage: "Seed", seeking: "$2 Cr" },
    { id: 2, name: "AI Robotics Co", sector: "AI/ML", stage: "Pre-Seed", seeking: "$1.5 Cr" },
    { id: 3, name: "Smart Logistics", sector: "Logistics", stage: "Series A", seeking: "$5 Cr" }
  ];

  const handleAddToPortfolio = (startupId: number) => {
    toast({
      title: "Startup Added",
      description: `Startup has been added to your portfolio.`,
    });
  };

  const handleUpdateInvestment = (id: number) => {
    toast({
      title: "Investment Updated",
      description: `Investment details for startup #${id} have been updated.`,
    });
  };

  const handleRemoveFromPortfolio = (id: number) => {
    toast({
      title: "Startup Removed",
      description: `Startup has been removed from your portfolio.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Portfolio Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Startup to Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add Startup to Portfolio</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Available Startups */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Startups</h3>
                <div className="grid grid-cols-1 gap-4">
                  {availableStartups.map((startup) => (
                    <Card key={startup.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{startup.name}</h4>
                            <div className="flex space-x-2 mt-1">
                              <Badge variant="outline">{startup.sector}</Badge>
                              <Badge variant="secondary">{startup.stage}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Seeking: {startup.seeking}
                            </p>
                          </div>
                          <Button onClick={() => handleAddToPortfolio(startup.id)}>
                            Add to Portfolio
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Manual Entry */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Manual Entry</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startup-name">Startup Name</Label>
                      <Input id="startup-name" placeholder="Enter startup name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sector">Sector</Label>
                      <Input id="sector" placeholder="e.g., FinTech" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="investment-amount">Investment Amount</Label>
                      <Input id="investment-amount" placeholder="$2.5 Cr" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownership">Ownership %</Label>
                      <Input id="ownership" type="number" placeholder="15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="investment-date">Investment Date</Label>
                      <Input id="investment-date" type="date" />
                    </div>
                  </div>
                  <Button onClick={() => handleAddToPortfolio(0)} className="w-full">
                    Add Manual Entry
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">25</p>
                <p className="text-xs text-muted-foreground">Portfolio Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">$45 Cr</p>
                <p className="text-xs text-muted-foreground">Total Invested</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">$180 Cr</p>
                <p className="text-xs text-muted-foreground">Portfolio Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">285%</p>
                <p className="text-xs text-muted-foreground">Avg ROI</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Startup</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Investment</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Ownership</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioStartups.map((startup) => (
                <TableRow key={startup.id}>
                  <TableCell className="font-medium">{startup.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{startup.sector}</Badge>
                  </TableCell>
                  <TableCell>{startup.investmentAmount}</TableCell>
                  <TableCell>{startup.currentValuation}</TableCell>
                  <TableCell>{startup.ownership}</TableCell>
                  <TableCell>
                    <span className="text-green-600 font-semibold">{startup.growth}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={startup.status === "Active" ? "default" : "secondary"}>
                      {startup.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateInvestment(startup.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveFromPortfolio(startup.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioManagement;

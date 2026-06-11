
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Edit, Trash2, Users, TrendingUp, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface StartupManagementProps {
  startups: Array<{
    id: number;
    name: string;
    sector: string;
    valuation: string;
    status: string;
  }>;
}

const StartupManagement = ({ startups }: StartupManagementProps) => {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<any>(null);
  const [newStartup, setNewStartup] = useState({
    name: "",
    founder: "",
    sector: "",
    stage: "",
    valuation: "",
    description: "",
    location: "",
    teamSize: "",
    status: "Active"
  });

  const handleAddStartup = () => {
    toast({
      title: "Startup Added",
      description: `${newStartup.name} has been added to the portfolio.`,
    });
    setAddDialogOpen(false);
    setNewStartup({
      name: "",
      founder: "",
      sector: "",
      stage: "",
      valuation: "",
      description: "",
      location: "",
      teamSize: "",
      status: "Active"
    });
  };

  const handleEditStartup = () => {
    toast({
      title: "Startup Updated",
      description: `${selectedStartup?.name} information has been updated.`,
    });
    setEditDialogOpen(false);
    setSelectedStartup(null);
  };

  const handleViewStartup = (startup: any) => {
    toast({
      title: "Startup Details",
      description: `Viewing detailed information for ${startup.name}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Startup Portfolio Management</h2>
          <p className="text-muted-foreground">Manage and track your portfolio companies</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search startups..." className="pl-10" />
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Startup
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Startup</DialogTitle>
                <DialogDescription>
                  Add a new startup to your portfolio management system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startupName">Startup Name *</Label>
                  <Input
                    id="startupName"
                    value={newStartup.name}
                    onChange={(e) => setNewStartup({...newStartup, name: e.target.value})}
                    placeholder="Enter startup name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founderName">Founder Name *</Label>
                  <Input
                    id="founderName"
                    value={newStartup.founder}
                    onChange={(e) => setNewStartup({...newStartup, founder: e.target.value})}
                    placeholder="Enter founder name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector *</Label>
                  <Select value={newStartup.sector} onValueChange={(value) => setNewStartup({...newStartup, sector: value})}>
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage *</Label>
                  <Select value={newStartup.stage} onValueChange={(value) => setNewStartup({...newStartup, stage: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea</SelectItem>
                      <SelectItem value="mvp">MVP</SelectItem>
                      <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valuation">Valuation</Label>
                  <Input
                    id="valuation"
                    value={newStartup.valuation}
                    onChange={(e) => setNewStartup({...newStartup, valuation: e.target.value})}
                    placeholder="e.g., $600K"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newStartup.location}
                    onChange={(e) => setNewStartup({...newStartup, location: e.target.value})}
                    placeholder="e.g., Bangalore"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newStartup.description}
                  onChange={(e) => setNewStartup({...newStartup, description: e.target.value})}
                  placeholder="Brief description of the startup..."
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStartup}>
                  Add Startup
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Building className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{startups.length}</div>
            <p className="text-sm text-muted-foreground">Total Startups</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">$127Cr</div>
            <p className="text-sm text-muted-foreground">Total Valuation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">85%</div>
            <p className="text-sm text-muted-foreground">Active Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Startup Name</TableHead>
                <TableHead>Founder</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Valuation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {startups.map((startup) => (
                <TableRow key={startup.id}>
                  <TableCell className="font-medium">{startup.name}</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>{startup.sector}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{startup.status}</Badge>
                  </TableCell>
                  <TableCell>{startup.valuation}</TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewStartup(startup)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedStartup(startup)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Startup</DialogTitle>
                            <DialogDescription>
                              Update startup information and status.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select defaultValue="active">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="graduated">Graduated</SelectItem>
                                  <SelectItem value="paused">Paused</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Notes</Label>
                              <Textarea placeholder="Add notes about this startup..." />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditStartup}>
                              Update
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Startup Archived",
                          description: "Startup has been moved to archived status.",
                          variant: "destructive"
                        });
                      }}>
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

export default StartupManagement;

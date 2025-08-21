
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Calendar, Users, Target, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ProgramManagement = () => {
  const { toast } = useToast();
  const [selectedProgram, setSelectedProgram] = useState<string>("hackathon");

  const programs = {
    hackathon: [
      { id: 1, name: "AI Innovation Hackathon 2024", date: "March 15-17, 2024", participants: 150, status: "Active", prizes: "₹5L" },
      { id: 2, name: "FinTech Challenge", date: "April 10-12, 2024", participants: 89, status: "Planning", prizes: "₹3L" },
    ],
    incubation: [
      { id: 1, name: "Cohort 2024-A", startDate: "Jan 2024", duration: "6 months", startups: 25, status: "Active" },
      { id: 2, name: "Cohort 2024-B", startDate: "Jul 2024", duration: "6 months", startups: 0, status: "Planning" },
    ],
    mvplab: [
      { id: 1, name: "MVP Development Program Q1", startDate: "Feb 2024", duration: "12 weeks", participants: 40, status: "Active" },
      { id: 2, name: "MVP Accelerator Q2", startDate: "May 2024", duration: "8 weeks", participants: 0, status: "Planning" },
    ],
    inclab: [
      { id: 1, name: "Advanced Research Lab 2024", focus: "AI & ML", researchers: 15, budget: "₹50L", status: "Active" },
      { id: 2, name: "Blockchain Innovation Lab", focus: "DeFi Solutions", researchers: 8, budget: "₹30L", status: "Planning" },
    ]
  };

  const handleAddProgram = (type: string) => {
    toast({
      title: "Program Created",
      description: `New ${type} program has been created successfully.`,
    });
  };

  const handleEditProgram = (id: number) => {
    toast({
      title: "Program Updated",
      description: `Program #${id} has been updated successfully.`,
    });
  };

  const handleDeleteProgram = (id: number) => {
    toast({
      title: "Program Deleted",
      description: `Program #${id} has been deleted successfully.`,
    });
  };

  const AddProgramDialog = ({ type }: { type: string }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New {type} Program</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="program-name">Program Name</Label>
            <Input id="program-name" placeholder={`Enter ${type} name`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" placeholder="e.g., 3 days, 6 months" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Program description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" placeholder="Maximum participants" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input id="budget" placeholder="e.g., ₹5L" />
            </div>
          </div>
          <Button onClick={() => handleAddProgram(type)} className="w-full">
            Create Program
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Program Type Selector */}
      <div className="flex space-x-2 mb-6">
        {[
          { key: "hackathon", label: "Hackathons", icon: Zap },
          { key: "incubation", label: "Incubation", icon: Target },
          { key: "mvplab", label: "MVP Lab", icon: Users },
          { key: "inclab", label: "Inc Lab", icon: Calendar }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={selectedProgram === key ? "default" : "outline"}
            onClick={() => setSelectedProgram(key)}
            className="flex items-center space-x-2"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Button>
        ))}
      </div>

      {/* Program Management Content */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold capitalize">{selectedProgram} Management</h2>
          <AddProgramDialog type={selectedProgram} />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program Name</TableHead>
                  <TableHead>{selectedProgram === 'hackathon' ? 'Date' : 'Start Date'}</TableHead>
                  <TableHead>
                    {selectedProgram === 'hackathon' ? 'Participants' : 
                     selectedProgram === 'incubation' ? 'Startups' :
                     selectedProgram === 'inclab' ? 'Researchers' : 'Participants'}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    {selectedProgram === 'hackathon' ? 'Prizes' :
                     selectedProgram === 'inclab' ? 'Budget' : 'Duration'}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs[selectedProgram as keyof typeof programs].map((program: any) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>{program.date || program.startDate}</TableCell>
                    <TableCell>{program.participants || program.startups || program.researchers || 0}</TableCell>
                    <TableCell>
                      <Badge variant={program.status === "Active" ? "default" : "secondary"}>
                        {program.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{program.prizes || program.duration || program.budget}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditProgram(program.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteProgram(program.id)}
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
    </div>
  );
};

export default ProgramManagement;

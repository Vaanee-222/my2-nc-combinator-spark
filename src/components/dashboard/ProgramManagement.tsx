import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Calendar, Users, Target, Zap, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const programTypes = [
  { key: "hackathon", label: "Hackathons", icon: Zap },
  { key: "incubation", label: "Incubation", icon: Target },
  { key: "mvplab", label: "MVP Lab", icon: Users },
  { key: "inclab", label: "Xi Lab", icon: Calendar },
];

const emptyProgram = {
  program_type: "hackathon",
  name: "",
  start_date: "",
  duration: "",
  capacity: 0,
  budget: "",
  status: "Planning",
  description: "",
};

const ProgramManagement = () => {
  const { toast } = useToast();
  const [selectedProgram, setSelectedProgram] = useState<string>("hackathon");
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [viewing, setViewing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from("programs").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setPrograms(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const visiblePrograms = useMemo(
    () => programs.filter((program) => program.program_type === selectedProgram),
    [programs, selectedProgram]
  );

  const save = async () => {
    if (!editing?.name) return toast({ title: "Program name required", variant: "destructive" });
    setSaving(true);
    const payload = {
      program_type: editing.program_type || selectedProgram,
      name: editing.name,
      start_date: editing.start_date || null,
      duration: editing.duration || null,
      capacity: Number(editing.capacity ?? 0),
      budget: editing.budget || null,
      status: editing.status || "Planning",
      description: editing.description || null,
    };
    const { error } = editing.id
      ? await (supabase as any).from("programs").update(payload).eq("id", editing.id)
      : await (supabase as any).from("programs").insert(payload);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: editing.id ? "Program updated" : "Program created" });
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this program?")) return;
    const { error } = await (supabase as any).from("programs").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Program deleted" });
    load();
  };

  return (
    <div className="space-y-6">
      {/* Program Type Selector */}
      <div className="flex space-x-2 mb-6">
        {programTypes.map(({ key, label, icon: Icon }) => (
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
          <Button onClick={() => setEditing({ ...emptyProgram, program_type: selectedProgram })}><Plus className="mr-2 h-4 w-4" />Add Program</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? <div className="p-8 text-center text-muted-foreground">Loading…</div> : <Table>
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
                {visiblePrograms.map((program: any) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>{program.start_date || "—"}</TableCell>
                    <TableCell>{program.capacity || 0}</TableCell>
                    <TableCell>
                      <Badge variant={program.status === "Active" ? "default" : "secondary"}>
                        {program.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{program.budget || program.duration || "—"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setViewing(program)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditing(program)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => remove(program.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {visiblePrograms.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No programs yet.</TableCell></TableRow>}
              </TableBody>
            </Table>}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent><DialogHeader><DialogTitle>Program Details</DialogTitle></DialogHeader>{viewing && <div className="space-y-3 text-sm"><p><strong>Name:</strong> {viewing.name}</p><p><strong>Type:</strong> {viewing.program_type}</p><p><strong>Start:</strong> {viewing.start_date || "—"}</p><p><strong>Duration:</strong> {viewing.duration || "—"}</p><p><strong>Budget:</strong> {viewing.budget || "—"}</p><p className="whitespace-pre-wrap"><strong>Description:</strong> {viewing.description || "—"}</p></div>}</DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Program" : "Create Program"}</DialogTitle></DialogHeader>
          {editing && <div className="space-y-4">
            <div><Label>Program Name *</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Type</Label><Input value={editing.program_type ?? selectedProgram} onChange={(e) => setEditing({ ...editing, program_type: e.target.value })} /></div>
              <div><Label>Start Date</Label><Input value={editing.start_date ?? ""} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} /></div>
              <div><Label>Duration</Label><Input value={editing.duration ?? ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} /></div>
              <div><Label>Capacity</Label><Input type="number" value={editing.capacity ?? 0} onChange={(e) => setEditing({ ...editing, capacity: Number(e.target.value) })} /></div>
              <div><Label>Budget / Rewards</Label><Input value={editing.budget ?? ""} onChange={(e) => setEditing({ ...editing, budget: e.target.value })} /></div>
              <div><Label>Status</Label><Input value={editing.status ?? "Planning"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} /></div>
            </div>
            <div><Label>Description</Label><Textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
          </div>}
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgramManagement;

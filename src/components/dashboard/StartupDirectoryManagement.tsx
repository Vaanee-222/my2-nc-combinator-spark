import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Startup {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sector: string | null;
  stage: string | null;
  country: string | null;
  region: string | null;
  headquarters: string | null;
  founded_year: number | null;
  website: string | null;
  team_size: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_active: boolean;
}

const empty: Partial<Startup> = {
  name: "", slug: "", description: "", sector: "", stage: "Seed",
  country: "USA", region: "North America", headquarters: "", founded_year: new Date().getFullYear(),
  website: "", team_size: "", tags: [], is_featured: false, is_active: true,
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const StartupDirectoryManagement = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Startup>>(empty);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("startups").select("*").order("name");
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.name) return toast({ title: "Name required", variant: "destructive" });
    setSaving(true);
    const payload: any = {
      name: editing.name,
      slug: editing.slug || slugify(editing.name),
      description: editing.description || null,
      sector: editing.sector || null,
      stage: editing.stage || null,
      country: editing.country || null,
      region: editing.region || null,
      headquarters: editing.headquarters || null,
      founded_year: editing.founded_year ?? null,
      website: editing.website || null,
      team_size: editing.team_size || null,
      tags: typeof editing.tags === "string" ? (editing.tags as any).split(",").map((s: string) => s.trim()).filter(Boolean) : editing.tags,
      is_featured: editing.is_featured ?? false,
      is_active: editing.is_active ?? true,
    };
    const { error } = editing.id
      ? await (supabase as any).from("startups").update(payload).eq("id", editing.id)
      : await (supabase as any).from("startups").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: editing.id ? "Updated" : "Created" }); setOpen(false); setEditing(empty); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this startup?")) return;
    const { error } = await (supabase as any).from("startups").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Startup Directory Management</h2>
          <p className="text-sm text-muted-foreground">Curate the global startup directory shown on /startup-directory.</p>
        </div>
        <Button onClick={() => { setEditing(empty); setOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Startup
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? <div className="p-8 text-center text-muted-foreground">Loading…</div> : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Sector</TableHead><TableHead>Stage</TableHead><TableHead>Country</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {items.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.sector}</TableCell>
                    <TableCell><Badge variant="outline">{s.stage}</Badge></TableCell>
                    <TableCell>{s.country}</TableCell>
                    <TableCell>
                      <Badge variant={s.is_active ? "default" : "secondary"}>{s.is_active ? "Active" : "Hidden"}</Badge>
                      {s.is_featured && <Badge variant="outline" className="ml-1">Featured</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing({ ...s, tags: s.tags ?? [] }); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => del(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No startups yet. The public page will show the curated seed.</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing.id ? "Edit Startup" : "New Startup"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name *</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></div>
              <div><Label>Website</Label><Input value={editing.website ?? ""} onChange={(e) => setEditing({ ...editing, website: e.target.value })} /></div>
            </div>
            <div><Label>Description</Label><Textarea rows={3} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Sector</Label><Input value={editing.sector ?? ""} onChange={(e) => setEditing({ ...editing, sector: e.target.value })} placeholder="FinTech" /></div>
              <div><Label>Stage</Label><Input value={editing.stage ?? ""} onChange={(e) => setEditing({ ...editing, stage: e.target.value })} placeholder="Seed / Series A / ..." /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Country</Label><Input value={editing.country ?? ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} placeholder="USA / India / UK" /></div>
              <div><Label>Region</Label><Input value={editing.region ?? ""} onChange={(e) => setEditing({ ...editing, region: e.target.value })} placeholder="North America" /></div>
              <div><Label>Headquarters</Label><Input value={editing.headquarters ?? ""} onChange={(e) => setEditing({ ...editing, headquarters: e.target.value })} placeholder="San Francisco" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Founded year</Label><Input type="number" value={editing.founded_year ?? ""} onChange={(e) => setEditing({ ...editing, founded_year: Number(e.target.value) })} /></div>
              <div><Label>Team size</Label><Input value={editing.team_size ?? ""} onChange={(e) => setEditing({ ...editing, team_size: e.target.value })} placeholder="50-100" /></div>
              <div><Label>Tags (comma)</Label><Input value={Array.isArray(editing.tags) ? editing.tags.join(", ") : (editing.tags ?? "")} onChange={(e) => setEditing({ ...editing, tags: e.target.value as any })} /></div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /><Label>Active</Label></div>
              <div className="flex items-center gap-2"><Switch checked={editing.is_featured ?? false} onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })} /><Label>Featured</Label></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StartupDirectoryManagement;

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
import { Plus, Edit, Trash2, Newspaper, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  source: string | null;
  source_url: string | null;
  impact: string | null;
  is_breaking: boolean;
  is_published: boolean;
  published_at: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
}

const empty: Partial<News> = {
  title: "", slug: "", excerpt: "", content: "", category: "Funding",
  source: "", source_url: "", impact: "Medium", is_breaking: false, is_published: true,
  meta_title: "", meta_description: "", og_image_url: "",
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const NewsManagement = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<News>>(empty);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("news").select("*").order("published_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.title) return toast({ title: "Title required", variant: "destructive" });
    setSaving(true);
    const payload: any = {
      title: editing.title,
      slug: editing.slug || slugify(editing.title),
      excerpt: editing.excerpt || null,
      content: editing.content || null,
      category: editing.category || null,
      source: editing.source || null,
      source_url: editing.source_url || null,
      impact: editing.impact || null,
      is_breaking: editing.is_breaking ?? false,
      is_published: editing.is_published ?? true,
      meta_title: editing.meta_title || null,
      meta_description: editing.meta_description || null,
      og_image_url: editing.og_image_url || null,
    };
    const { error } = editing.id
      ? await (supabase as any).from("news").update(payload).eq("id", editing.id)
      : await (supabase as any).from("news").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: editing.id ? "Updated" : "Created" }); setOpen(false); setEditing(empty); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this news item?")) return;
    const { error } = await (supabase as any).from("news").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">News Management</h2>
          <p className="text-sm text-muted-foreground">Curate startup, funding, policy, and market news.</p>
        </div>
        <Button onClick={() => { setEditing(empty); setOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New Item
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? <div className="p-8 text-center text-muted-foreground">Loading…</div> : (
            <Table>
              <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Source</TableHead><TableHead>Published</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {items.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium max-w-xs truncate">{n.title}</TableCell>
                    <TableCell><Badge variant="outline">{n.category}</Badge></TableCell>
                    <TableCell className="text-sm">{n.source}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(n.published_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={n.is_published ? "default" : "secondary"}>{n.is_published ? "Published" : "Draft"}</Badge>
                      {n.is_breaking && <Badge variant="destructive" className="ml-1">Breaking</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(n); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => del(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No news yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing.id ? "Edit News" : "New News"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label><Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Funding / Policy / Market / AI" /></div>
              <div><Label>Impact</Label><Input value={editing.impact ?? ""} onChange={(e) => setEditing({ ...editing, impact: e.target.value })} placeholder="Low / Medium / High" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Source</Label><Input value={editing.source ?? ""} onChange={(e) => setEditing({ ...editing, source: e.target.value })} /></div>
              <div><Label>Source URL</Label><Input value={editing.source_url ?? ""} onChange={(e) => setEditing({ ...editing, source_url: e.target.value })} /></div>
            </div>
            <div><Label>Excerpt</Label><Textarea rows={2} value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
            <div><Label>Content</Label><Textarea rows={8} value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">SEO</p>
              <div><Label>Meta title</Label><Input value={editing.meta_title ?? ""} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} placeholder="Defaults to title if blank" maxLength={120} /></div>
              <div><Label>Meta description</Label><Textarea rows={2} value={editing.meta_description ?? ""} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} placeholder="Defaults to excerpt if blank" maxLength={200} /></div>
              <div><Label>OG image URL</Label><Input value={editing.og_image_url ?? ""} onChange={(e) => setEditing({ ...editing, og_image_url: e.target.value })} placeholder="https://…" /></div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><Switch checked={editing.is_published ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} /><Label>Published</Label></div>
              <div className="flex items-center gap-2"><Switch checked={editing.is_breaking ?? false} onCheckedChange={(v) => setEditing({ ...editing, is_breaking: v })} /><Label>Breaking</Label></div>
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

export default NewsManagement;

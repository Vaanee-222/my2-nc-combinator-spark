import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  category: string | null;
  tags: string[] | null;
  read_time_minutes: number | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
}

const empty: Partial<Blog> = {
  title: "", slug: "", excerpt: "", content: "", author: "", category: "Founder Playbook",
  tags: [], read_time_minutes: 5, is_featured: false, is_published: true,
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const BlogManagement = () => {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Blog>>(empty);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("blogs").select("*").order("published_at", { ascending: false });
    setBlogs(data ?? []);
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
      author: editing.author || null,
      category: editing.category || null,
      tags: typeof editing.tags === "string" ? (editing.tags as any).split(",").map((s: string) => s.trim()).filter(Boolean) : editing.tags,
      read_time_minutes: editing.read_time_minutes ?? 5,
      is_featured: editing.is_featured ?? false,
      is_published: editing.is_published ?? true,
    };
    const { error } = editing.id
      ? await (supabase as any).from("blogs").update(payload).eq("id", editing.id)
      : await (supabase as any).from("blogs").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: editing.id ? "Updated" : "Created" }); setOpen(false); setEditing(empty); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const { error } = await (supabase as any).from("blogs").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <p className="text-sm text-muted-foreground">Create and manage thought-leadership articles.</p>
        </div>
        <Button onClick={() => { setEditing(empty); setOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-6 flex items-center gap-3"><FileText className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{blogs.length}</p><p className="text-xs text-muted-foreground">Total Posts</p></div></CardContent></Card>
        <Card><CardContent className="p-6 flex items-center gap-3"><FileText className="h-8 w-8 text-green-500" /><div><p className="text-2xl font-bold">{blogs.filter((b) => b.is_published).length}</p><p className="text-xs text-muted-foreground">Published</p></div></CardContent></Card>
        <Card><CardContent className="p-6 flex items-center gap-3"><FileText className="h-8 w-8 text-orange-500" /><div><p className="text-2xl font-bold">{blogs.filter((b) => b.is_featured).length}</p><p className="text-xs text-muted-foreground">Featured</p></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Author</TableHead><TableHead>Published</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium max-w-xs truncate">{b.title}</TableCell>
                    <TableCell><Badge variant="outline">{b.category}</Badge></TableCell>
                    <TableCell>{b.author}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(b.published_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={b.is_published ? "default" : "secondary"}>{b.is_published ? "Published" : "Draft"}</Badge>
                      {b.is_featured && <Badge variant="outline" className="ml-1">Featured</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing({ ...b, tags: b.tags ?? [] }); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => del(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {blogs.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No blogs yet. Create your first post.</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing.id ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Slug</Label><Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
              <div><Label>Author</Label><Input value={editing.author ?? ""} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label><Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Founder Playbook" /></div>
              <div><Label>Read time (min)</Label><Input type="number" value={editing.read_time_minutes ?? 5} onChange={(e) => setEditing({ ...editing, read_time_minutes: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Tags (comma-separated)</Label><Input value={Array.isArray(editing.tags) ? editing.tags.join(", ") : (editing.tags ?? "")} onChange={(e) => setEditing({ ...editing, tags: e.target.value as any })} /></div>
            <div><Label>Excerpt</Label><Textarea rows={2} value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
            <div><Label>Content</Label><Textarea rows={10} value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><Switch checked={editing.is_published ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} /><Label>Published</Label></div>
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

export default BlogManagement;

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Users, Search, UserCheck, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { logAudit } from "@/lib/audit";

const UserManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{ title: string; description: string; action: () => Promise<void> } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [profRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);
    setProfiles(profRes.data ?? []);
    setRoles(rolesRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getUserRole = (userId: string) => {
    const r = roles.find((r) => r.user_id === userId);
    return r?.role || "user";
  };

  const openEdit = (profile: any) => setEditing({ ...profile, role: getUserRole(profile.user_id) });

  const saveUser = async () => {
    if (!editing?.user_id) return;
    if (editing.user_id === user?.id && editing.role !== "admin") {
      return toast({ title: "Cannot remove your own admin role", variant: "destructive" });
    }
    setSaving(true);
    const profilePayload = {
      full_name: editing.full_name || null,
      email: editing.email || null,
      phone: editing.phone || null,
      city: editing.city || null,
      bio: editing.bio || null,
    };
    const profileRes = await supabase.from("profiles").update(profilePayload).eq("user_id", editing.user_id);
    if (profileRes.error) {
      setSaving(false);
      return toast({ title: "Profile update failed", description: profileRes.error.message, variant: "destructive" });
    }
    const validRole = ["admin", "startup", "investor", "mentor", "cofounder"].includes(editing.role) ? editing.role : "startup";
    const deleteRes = await supabase.from("user_roles").delete().eq("user_id", editing.user_id);
    const insertRes = deleteRes.error ? deleteRes : await supabase.from("user_roles").insert({ user_id: editing.user_id, role: validRole as any });
    setSaving(false);
    if (insertRes.error) return toast({ title: "Role update failed", description: insertRes.error.message, variant: "destructive" });
    logAudit({ action: "update", table: "profiles", recordId: editing.user_id, details: { role: validRole, full_name: editing.full_name } });
    toast({ title: "User updated" });
    setEditing(null);
    fetchData();
  };

  const setActive = async (userIds: string[], isActive: boolean) => {
    if (userIds.length === 0) return;
    const snapshot = profiles.filter((p) => userIds.includes(p.user_id)).map((p) => ({ user_id: p.user_id, is_active: p.is_active }));
    const { error } = await supabase.from("profiles").update({ is_active: isActive }).in("user_id", userIds);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    logAudit({ action: userIds.length > 1 ? "bulk_update" : "update", table: "profiles", details: { is_active: isActive, count: userIds.length, snapshot } });
    toast({
      title: `${userIds.length} user(s) ${isActive ? "activated" : "deactivated"}`,
      action: (
        <Button size="sm" variant="outline" onClick={async () => {
          for (const s of snapshot) {
            await supabase.from("profiles").update({ is_active: s.is_active }).eq("user_id", s.user_id);
          }
          logAudit({ action: "update", table: "profiles", details: { rollback: true, count: snapshot.length } });
          toast({ title: "Reverted" });
          fetchData();
        }}>Undo</Button>
      ) as any,
    });
    setSelected(new Set());
    fetchData();
  };

  const deleteUsers = async (userIds: string[]) => {
    if (userIds.length === 0) return;
    const selfIncluded = userIds.includes(user?.id || "");
    if (selfIncluded) return toast({ title: "You cannot delete your own profile", variant: "destructive" });
    await supabase.from("user_roles").delete().in("user_id", userIds);
    const { error } = await supabase.from("profiles").delete().in("user_id", userIds);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    logAudit({ action: userIds.length > 1 ? "bulk_delete" : "delete", table: "profiles", details: { count: userIds.length, user_ids: userIds } });
    toast({ title: `${userIds.length} user(s) deleted` });
    setSelected(new Set());
    fetchData();
  };

  const filtered = profiles.filter((p) => {
    const matchesSearch = !search || p.full_name?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || getUserRole(p.user_id) === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleBadgeVariant = (role: string): any => ({ admin: "destructive", startup: "default", investor: "secondary", mentor: "outline" }[role] || "outline");

  const toggle = (id: string) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const toggleAll = () => setSelected((p) => p.size === filtered.length ? new Set() : new Set(filtered.map((x) => x.user_id)));

  const askConfirm = (title: string, description: string, action: () => Promise<void>) => setConfirm({ title, description, action });

  const roleStats = {
    total: profiles.length,
    admin: roles.filter((r) => r.role === "admin").length,
    startup: roles.filter((r) => r.role === "startup").length,
    investor: roles.filter((r) => r.role === "investor").length,
    mentor: roles.filter((r) => r.role === "mentor").length,
    cofounder: roles.filter((r) => r.role === "cofounder").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-muted-foreground">View and manage registered users and their roles</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "Total", count: roleStats.total, icon: Users },
          { label: "Admin", count: roleStats.admin, icon: UserCheck },
          { label: "Startup", count: roleStats.startup, icon: Users },
          { label: "Investor", count: roleStats.investor, icon: Users },
          { label: "Mentor", count: roleStats.mentor, icon: Users },
          { label: "Co-founder", count: roleStats.cofounder, icon: Users },
        ].map((s, i) => (
          <Card key={i}><CardContent className="pt-4 pb-3"><p className="text-2xl font-bold text-primary">{s.count}</p><p className="text-xs text-muted-foreground">{s.label}</p></CardContent></Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="startup">Startup</SelectItem>
            <SelectItem value="investor">Investor</SelectItem>
            <SelectItem value="mentor">Mentor</SelectItem>
            <SelectItem value="cofounder">Co-founder</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk action bar */}
      <Card className="border-primary/30">
        <CardContent className="p-4 flex flex-wrap items-center gap-2">
          <Badge variant={selected.size ? "default" : "secondary"}>{selected.size} selected</Badge>
          <Button size="sm" variant="outline" disabled={!selected.size} onClick={() => askConfirm("Activate users?", `Activate ${selected.size} user(s)?`, () => setActive(Array.from(selected), true))}>
            <Power className="mr-2 h-4 w-4" />Activate
          </Button>
          <Button size="sm" variant="outline" disabled={!selected.size} onClick={() => askConfirm("Deactivate users?", `Deactivate ${selected.size} user(s)? They will keep their account but won't appear in active queries.`, () => setActive(Array.from(selected), false))}>
            <PowerOff className="mr-2 h-4 w-4" />Deactivate
          </Button>
          <Button size="sm" variant="destructive" disabled={!selected.size} onClick={() => askConfirm("Delete users?", `Permanently delete ${selected.size} user profile(s) and their roles? This cannot be undone.`, () => deleteUsers(Array.from(selected)))}>
            <Trash2 className="mr-2 h-4 w-4" />Delete
          </Button>
          <Button size="sm" variant="ghost" disabled={!selected.size} onClick={() => setSelected(new Set())}>Clear</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" /></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} data-state={selected.has(p.user_id) ? "selected" : undefined}>
                    <TableCell><Checkbox checked={selected.has(p.user_id)} onCheckedChange={() => toggle(p.user_id)} /></TableCell>
                    <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{p.email || "—"}</TableCell>
                    <TableCell><Badge variant={roleBadgeVariant(getUserRole(p.user_id))}>{getUserRole(p.user_id)}</Badge></TableCell>
                    <TableCell>{p.is_active === false ? <Badge variant="secondary">Inactive</Badge> : <Badge variant="default">Active</Badge>}</TableCell>
                    <TableCell>{p.city || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => askConfirm("Delete user?", `Delete ${p.full_name || p.email || "this user"}?`, () => deleteUsers([p.user_id]))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (<TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No users found</TableCell></TableRow>)}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          {editing && <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Full name</Label><Input value={editing.full_name ?? ""} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
              <div><Label>City</Label><Input value={editing.city ?? ""} onChange={(e) => setEditing({ ...editing, city: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Role</Label><Select value={editing.role} onValueChange={(role) => setEditing({ ...editing, role })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="startup">Startup</SelectItem><SelectItem value="investor">Investor</SelectItem><SelectItem value="mentor">Mentor</SelectItem><SelectItem value="cofounder">Co-founder</SelectItem></SelectContent></Select></div>
            </div>
            <div><Label>Bio</Label><Textarea rows={3} value={editing.bio ?? ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} /></div>
          </div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveUser} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirm?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { const c = confirm; setConfirm(null); await c?.action(); }}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;

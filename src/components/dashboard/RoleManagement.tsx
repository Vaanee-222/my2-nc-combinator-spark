import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ShieldCheck, Plus, Trash2, Undo2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAudit } from "@/lib/audit";

const ROLES = ["admin", "startup", "investor", "mentor", "cofounder"] as const;
type AppRole = typeof ROLES[number];

interface RoleRow { id: string; user_id: string; role: AppRole; }
interface ProfileRow { user_id: string; email: string | null; full_name: string | null; }

const roleBadge = (role: string) => {
  const map: Record<string, string> = {
    admin: "bg-red-500/10 text-red-500 border-red-500/30",
    startup: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    investor: "bg-green-500/10 text-green-500 border-green-500/30",
    mentor: "bg-purple-500/10 text-purple-500 border-purple-500/30",
    cofounder: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  };
  return map[role] || "";
};

const RoleManagement = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [assignDialog, setAssignDialog] = useState(false);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignRole, setAssignRole] = useState<AppRole>("startup");
  const [revokeTarget, setRevokeTarget] = useState<RoleRow | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [r, p] = await Promise.all([
      supabase.from("user_roles").select("id, user_id, role").order("role"),
      supabase.from("profiles").select("user_id, email, full_name"),
    ]);
    setRoles((r.data ?? []) as any);
    setProfiles((p.data ?? []) as any);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const profileMap = useMemo(() => {
    const m = new Map<string, ProfileRow>();
    profiles.forEach((p) => m.set(p.user_id, p));
    return m;
  }, [profiles]);

  const filtered = useMemo(() => {
    return roles.filter((r) => {
      if (roleFilter !== "all" && r.role !== roleFilter) return false;
      if (!search) return true;
      const p = profileMap.get(r.user_id);
      const q = search.toLowerCase();
      return (
        p?.email?.toLowerCase().includes(q) ||
        p?.full_name?.toLowerCase().includes(q) ||
        r.user_id.toLowerCase().includes(q)
      );
    });
  }, [roles, roleFilter, search, profileMap]);

  const assignRoleAction = async () => {
    if (!assignUserId) return;
    const { data, error } = await supabase
      .from("user_roles")
      .insert({ user_id: assignUserId, role: assignRole as any })
      .select()
      .single();
    if (error) {
      toast({ title: "Failed to assign", description: error.message, variant: "destructive" });
      return;
    }
    await logAudit({ action: "create", table: "user_roles", recordId: data.id, details: { user_id: assignUserId, role: assignRole } });

    toast({
      title: "Role assigned",
      description: `${assignRole} role granted.`,
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            await supabase.from("user_roles").delete().eq("id", data.id);
            await logAudit({ action: "delete", table: "user_roles", recordId: data.id, details: { reverted: true, role: assignRole } });
            toast({ title: "Reverted", description: "Role assignment undone." });
            fetchData();
          }}
        >
          <Undo2 className="h-3 w-3 mr-1" /> Undo
        </Button>
      ),
    });
    setAssignDialog(false);
    setAssignUserId("");
    setAssignRole("startup");
    fetchData();
  };

  const revokeRole = async () => {
    if (!revokeTarget) return;
    const snapshot = { ...revokeTarget };
    const { error } = await supabase.from("user_roles").delete().eq("id", revokeTarget.id);
    if (error) {
      toast({ title: "Failed to revoke", description: error.message, variant: "destructive" });
      return;
    }
    await logAudit({ action: "delete", table: "user_roles", recordId: snapshot.id, details: { user_id: snapshot.user_id, role: snapshot.role } });

    toast({
      title: "Role revoked",
      description: `${snapshot.role} role removed.`,
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            const { data } = await supabase
              .from("user_roles")
              .insert({ user_id: snapshot.user_id, role: snapshot.role as any })
              .select()
              .single();
            if (data) {
              await logAudit({ action: "create", table: "user_roles", recordId: data.id, details: { restored: true, role: snapshot.role } });
            }
            toast({ title: "Restored", description: "Role re-assigned." });
            fetchData();
          }}
        >
          <Undo2 className="h-3 w-3 mr-1" /> Undo
        </Button>
      ),
    });
    setRevokeTarget(null);
    fetchData();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Role Management</h2>
        </div>
        <Button onClick={() => setAssignDialog(true)}>
          <Plus className="h-4 w-4 mr-1" /> Assign Role
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Grant and revoke roles for users. Every change is logged in the audit trail and can be undone immediately.</p>

      <div className="flex flex-wrap gap-3">
        <Input className="max-w-sm" placeholder="Search by email, name, or user id" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const p = profileMap.get(r.user_id);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{p?.full_name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{p?.email || r.user_id}</TableCell>
                      <TableCell><Badge variant="outline" className={roleBadge(r.role)}>{r.role}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => setRevokeTarget(r)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No role assignments match these filters.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={assignDialog} onOpenChange={setAssignDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign role</AlertDialogTitle>
            <AlertDialogDescription>
              Select a user and the role to grant. The change is audit-logged and can be undone from the toast.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">User</label>
              <Select value={assignUserId} onValueChange={setAssignUserId}>
                <SelectTrigger><SelectValue placeholder="Choose user" /></SelectTrigger>
                <SelectContent className="max-h-80">
                  {profiles.map((p) => (
                    <SelectItem key={p.user_id} value={p.user_id}>
                      {p.full_name ? `${p.full_name} — ${p.email ?? p.user_id}` : (p.email ?? p.user_id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Role</label>
              <Select value={assignRole} onValueChange={(v) => setAssignRole(v as AppRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={assignRoleAction} disabled={!assignUserId}>Assign</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!revokeTarget} onOpenChange={(o) => !o && setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke role?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the <b>{revokeTarget?.role}</b> role from{" "}
              <b>{profileMap.get(revokeTarget?.user_id ?? "")?.email ?? revokeTarget?.user_id}</b>.
              You can undo this immediately from the confirmation toast.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={revokeRole}>Revoke</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoleManagement;

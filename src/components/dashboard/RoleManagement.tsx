import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ShieldCheck, Plus, Trash2, Undo2, Users } from "lucide-react";
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

  // Bulk state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [bulkAssignRole, setBulkAssignRole] = useState<AppRole>("startup");
  const [bulkAssignUsers, setBulkAssignUsers] = useState<Set<string>>(new Set());
  const [bulkRevokeOpen, setBulkRevokeOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const [r, p] = await Promise.all([
      supabase.from("user_roles").select("id, user_id, role").order("role"),
      supabase.from("profiles").select("user_id, email, full_name"),
    ]);
    setRoles((r.data ?? []) as any);
    setProfiles((p.data ?? []) as any);
    setSelected(new Set());
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

  const filteredProfiles = useMemo(() => {
    if (!userSearch) return profiles;
    const q = userSearch.toLowerCase();
    return profiles.filter((p) =>
      p.email?.toLowerCase().includes(q) ||
      p.full_name?.toLowerCase().includes(q) ||
      p.user_id.toLowerCase().includes(q)
    );
  }, [profiles, userSearch]);

  const allVisibleChecked = filtered.length > 0 && filtered.every((r) => selected.has(r.id));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allVisibleChecked) filtered.forEach((r) => next.delete(r.id));
    else filtered.forEach((r) => next.add(r.id));
    setSelected(next);
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

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

  // --------- BULK ACTIONS ---------
  const performBulkAssign = async () => {
    const userIds = Array.from(bulkAssignUsers);
    if (userIds.length === 0) return;

    // Skip pairs that already exist to avoid unique violation
    const existing = new Set(
      roles.filter((r) => r.role === bulkAssignRole).map((r) => r.user_id)
    );
    const toInsert = userIds
      .filter((uid) => !existing.has(uid))
      .map((uid) => ({ user_id: uid, role: bulkAssignRole as any }));

    if (toInsert.length === 0) {
      toast({ title: "Nothing to assign", description: "All selected users already have this role." });
      setBulkAssignOpen(false);
      return;
    }

    const { data, error } = await supabase.from("user_roles").insert(toInsert).select();
    if (error) {
      toast({ title: "Bulk assign failed", description: error.message, variant: "destructive" });
      return;
    }
    const inserted = data ?? [];
    await logAudit({
      action: "bulk_update",
      table: "user_roles",
      details: { operation: "bulk_assign", role: bulkAssignRole, count: inserted.length, user_ids: userIds },
    });

    toast({
      title: `${inserted.length} role${inserted.length === 1 ? "" : "s"} assigned`,
      description: `${bulkAssignRole} granted to ${inserted.length} user${inserted.length === 1 ? "" : "s"}.`,
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            const ids = inserted.map((r: any) => r.id);
            await supabase.from("user_roles").delete().in("id", ids);
            await logAudit({ action: "bulk_delete", table: "user_roles", details: { reverted: true, count: ids.length } });
            toast({ title: "Reverted", description: "Bulk assignment undone." });
            fetchData();
          }}
        >
          <Undo2 className="h-3 w-3 mr-1" /> Undo
        </Button>
      ),
    });

    setBulkAssignOpen(false);
    setBulkAssignUsers(new Set());
    setUserSearch("");
    fetchData();
  };

  const performBulkRevoke = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const snapshot = roles.filter((r) => selected.has(r.id));

    const { error } = await supabase.from("user_roles").delete().in("id", ids);
    if (error) {
      toast({ title: "Bulk revoke failed", description: error.message, variant: "destructive" });
      return;
    }
    await logAudit({
      action: "bulk_delete",
      table: "user_roles",
      details: { operation: "bulk_revoke", count: ids.length, records: snapshot },
    });

    toast({
      title: `${ids.length} role${ids.length === 1 ? "" : "s"} revoked`,
      description: "Bulk revocation completed.",
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            const restore = snapshot.map((r) => ({ user_id: r.user_id, role: r.role as any }));
            const { data } = await supabase.from("user_roles").insert(restore).select();
            await logAudit({ action: "bulk_update", table: "user_roles", details: { restored: true, count: data?.length ?? 0 } });
            toast({ title: "Restored", description: `${data?.length ?? 0} role(s) re-assigned.` });
            fetchData();
          }}
        >
          <Undo2 className="h-3 w-3 mr-1" /> Undo
        </Button>
      ),
    });

    setBulkRevokeOpen(false);
    fetchData();
  };

  const toggleBulkUser = (uid: string) => {
    const next = new Set(bulkAssignUsers);
    next.has(uid) ? next.delete(uid) : next.add(uid);
    setBulkAssignUsers(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Role Management</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => { setBulkAssignUsers(new Set()); setUserSearch(""); setBulkAssignOpen(true); }}>
            <Users className="h-4 w-4 mr-1" /> Bulk Assign
          </Button>
          <Button onClick={() => setAssignDialog(true)}>
            <Plus className="h-4 w-4 mr-1" /> Assign Role
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">Grant and revoke roles for users. Bulk actions require a single confirmation and every change is audit-logged with instant undo.</p>

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

      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/5 px-4 py-2">
          <span className="text-sm">{selected.size} row{selected.size === 1 ? "" : "s"} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
            <Button size="sm" variant="destructive" onClick={() => setBulkRevokeOpen(true)}>
              <Trash2 className="h-4 w-4 mr-1" /> Bulk Revoke
            </Button>
          </div>
        </div>
      )}

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
                  <TableHead className="w-10">
                    <Checkbox checked={allVisibleChecked} onCheckedChange={toggleAll} aria-label="Select all" />
                  </TableHead>
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
                    <TableRow key={r.id} data-state={selected.has(r.id) ? "selected" : undefined}>
                      <TableCell>
                        <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggleOne(r.id)} aria-label="Select row" />
                      </TableCell>
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
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No role assignments match these filters.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Single assign */}
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

      {/* Single revoke */}
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

      {/* Bulk assign */}
      <AlertDialog open={bulkAssignOpen} onOpenChange={setBulkAssignOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Bulk assign role</AlertDialogTitle>
            <AlertDialogDescription>
              Pick a role, select users from the table, and confirm once. Users who already hold the role are skipped automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[180px]">
                <label className="text-sm text-muted-foreground">Role to grant</label>
                <Select value={bulkAssignRole} onValueChange={(v) => setBulkAssignRole(v as AppRole)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-[2] min-w-[220px]">
                <label className="text-sm text-muted-foreground">Search users</label>
                <Input placeholder="Filter by name or email" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={filteredProfiles.length > 0 && filteredProfiles.every((p) => bulkAssignUsers.has(p.user_id))}
                        onCheckedChange={() => {
                          const next = new Set(bulkAssignUsers);
                          const allSel = filteredProfiles.every((p) => next.has(p.user_id));
                          filteredProfiles.forEach((p) => allSel ? next.delete(p.user_id) : next.add(p.user_id));
                          setBulkAssignUsers(next);
                        }}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((p) => (
                    <TableRow key={p.user_id} data-state={bulkAssignUsers.has(p.user_id) ? "selected" : undefined}>
                      <TableCell>
                        <Checkbox checked={bulkAssignUsers.has(p.user_id)} onCheckedChange={() => toggleBulkUser(p.user_id)} />
                      </TableCell>
                      <TableCell>{p.full_name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{p.email || p.user_id}</TableCell>
                    </TableRow>
                  ))}
                  {filteredProfiles.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No users match.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground">{bulkAssignUsers.size} user{bulkAssignUsers.size === 1 ? "" : "s"} selected.</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performBulkAssign} disabled={bulkAssignUsers.size === 0}>
              Assign to {bulkAssignUsers.size} user{bulkAssignUsers.size === 1 ? "" : "s"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk revoke confirm */}
      <AlertDialog open={bulkRevokeOpen} onOpenChange={setBulkRevokeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke {selected.size} role{selected.size === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the selected role assignments in a single operation. You can undo it from the confirmation toast.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performBulkRevoke}>Revoke all</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoleManagement;

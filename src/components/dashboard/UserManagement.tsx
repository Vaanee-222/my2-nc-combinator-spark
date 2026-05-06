import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, UserCheck, UserX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const UserManagement = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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
    const r = roles.find(r => r.user_id === userId);
    return r?.role || "user";
  };

  const filtered = profiles.filter(p => {
    const matchesSearch = !search || 
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || getUserRole(p.user_id) === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "startup": return "default";
      case "investor": return "secondary";
      case "mentor": return "outline";
      default: return "outline";
    }
  };

  const roleStats = {
    total: profiles.length,
    admin: roles.filter(r => r.role === "admin").length,
    startup: roles.filter(r => r.role === "startup").length,
    investor: roles.filter(r => r.role === "investor").length,
    mentor: roles.filter(r => r.role === "mentor").length,
    cofounder: roles.filter(r => r.role === "cofounder").length,
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
          <Card key={i}>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold text-primary">{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{p.email || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={roleBadgeVariant(getUserRole(p.user_id))}>
                        {getUserRole(p.user_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>{p.city || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(p.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No users found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;

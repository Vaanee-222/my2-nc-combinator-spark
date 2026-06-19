import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ShieldCheck } from "lucide-react";

const AuditLog = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = rows.filter((r) => {
    const matchesSearch =
      !search ||
      r.admin_email?.toLowerCase().includes(search.toLowerCase()) ||
      r.table_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.record_id?.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || r.action_type === actionFilter;
    return matchesSearch && matchesAction;
  });

  const variantFor = (a: string) => {
    if (a.includes("delete")) return "destructive" as const;
    if (a === "create") return "default" as const;
    return "secondary" as const;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Admin Audit Log</h2>
      </div>
      <p className="text-sm text-muted-foreground">Every create, update, delete, and reviewer note change made by an admin is recorded here.</p>

      <div className="flex flex-wrap items-center gap-3">
        <Input className="max-w-sm" placeholder="Search by admin, table, or record id" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="bulk_update">Bulk update</SelectItem>
            <SelectItem value="bulk_delete">Bulk delete</SelectItem>
            <SelectItem value="status_change">Status change</SelectItem>
            <SelectItem value="note">Reviewer note</SelectItem>
            <SelectItem value="password_change">Password change</SelectItem>
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
                  <TableHead>When</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Record</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{format(new Date(r.created_at), "MMM d, HH:mm")}</TableCell>
                    <TableCell>{r.admin_email || r.admin_user_id || "—"}</TableCell>
                    <TableCell><Badge variant={variantFor(r.action_type)}>{r.action_type}</Badge></TableCell>
                    <TableCell>{r.table_name}</TableCell>
                    <TableCell className="max-w-[180px] truncate text-xs text-muted-foreground">{r.record_id || "—"}</TableCell>
                    <TableCell className="max-w-[320px]">
                      <pre className="text-xs whitespace-pre-wrap break-words text-muted-foreground">
                        {r.details ? JSON.stringify(r.details, null, 0) : "—"}
                      </pre>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No audit events yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;

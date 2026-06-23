import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Download, RotateCcw, ShieldCheck } from "lucide-react";

const ACTIONS = [
  "create", "update", "delete", "bulk_update", "bulk_delete",
  "status_change", "note", "password_change",
];

const AuditLog = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [q, setQ] = useState(""); // global full-text
  const [emailQ, setEmailQ] = useState("");
  const [tableQ, setTableQ] = useState("");
  const [recordQ, setRecordQ] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [tableFilter, setTableFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const tableNames = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.table_name && s.add(r.table_name));
    return Array.from(s).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const fromTs = from ? new Date(from).getTime() : null;
    const toTs = to ? new Date(to).getTime() + 24 * 3600 * 1000 : null;
    const ql = q.toLowerCase().trim();
    const el = emailQ.toLowerCase().trim();
    const tl = tableQ.toLowerCase().trim();
    const rl = recordQ.toLowerCase().trim();

    return rows.filter((r) => {
      if (actionFilter !== "all" && r.action_type !== actionFilter) return false;
      if (tableFilter !== "all" && r.table_name !== tableFilter) return false;
      const ts = new Date(r.created_at).getTime();
      if (fromTs && ts < fromTs) return false;
      if (toTs && ts > toTs) return false;
      if (el && !(r.admin_email ?? "").toLowerCase().includes(el)) return false;
      if (tl && !(r.table_name ?? "").toLowerCase().includes(tl)) return false;
      if (rl && !(r.record_id ?? "").toLowerCase().includes(rl)) return false;
      if (ql) {
        const hay = [
          r.admin_email, r.admin_user_id, r.table_name, r.record_id,
          r.action_type, r.details ? JSON.stringify(r.details) : "",
        ].join(" ").toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
  }, [rows, q, emailQ, tableQ, recordQ, actionFilter, tableFilter, from, to]);

  const resetFilters = () => {
    setQ(""); setEmailQ(""); setTableQ(""); setRecordQ("");
    setActionFilter("all"); setTableFilter("all"); setFrom(""); setTo("");
  };

  const exportCsv = () => {
    const headers = ["when", "admin_email", "admin_user_id", "action", "table", "record_id", "details"];
    const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [headers.join(",")].concat(
      filtered.map((r) => [
        r.created_at, r.admin_email, r.admin_user_id, r.action_type,
        r.table_name, r.record_id, r.details ? JSON.stringify(r.details) : "",
      ].map(escape).join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const variantFor = (a: string) => {
    if (a?.includes("delete")) return "destructive" as const;
    if (a === "create") return "default" as const;
    return "secondary" as const;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Admin Audit Log</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetFilters}><RotateCcw className="h-4 w-4 mr-1" /> Reset</Button>
          <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Every create, update, delete, and reviewer note change made by an admin is recorded here.
        Showing <b>{filtered.length}</b> of {rows.length} events.
      </p>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <Input placeholder="Full-text search (admin, table, record, action, details)…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Input placeholder="Admin email contains…" value={emailQ} onChange={(e) => setEmailQ(e.target.value)} />
            <Input placeholder="Record ID contains…" value={recordQ} onChange={(e) => setRecordQ(e.target.value)} />
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger><SelectValue placeholder="Action" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {ACTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger><SelectValue placeholder="Table" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tables</SelectItem>
                {tableNames.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <div>
              <label className="text-xs text-muted-foreground">From</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">To</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <Input placeholder="Table name contains…" value={tableQ} onChange={(e) => setTableQ(e.target.value)} />
          </div>
        </CardContent>
      </Card>

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
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No audit events match these filters.</TableCell></TableRow>
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

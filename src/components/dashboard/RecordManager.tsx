import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logAudit } from "@/lib/audit";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Plus, RefreshCw, Trash2, Search } from "lucide-react";

export type FieldType = "text" | "textarea" | "number" | "select" | "switch" | "array";

export interface RecordField {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  placeholder?: string;
  help?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export interface RecordColumn {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface RecordManagerProps {
  table: string;
  title: string;
  description?: string;
  columns: RecordColumn[];
  fields: RecordField[];
  /** Fields the admin may edit on an existing submission (read-only records). */
  editableFields?: string[];
  defaults?: Record<string, any>;
  allowCreate?: boolean;
  allowDelete?: boolean;
  searchKeys?: string[];
  statusKey?: string;
  statusOptions?: string[];
  orderBy?: string;
  emptyMessage?: string;
}

const statusTone = (value?: string) => {
  const v = (value ?? "").toLowerCase();
  if (["approved", "accepted", "active", "open", "paid"].includes(v)) return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
  if (["rejected", "declined", "cancelled", "closed", "expired"].includes(v)) return "bg-destructive/15 text-destructive border-destructive/30";
  if (["reviewing", "shortlisted", "scheduled"].includes(v)) return "bg-blue-500/15 text-blue-500 border-blue-500/30";
  return "bg-amber-500/15 text-amber-500 border-amber-500/30";
};

export const StatusBadge = ({ value }: { value?: string }) => (
  <Badge variant="outline" className={statusTone(value)}>{value || "—"}</Badge>
);

const RecordManager = ({
  table,
  title,
  description,
  columns,
  fields,
  editableFields,
  defaults = {},
  allowCreate = true,
  allowDelete = true,
  searchKeys = [],
  statusKey,
  statusOptions = [],
  orderBy = "created_at",
  emptyMessage = "No records yet.",
}: RecordManagerProps) => {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from(table).select("*").order(orderBy, { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setRows(data ?? []);
    setLoading(false);
  }, [table, orderBy, toast]);

  useEffect(() => { load(); }, [load]);

  const visibleFields = useMemo(
    () => (editing?.id && editableFields ? fields.filter((f) => editableFields.includes(f.key)) : fields),
    [editing, editableFields, fields],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusKey && statusFilter !== "all" && r[statusKey] !== statusFilter) return false;
      if (!q) return true;
      const keys = searchKeys.length ? searchKeys : columns.map((c) => c.key);
      return keys.some((k) => String(r[k] ?? "").toLowerCase().includes(q));
    });
  }, [rows, query, statusFilter, statusKey, searchKeys, columns]);

  const openNew = () => {
    const blank: Record<string, any> = { ...defaults };
    fields.forEach((f) => {
      if (blank[f.key] === undefined) blank[f.key] = f.type === "switch" ? false : f.type === "array" ? [] : f.type === "number" ? 0 : "";
    });
    setEditing(blank);
    setDialogOpen(true);
  };

  const openEdit = (row: any) => { setEditing({ ...row }); setDialogOpen(true); };

  const setField = (key: string, value: any) => setEditing((p: any) => ({ ...p, [key]: value }));

  const save = async () => {
    if (!editing) return;
    const missing = visibleFields.find((f) => f.required && !String(editing[f.key] ?? "").trim());
    if (missing) {
      toast({ title: "Missing field", description: `${missing.label} is required.`, variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload: Record<string, any> = {};
    visibleFields.forEach((f) => {
      let v = editing[f.key];
      if (f.type === "array") v = Array.isArray(v) ? v : String(v || "").split("\n").map((s) => s.trim()).filter(Boolean);
      if (f.type === "number") v = Number(v) || 0;
      payload[f.key] = v === "" ? null : v;
    });

    if (editing.id) {
      const { error } = await (supabase as any).from(table).update(payload).eq("id", editing.id);
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      await logAudit({ action: "update", table, recordId: editing.id, details: payload });
    } else {
      const { data, error } = await (supabase as any).from(table).insert({ ...defaults, ...payload }).select().single();
      if (error) {
        toast({ title: "Create failed", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      await logAudit({ action: "create", table, recordId: data?.id, details: payload });
    }
    setSaving(false);
    setDialogOpen(false);
    setEditing(null);
    toast({ title: "Saved" });
    load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await (supabase as any).from(table).delete().eq("id", deleteTarget.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      await logAudit({ action: "delete", table, recordId: deleteTarget.id, details: {} });
      toast({ title: "Deleted" });
      load();
    }
    setDeleteTarget(null);
  };

  const quickStatus = async (row: any, value: string) => {
    if (!statusKey) return;
    const { error } = await (supabase as any).from(table).update({ [statusKey]: value }).eq("id", row.id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    await logAudit({ action: "status_change", table, recordId: row.id, details: { [statusKey]: value } });
    load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 w-48" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {statusKey && statusOptions.length > 0 && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="icon" onClick={load} title="Refresh"><RefreshCw className="h-4 w-4" /></Button>
          {allowCreate && <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> New</Button>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
                {statusKey && statusOptions.length > 0 && <TableHead>Set status</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={columns.length + 2} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={columns.length + 2} className="text-center py-8 text-muted-foreground">{emptyMessage}</TableCell></TableRow>
              ) : filtered.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className="align-top max-w-[280px]">
                      {c.render ? c.render(row) : <span className="line-clamp-2 break-words">{String(row[c.key] ?? "—")}</span>}
                    </TableCell>
                  ))}
                  {statusKey && statusOptions.length > 0 && (
                    <TableCell>
                      <Select value={row[statusKey] ?? ""} onValueChange={(v) => quickStatus(row, v)}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  )}
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(row)} title="Edit"><Pencil className="h-4 w-4" /></Button>
                    {allowDelete && (
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row)} title="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-6 pb-4 border-b border-border shrink-0">
            <DialogTitle>{editing?.id ? `Edit ${title}` : `New ${title}`}</DialogTitle>
            <DialogDescription>All fields are saved to the database immediately.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleFields.map((f) => (
                <div key={f.key} className={`space-y-2 ${f.fullWidth || f.type === "textarea" || f.type === "array" ? "md:col-span-2" : ""}`}>
                  <Label htmlFor={`f-${f.key}`}>{f.label}{f.required && " *"}</Label>
                  {f.type === "textarea" ? (
                    <Textarea id={`f-${f.key}`} className="min-h-[90px]" placeholder={f.placeholder} value={editing?.[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} />
                  ) : f.type === "array" ? (
                    <Textarea
                      id={`f-${f.key}`}
                      className="min-h-[90px]"
                      placeholder={f.placeholder ?? "One item per line"}
                      value={Array.isArray(editing?.[f.key]) ? editing[f.key].join("\n") : editing?.[f.key] ?? ""}
                      onChange={(e) => setField(f.key, e.target.value.split("\n"))}
                    />
                  ) : f.type === "switch" ? (
                    <div className="flex h-10 items-center">
                      <Switch id={`f-${f.key}`} checked={!!editing?.[f.key]} onCheckedChange={(v) => setField(f.key, v)} />
                    </div>
                  ) : f.type === "select" ? (
                    <Select value={editing?.[f.key] ?? ""} onValueChange={(v) => setField(f.key, v)}>
                      <SelectTrigger id={`f-${f.key}`}><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {(f.options ?? []).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={`f-${f.key}`}
                      type={f.type === "number" ? "number" : "text"}
                      placeholder={f.placeholder}
                      value={editing?.[f.key] ?? ""}
                      onChange={(e) => setField(f.key, e.target.value)}
                    />
                  )}
                  {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="p-6 pt-4 border-t border-border shrink-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default RecordManager;

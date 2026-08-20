import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/dashboard/RecordManager";
import { Download, Inbox, RefreshCw, Search } from "lucide-react";
import { SkeletonRows } from "@/components/dashboard/EmptyState";

type Source = "Contact" | "Consultation" | "Investor Inquiry";

interface InboxItem {
  id: string;
  source: Source;
  name: string;
  email: string;
  subject: string;
  detail: string;
  status: string;
  created_at: string;
}

const AdminInbox = () => {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"all" | Source>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [contactRes, consultRes, inquiryRes] = await Promise.all([
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("consultation_bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("investor_inquiries").select("*").order("created_at", { ascending: false }),
    ]);

    const merged: InboxItem[] = [
      ...((contactRes.data ?? []) as any[]).map((r) => ({
        id: `contact-${r.id}`,
        source: "Contact" as Source,
        name: r.name,
        email: r.email,
        subject: r.subject || "Contact message",
        detail: r.message ?? "",
        status: r.status ?? "new",
        created_at: r.created_at,
      })),
      ...((consultRes.data ?? []) as any[]).map((r) => ({
        id: `consult-${r.id}`,
        source: "Consultation" as Source,
        name: r.name,
        email: r.email,
        subject: r.consultation_type || "Consultation booking",
        detail: [r.company, r.preferred_date, r.preferred_time, r.message].filter(Boolean).join(" · "),
        status: r.status ?? "pending",
        created_at: r.created_at,
      })),
      ...((inquiryRes.data ?? []) as any[]).map((r) => ({
        id: `inquiry-${r.id}`,
        source: "Investor Inquiry" as Source,
        name: r.investor_name,
        email: r.email,
        subject: `${r.firm ? `${r.firm} · ` : ""}${r.startup_name}`,
        detail: [r.investor_type, r.ticket_size, r.timeline, r.message].filter(Boolean).join(" · "),
        status: r.status ?? "pending",
        created_at: r.created_at,
      })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setItems(merged);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromTs = from ? new Date(from).getTime() : null;
    const toTs = to ? new Date(to).getTime() + 24 * 3600 * 1000 : null;
    return items.filter((i) => {
      if (source !== "all" && i.source !== source) return false;
      const ts = new Date(i.created_at).getTime();
      if (fromTs && ts < fromTs) return false;
      if (toTs && ts > toTs) return false;
      if (!q) return true;
      return [i.name, i.email, i.subject, i.detail, i.status].join(" ").toLowerCase().includes(q);
    });
  }, [items, query, source, from, to]);

  const exportCsv = () => {
    const headers = ["received", "source", "name", "email", "subject", "detail", "status"];
    const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [headers.join(",")]
      .concat(filtered.map((i) => [i.created_at, i.source, i.name, i.email, i.subject, i.detail, i.status].map(escape).join(",")))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `admin-inbox-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const counts = useMemo(() => ({
    Contact: items.filter((i) => i.source === "Contact").length,
    Consultation: items.filter((i) => i.source === "Consultation").length,
    "Investor Inquiry": items.filter((i) => i.source === "Investor Inquiry").length,
  }), [items]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Inbox className="h-5 w-5 text-primary" /> Admin Inbox</CardTitle>
          <CardDescription>
            Contact messages, consultation bookings and investor inquiries in one timeline — {filtered.length} of {items.length} shown.
          </CardDescription>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(counts).map(([label, count]) => (
              <Badge key={label} variant="outline">{label}: {count}</Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 w-48" placeholder="Search inbox..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={source} onValueChange={(v) => setSource(v as any)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="Contact">Contact</SelectItem>
              <SelectItem value="Consultation">Consultation</SelectItem>
              <SelectItem value="Investor Inquiry">Investor Inquiry</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" className="w-[150px]" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input type="date" className="w-[150px]" value={to} onChange={(e) => setTo(e.target.value)} />
          <Button variant="outline" size="icon" onClick={load} title="Refresh"><RefreshCw className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={exportCsv}><Download className="mr-2 h-4 w-4" /> CSV</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Received</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Detail</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <SkeletonRows rows={5} cols={7} />
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No submissions match these filters.</TableCell></TableRow>
              ) : filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(i.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell><Badge variant="secondary">{i.source}</Badge></TableCell>
                  <TableCell className="font-medium">{i.name || "—"}</TableCell>
                  <TableCell>{i.email || "—"}</TableCell>
                  <TableCell className="max-w-[220px]"><span className="line-clamp-2 break-words">{i.subject || "—"}</span></TableCell>
                  <TableCell className="max-w-[320px]"><span className="line-clamp-2 break-words text-sm text-muted-foreground">{i.detail || "—"}</span></TableCell>
                  <TableCell><StatusBadge value={i.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminInbox;

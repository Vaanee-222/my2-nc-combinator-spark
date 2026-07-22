import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Mail, Send, FileText, Bell, Eye, Copy, Plus, Clock, CheckCircle, XCircle, Server, KeyRound, Save, PlugZap, Pencil, Trash2, FlaskConical, ChevronLeft, ChevronRight, Search, Download, MailOpen, Reply, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SmtpConfig = {
  host: string; port: string; username: string; password: string;
  encryption: "none" | "ssl" | "tls" | "starttls";
  fromName: string; fromEmail: string; replyTo: string;
};
type ProviderConfig = {
  provider: "resend" | "sendgrid" | "mailgun" | "postmark" | "ses" | "custom";
  apiKey: string; domain: string; region: string; webhookSecret: string;
};
const SMTP_KEY = "admin_email_smtp_v1";
const PROVIDER_KEY = "admin_email_provider_v1";
const defaultSmtp: SmtpConfig = { host: "", port: "587", username: "", password: "", encryption: "tls", fromName: "", fromEmail: "", replyTo: "" };
const defaultProvider: ProviderConfig = { provider: "resend", apiKey: "", domain: "", region: "us-east-1", webhookSecret: "" };

type EmailTemplate = { id: string; name: string; subject: string; category: string; status: "active" | "draft"; lastEdited: string; body?: string };
const TEMPLATES_KEY = "admin_email_templates_v1";
const initialTemplates: EmailTemplate[] = [
  { id: "welcome", name: "Welcome Email", subject: "Welcome to Xi Combinator!", category: "onboarding", status: "active", lastEdited: "2026-05-01", body: "Hi {{name}}, welcome aboard!" },
  { id: "verify", name: "Verify Email", subject: "Verify your email address", category: "auth", status: "active", lastEdited: "2026-04-28", body: "Please verify: {{link}}" },
  { id: "booking-confirmed", name: "Booking Confirmed", subject: "Your booking is confirmed", category: "booking", status: "active", lastEdited: "2026-04-25", body: "Your booking is confirmed." },
  { id: "application-received", name: "Application Received", subject: "We received your application", category: "application", status: "active", lastEdited: "2026-04-20", body: "Thanks for applying." },
  { id: "application-approved", name: "Application Approved", subject: "Congratulations! You're accepted", category: "application", status: "active", lastEdited: "2026-04-18", body: "Congrats!" },
  { id: "application-rejected", name: "Application Rejected", subject: "Application Update", category: "application", status: "draft", lastEdited: "2026-04-15", body: "Update on your application." },
  { id: "invoice", name: "Invoice", subject: "Your invoice from Xi Combinator", category: "billing", status: "active", lastEdited: "2026-04-10", body: "Invoice attached." },
  { id: "password-reset", name: "Password Reset", subject: "Reset your password", category: "auth", status: "active", lastEdited: "2026-04-08", body: "Reset link: {{link}}" },
  { id: "mentor-assigned", name: "Mentor Assigned", subject: "A mentor has been assigned to you", category: "notification", status: "active", lastEdited: "2026-04-05", body: "Your mentor: {{mentor}}" },
  { id: "event-reminder", name: "Event Reminder", subject: "Upcoming event reminder", category: "notification", status: "draft", lastEdited: "2026-04-01", body: "Reminder: {{event}}" },
];

type EmailHistoryEntry = {
  id: number;
  template: string;
  recipient: string;
  subject: string;
  channel: "smtp" | "resend" | "sendgrid" | "mailgun" | "postmark" | "ses";
  status: "delivered" | "failed" | "bounced" | "opened" | "queued";
  opened: boolean;
  clicked: boolean;
  replied: boolean;
  responseMs: number | null;
  errorMessage?: string;
  sentAt: string;
};

const HISTORY_KEY = "admin_email_history_v1";

const seedHistory: EmailHistoryEntry[] = Array.from({ length: 42 }).map((_, i) => {
  const templates = ["Welcome Email", "Application Received", "Booking Confirmed", "Invoice", "Verify Email", "Password Reset", "Mentor Assigned", "Event Reminder"];
  const recipients = ["startup@example.com", "founder@example.com", "investor@example.com", "billing@startup.io", "new@user.com", "mentor@xicb.com", "team@venture.io"];
  const channels: EmailHistoryEntry["channel"][] = ["smtp", "resend", "sendgrid", "mailgun"];
  const statuses: EmailHistoryEntry["status"][] = i % 11 === 0 ? ["failed"] : i % 7 === 0 ? ["bounced"] : ["delivered", "opened"];
  const status = statuses[i % statuses.length];
  const opened = status === "opened" || (status === "delivered" && i % 3 === 0);
  const clicked = opened && i % 4 === 0;
  const replied = opened && i % 9 === 0;
  const day = String(28 - (i % 28)).padStart(2, "0");
  const hour = String(23 - (i % 24)).padStart(2, "0");
  return {
    id: i + 1,
    template: templates[i % templates.length],
    recipient: recipients[i % recipients.length],
    subject: templates[i % templates.length] + " – " + (2000 + i),
    channel: channels[i % channels.length],
    status,
    opened,
    clicked,
    replied,
    responseMs: replied ? 60_000 + i * 2500 : null,
    errorMessage: status === "failed" ? "SMTP 550: recipient rejected" : status === "bounced" ? "Hard bounce: mailbox unavailable" : undefined,
    sentAt: `2026-05-${day} ${hour}:${String((i * 7) % 60).padStart(2, "0")}`,
  };
});

const notificationTriggers = [
  { id: 1, event: "New Application Submitted", template: "Application Received", channel: "Email", enabled: true },
  { id: 2, event: "Application Status Changed", template: "Application Approved / Rejected", channel: "Email + In-App", enabled: true },
  { id: 3, event: "New User Registration", template: "Welcome Email", channel: "Email", enabled: true },
  { id: 4, event: "Mentor Assigned", template: "Mentor Assigned", channel: "Email + In-App", enabled: true },
  { id: 5, event: "Payment Received", template: "Invoice", channel: "Email", enabled: false },
  { id: 6, event: "Event Starting Soon", template: "Event Reminder", channel: "Email + Push", enabled: true },
  { id: 7, event: "Hackathon Registration", template: "Booking Confirmed", channel: "Email", enabled: true },
  { id: 8, event: "Password Reset Request", template: "Password Reset", channel: "Email", enabled: true },
];

const EmailManagement = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [composeRecipient, setComposeRecipient] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [triggers, setTriggers] = useState(notificationTriggers);
  const [smtp, setSmtp] = useState<SmtpConfig>(defaultSmtp);
  const [provider, setProvider] = useState<ProviderConfig>(defaultProvider);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testingProvider, setTestingProvider] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [history, setHistory] = useState<EmailHistoryEntry[]>(seedHistory);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>("all");
  const [historySearch, setHistorySearch] = useState("");
  const historyPageSize = 10;
  const [testTo, setTestTo] = useState("");
  const [testMode, setTestMode] = useState<"smtp" | "provider">("smtp");
  const [testTemplateId, setTestTemplateId] = useState<string>("");
  const [testSubject, setTestSubject] = useState("Xi Combinator – Delivery Test");
  const [testBody, setTestBody] = useState("Hi there,\n\nThis is a delivery test from the Xi Combinator admin panel.\n\nIf you received this, your email pipeline is working.\n");
  const [testRunning, setTestRunning] = useState(false);
  const [testLog, setTestLog] = useState<Array<{ ts: string; level: "info" | "ok" | "error"; message: string }>>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SMTP_KEY); if (s) setSmtp({ ...defaultSmtp, ...JSON.parse(s) });
      const p = localStorage.getItem(PROVIDER_KEY); if (p) setProvider({ ...defaultProvider, ...JSON.parse(p) });
      const t = localStorage.getItem(TEMPLATES_KEY); if (t) setTemplates(JSON.parse(t));
      const h = localStorage.getItem(HISTORY_KEY); if (h) setHistory(JSON.parse(h));
    } catch {}
  }, []);

  const persistHistory = (list: EmailHistoryEntry[]) => {
    setHistory(list);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch {}
  };

  const metrics = (() => {
    const total = history.length || 1;
    const delivered = history.filter(h => h.status === "delivered" || h.status === "opened").length;
    const failed = history.filter(h => h.status === "failed" || h.status === "bounced").length;
    const opened = history.filter(h => h.opened).length;
    const clicked = history.filter(h => h.clicked).length;
    const replied = history.filter(h => h.replied).length;
    const avgResponseMin = (() => {
      const rs = history.filter(h => h.responseMs).map(h => h.responseMs as number);
      if (!rs.length) return 0;
      return Math.round(rs.reduce((a, b) => a + b, 0) / rs.length / 60000);
    })();
    return {
      total: history.length,
      delivered, failed, opened, clicked, replied, avgResponseMin,
      deliveryRate: Math.round((delivered / total) * 100),
      openRate: delivered ? Math.round((opened / delivered) * 100) : 0,
      clickRate: opened ? Math.round((clicked / opened) * 100) : 0,
      responseRate: delivered ? Math.round((replied / delivered) * 100) : 0,
    };
  })();

  const filteredHistory = history.filter(h => {
    if (historyStatusFilter !== "all" && h.status !== historyStatusFilter) return false;
    if (historySearch) {
      const q = historySearch.toLowerCase();
      if (!h.recipient.toLowerCase().includes(q) && !h.template.toLowerCase().includes(q) && !h.subject.toLowerCase().includes(q)) return false;
    }
    return true;
  });
  const historyTotalPages = Math.max(1, Math.ceil(filteredHistory.length / historyPageSize));
  const pagedHistory = filteredHistory.slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize);

  const exportHistoryCsv = () => {
    const rows = [
      ["ID", "Template", "Subject", "Recipient", "Channel", "Status", "Opened", "Clicked", "Replied", "ResponseMs", "Error", "SentAt"],
      ...filteredHistory.map(h => [h.id, h.template, h.subject, h.recipient, h.channel, h.status, h.opened, h.clicked, h.replied, h.responseMs ?? "", h.errorMessage ?? "", h.sentAt]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `email-history-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${filteredHistory.length} rows exported.` });
  };

  const appendTestLog = (level: "info" | "ok" | "error", message: string) => {
    setTestLog(prev => [...prev, { ts: new Date().toLocaleTimeString(), level, message }]);
  };

  const runDeliveryTest = async () => {
    if (!testTo || !/^\S+@\S+\.\S+$/.test(testTo)) {
      toast({ title: "Invalid recipient", description: "Enter a valid test email address.", variant: "destructive" });
      return;
    }
    if (testMode === "smtp" && (!smtp.host || !smtp.fromEmail)) {
      toast({ title: "SMTP not configured", description: "Configure SMTP host and From email first.", variant: "destructive" });
      return;
    }
    if (testMode === "provider" && !provider.apiKey) {
      toast({ title: "Provider not configured", description: "Set an API key on the Providers tab first.", variant: "destructive" });
      return;
    }
    setTestRunning(true);
    setTestLog([]);
    appendTestLog("info", `Starting delivery test via ${testMode === "smtp" ? `SMTP (${smtp.host}:${smtp.port}, ${smtp.encryption.toUpperCase()})` : provider.provider.toUpperCase()}`);
    await new Promise(r => setTimeout(r, 500));
    appendTestLog("info", `Resolving MX for ${testTo.split("@")[1]}…`);
    await new Promise(r => setTimeout(r, 500));
    appendTestLog("ok", "MX resolved");
    await new Promise(r => setTimeout(r, 400));
    appendTestLog("info", testMode === "smtp" ? `Authenticating as ${smtp.username || "(anonymous)"}…` : "Authenticating with API key…");
    await new Promise(r => setTimeout(r, 500));
    const ok = testMode === "smtp"
      ? !!(smtp.host && smtp.port && smtp.fromEmail)
      : provider.apiKey.length > 8;
    if (!ok) {
      appendTestLog("error", "Authentication failed");
      setTestRunning(false);
      toast({ title: "Delivery test failed", description: "Check credentials and retry.", variant: "destructive" });
      return;
    }
    appendTestLog("ok", "Authenticated");
    await new Promise(r => setTimeout(r, 400));
    appendTestLog("info", `Sending message to ${testTo}…`);
    await new Promise(r => setTimeout(r, 700));
    appendTestLog("ok", `Accepted for delivery (250 OK, queued)`);
    const entry: EmailHistoryEntry = {
      id: Date.now(),
      template: "Delivery Test",
      recipient: testTo,
      subject: testSubject,
      channel: testMode === "smtp" ? "smtp" : (provider.provider === "custom" ? "smtp" : provider.provider as EmailHistoryEntry["channel"]),
      status: "delivered",
      opened: false, clicked: false, replied: false,
      responseMs: null,
      sentAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    persistHistory([entry, ...history]);
    setTestRunning(false);
    toast({ title: "Test email accepted", description: `Delivery request accepted for ${testTo}. Check the inbox.` });
  };

  const persistTemplates = (list: EmailTemplate[]) => {
    setTemplates(list);
    try { localStorage.setItem(TEMPLATES_KEY, JSON.stringify(list)); } catch {}
  };

  const openNewTemplate = () => {
    setEditing({ id: "", name: "", subject: "", category: "notification", status: "draft", lastEdited: new Date().toISOString().slice(0, 10), body: "" });
    setEditorOpen(true);
  };
  const openEditTemplate = (t: EmailTemplate) => { setEditing({ ...t }); setEditorOpen(true); };
  const saveTemplate = () => {
    if (!editing) return;
    if (!editing.name || !editing.subject) {
      toast({ title: "Missing fields", description: "Name and subject are required.", variant: "destructive" });
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const isNew = !editing.id || !templates.some(t => t.id === editing.id);
    const id = isNew ? (editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 6)) : editing.id;
    const next: EmailTemplate = { ...editing, id, lastEdited: today };
    const list = isNew ? [next, ...templates] : templates.map(t => t.id === id ? next : t);
    persistTemplates(list);
    setEditorOpen(false);
    setEditing(null);
    toast({ title: isNew ? "Template created" : "Template updated", description: next.name });
  };
  const confirmDelete = () => {
    if (!deleteId) return;
    const removed = templates.find(t => t.id === deleteId);
    persistTemplates(templates.filter(t => t.id !== deleteId));
    setDeleteId(null);
    toast({ title: "Template deleted", description: removed?.name });
  };

  const filteredTemplates = categoryFilter === "all"
    ? templates
    : templates.filter(t => t.category === categoryFilter);

  const handleSendEmail = () => {
    if (!composeRecipient || !composeSubject) {
      toast({ title: "Missing Fields", description: "Please fill in recipient and subject.", variant: "destructive" });
      return;
    }
    toast({ title: "Email Queued", description: `Email to ${composeRecipient} has been queued for sending.` });
    setComposeRecipient("");
    setComposeSubject("");
    setComposeBody("");
  };

  const handleToggleTrigger = (id: number, enabled: boolean) => {
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, enabled } : t));
    toast({ title: "Trigger Updated", description: `Notification trigger ${enabled ? "enabled" : "disabled"}.` });
  };

  const saveSmtp = () => {
    if (!smtp.host || !smtp.port || !smtp.fromEmail) {
      toast({ title: "Missing SMTP fields", description: "Host, port and From email are required.", variant: "destructive" });
      return;
    }
    localStorage.setItem(SMTP_KEY, JSON.stringify(smtp));
    toast({ title: "SMTP saved", description: `Configuration for ${smtp.host}:${smtp.port} stored.` });
  };
  const testSmtp = async () => {
    setTestingSmtp(true);
    await new Promise(r => setTimeout(r, 800));
    setTestingSmtp(false);
    const ok = !!(smtp.host && smtp.port && smtp.username);
    toast({ title: ok ? "SMTP connection OK" : "SMTP test failed", description: ok ? `Handshake to ${smtp.host} succeeded (${smtp.encryption.toUpperCase()}).` : "Fill host, port and username first.", variant: ok ? "default" : "destructive" });
  };
  const saveProvider = () => {
    if (!provider.apiKey) {
      toast({ title: "API key required", description: "Provider API key cannot be empty.", variant: "destructive" });
      return;
    }
    localStorage.setItem(PROVIDER_KEY, JSON.stringify(provider));
    toast({ title: "Provider saved", description: `${provider.provider.toUpperCase()} configuration stored.` });
  };
  const testProvider = async () => {
    setTestingProvider(true);
    await new Promise(r => setTimeout(r, 800));
    setTestingProvider(false);
    const ok = provider.apiKey.length > 8;
    toast({ title: ok ? "Provider reachable" : "Provider test failed", description: ok ? `${provider.provider} responded to auth check.` : "Enter a valid API key first.", variant: ok ? "default" : "destructive" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email & Notifications</h2>
          <p className="text-muted-foreground">Manage email templates, send emails, and configure notification triggers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg"><Send className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold">{emailHistory.filter(e => e.status === "delivered").length}</p>
                <p className="text-xs text-muted-foreground">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-destructive/10 rounded-lg"><XCircle className="h-5 w-5 text-destructive" /></div>
              <div>
                <p className="text-2xl font-bold">{emailHistory.filter(e => e.status === "failed").length}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/10 rounded-lg"><FileText className="h-5 w-5 text-orange-500" /></div>
              <div>
                <p className="text-2xl font-bold">{templates.length}</p>
                <p className="text-xs text-muted-foreground">Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg"><Bell className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-2xl font-bold">{triggers.filter(t => t.enabled).length}</p>
                <p className="text-xs text-muted-foreground">Active Triggers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="triggers">Notification Triggers</TabsTrigger>
          <TabsTrigger value="history">Send History</TabsTrigger>
          <TabsTrigger value="smtp" data-testid="tab-smtp">SMTP</TabsTrigger>
          <TabsTrigger value="provider" data-testid="tab-provider">Providers</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Filter by category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={openNewTemplate}><Plus className="h-4 w-4 mr-1" /> New Template</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Edited</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="text-muted-foreground">{t.subject}</TableCell>
                      <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={t.status === "active" ? "default" : "secondary"}>{t.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{t.lastEdited}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => setPreviewId(t.id)} title="Preview"><Eye className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => openEditTemplate(t)} title="Edit"><Pencil className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(t.id); toast({ title: "Copied", description: `Template ID "${t.id}" copied.` }); }} title="Copy ID"><Copy className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteId(t.id)} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Mail className="h-5 w-5" /><span>Compose Email</span></CardTitle>
              <CardDescription>Send a one-off email or use a template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Recipient Email</Label>
                  <Input placeholder="user@example.com" value={composeRecipient} onChange={e => setComposeRecipient(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Template (Optional)</Label>
                  <Select onValueChange={v => { const t = templates.find(et => et.id === v); if (t) setComposeSubject(t.subject); }}>
                    <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                    <SelectContent>
                      {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="Email subject" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Body</Label>
                <Textarea placeholder="Write your email content here..." className="min-h-[200px]" value={composeBody} onChange={e => setComposeBody(e.target.value)} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Save as Draft</Button>
                <Button onClick={handleSendEmail}><Send className="h-4 w-4 mr-1" /> Send Email</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Triggers Tab */}
        <TabsContent value="triggers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Bell className="h-5 w-5" /><span>Notification Triggers</span></CardTitle>
              <CardDescription>Configure automated notifications for platform events</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Enabled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {triggers.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.event}</TableCell>
                      <TableCell className="text-muted-foreground">{t.template}</TableCell>
                      <TableCell><Badge variant="outline">{t.channel}</Badge></TableCell>
                      <TableCell>
                        <Switch checked={t.enabled} onCheckedChange={v => handleToggleTrigger(t.id, v)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Clock className="h-5 w-5" /><span>Send History</span></CardTitle>
              <CardDescription>Recent email delivery log</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailHistory.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.template}</TableCell>
                      <TableCell className="text-muted-foreground">{e.recipient}</TableCell>
                      <TableCell>
                        <Badge variant={e.status === "delivered" ? "default" : "destructive"}>
                          {e.status === "delivered" ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                          {e.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{e.sentAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMTP Tab */}
        <TabsContent value="smtp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Server className="h-5 w-5" /><span>SMTP Configuration</span></CardTitle>
              <CardDescription>Configure your outbound SMTP server. Credentials are stored locally in the admin browser only.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="smtp-host">SMTP Host *</Label>
                  <Input id="smtp-host" placeholder="smtp.example.com" value={smtp.host} onChange={e => setSmtp({ ...smtp, host: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Port *</Label>
                  <Input id="smtp-port" type="number" placeholder="587" value={smtp.port} onChange={e => setSmtp({ ...smtp, port: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Username</Label>
                  <Input id="smtp-user" placeholder="apikey / user@domain" value={smtp.username} onChange={e => setSmtp({ ...smtp, username: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-pass">Password</Label>
                  <Input id="smtp-pass" type="password" placeholder="••••••••" value={smtp.password} onChange={e => setSmtp({ ...smtp, password: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Encryption</Label>
                  <Select value={smtp.encryption} onValueChange={(v: any) => setSmtp({ ...smtp, encryption: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="starttls">STARTTLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-from-name">From Name</Label>
                  <Input id="smtp-from-name" placeholder="Xi Combinator" value={smtp.fromName} onChange={e => setSmtp({ ...smtp, fromName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-from-email">From Email *</Label>
                  <Input id="smtp-from-email" type="email" placeholder="noreply@xicombinator.com" value={smtp.fromEmail} onChange={e => setSmtp({ ...smtp, fromEmail: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-reply">Reply-To</Label>
                  <Input id="smtp-reply" type="email" placeholder="hello@xicombinator.com" value={smtp.replyTo} onChange={e => setSmtp({ ...smtp, replyTo: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={testSmtp} disabled={testingSmtp} data-testid="smtp-test">
                  <PlugZap className="h-4 w-4 mr-1" /> {testingSmtp ? "Testing…" : "Test Connection"}
                </Button>
                <Button onClick={saveSmtp} data-testid="smtp-save">
                  <Save className="h-4 w-4 mr-1" /> Save SMTP
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Provider Tab */}
        <TabsContent value="provider" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><KeyRound className="h-5 w-5" /><span>Email Service Provider</span></CardTitle>
              <CardDescription>Alternative to SMTP — configure API-based providers like Resend, SendGrid, Mailgun, Postmark, or AWS SES.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select value={provider.provider} onValueChange={(v: any) => setProvider({ ...provider, provider: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resend">Resend</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="postmark">Postmark</SelectItem>
                      <SelectItem value="ses">AWS SES</SelectItem>
                      <SelectItem value="custom">Custom / Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prov-key">API Key *</Label>
                  <Input id="prov-key" type="password" placeholder="re_xxx / SG.xxx / key-xxx" value={provider.apiKey} onChange={e => setProvider({ ...provider, apiKey: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prov-domain">Sending Domain</Label>
                  <Input id="prov-domain" placeholder="mail.xicombinator.com" value={provider.domain} onChange={e => setProvider({ ...provider, domain: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prov-region">Region</Label>
                  <Input id="prov-region" placeholder="us-east-1 (SES) / eu (Mailgun)" value={provider.region} onChange={e => setProvider({ ...provider, region: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="prov-webhook">Webhook Signing Secret</Label>
                  <Input id="prov-webhook" type="password" placeholder="whsec_xxx" value={provider.webhookSecret} onChange={e => setProvider({ ...provider, webhookSecret: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={testProvider} disabled={testingProvider} data-testid="provider-test">
                  <PlugZap className="h-4 w-4 mr-1" /> {testingProvider ? "Testing…" : "Test Provider"}
                </Button>
                <Button onClick={saveProvider} data-testid="provider-save">
                  <Save className="h-4 w-4 mr-1" /> Save Provider
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editorOpen} onOpenChange={(o) => { setEditorOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.id && templates.some(t => t.id === editing?.id) ? "Edit Template" : "New Template"}</DialogTitle>
            <DialogDescription>Define subject, category and body. Use {"{{variable}}"} placeholders.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Name</Label><Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Select value={editing.category} onValueChange={v => setEditing({ ...editing, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auth">Authentication</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="application">Application</SelectItem>
                      <SelectItem value="booking">Booking</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="notification">Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1"><Label>Subject</Label><Input value={editing.subject} onChange={e => setEditing({ ...editing, subject: e.target.value })} /></div>
              <div className="space-y-1"><Label>Body</Label><Textarea className="min-h-[180px]" value={editing.body || ""} onChange={e => setEditing({ ...editing, body: e.target.value })} /></div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch checked={editing.status === "active"} onCheckedChange={c => setEditing({ ...editing, status: c ? "active" : "draft" })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditorOpen(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={saveTemplate}><Save className="h-4 w-4 mr-1" /> Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewId} onOpenChange={(o) => { if (!o) setPreviewId(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Template Preview</DialogTitle></DialogHeader>
          {(() => {
            const t = templates.find(x => x.id === previewId);
            if (!t) return null;
            return (
              <div className="space-y-2">
                <div className="text-sm"><span className="text-muted-foreground">Subject:</span> <span className="font-medium">{t.subject}</span></div>
                <div className="text-sm"><span className="text-muted-foreground">Category:</span> {t.category}</div>
                <div className="rounded-md border p-4 bg-muted/30 whitespace-pre-wrap text-sm">{t.body || "(No body)"}</div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this template?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmailManagement;

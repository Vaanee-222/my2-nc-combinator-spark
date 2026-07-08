import { useState } from "react";
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
import { Mail, Send, FileText, Bell, Eye, Copy, Plus, Clock, CheckCircle, XCircle, Server, KeyRound, Save, PlugZap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

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

const emailTemplates = [
  { id: "welcome", name: "Welcome Email", subject: "Welcome to Xi Combinator!", category: "onboarding", status: "active", lastEdited: "2026-05-01" },
  { id: "verify", name: "Verify Email", subject: "Verify your email address", category: "auth", status: "active", lastEdited: "2026-04-28" },
  { id: "booking-confirmed", name: "Booking Confirmed", subject: "Your booking is confirmed", category: "booking", status: "active", lastEdited: "2026-04-25" },
  { id: "application-received", name: "Application Received", subject: "We received your application", category: "application", status: "active", lastEdited: "2026-04-20" },
  { id: "application-approved", name: "Application Approved", subject: "Congratulations! You're accepted", category: "application", status: "active", lastEdited: "2026-04-18" },
  { id: "application-rejected", name: "Application Rejected", subject: "Application Update", category: "application", status: "draft", lastEdited: "2026-04-15" },
  { id: "invoice", name: "Invoice", subject: "Your invoice from Xi Combinator", category: "billing", status: "active", lastEdited: "2026-04-10" },
  { id: "password-reset", name: "Password Reset", subject: "Reset your password", category: "auth", status: "active", lastEdited: "2026-04-08" },
  { id: "mentor-assigned", name: "Mentor Assigned", subject: "A mentor has been assigned to you", category: "notification", status: "active", lastEdited: "2026-04-05" },
  { id: "event-reminder", name: "Event Reminder", subject: "Upcoming event reminder", category: "notification", status: "draft", lastEdited: "2026-04-01" },
];

const emailHistory = [
  { id: 1, template: "Welcome Email", recipient: "startup@example.com", status: "delivered", sentAt: "2026-05-05 14:30" },
  { id: 2, template: "Application Received", recipient: "founder@example.com", status: "delivered", sentAt: "2026-05-05 12:15" },
  { id: 3, template: "Booking Confirmed", recipient: "investor@example.com", status: "delivered", sentAt: "2026-05-04 18:00" },
  { id: 4, template: "Invoice", recipient: "billing@startup.io", status: "failed", sentAt: "2026-05-04 10:22" },
  { id: 5, template: "Verify Email", recipient: "new@user.com", status: "delivered", sentAt: "2026-05-03 09:45" },
];

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

  useEffect(() => {
    try {
      const s = localStorage.getItem(SMTP_KEY); if (s) setSmtp({ ...defaultSmtp, ...JSON.parse(s) });
      const p = localStorage.getItem(PROVIDER_KEY); if (p) setProvider({ ...defaultProvider, ...JSON.parse(p) });
    } catch {}
  }, []);

  const filteredTemplates = categoryFilter === "all"
    ? emailTemplates
    : emailTemplates.filter(t => t.category === categoryFilter);

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
                <p className="text-2xl font-bold">{emailTemplates.length}</p>
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
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Template</Button>
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
                          <Button size="sm" variant="ghost" onClick={() => setSelectedTemplate(t.id)}><Eye className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(t.id); toast({ title: "Copied", description: `Template ID "${t.id}" copied.` }); }}><Copy className="h-4 w-4" /></Button>
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
                  <Select onValueChange={v => { const t = emailTemplates.find(et => et.id === v); if (t) setComposeSubject(t.subject); }}>
                    <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
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
      </Tabs>
    </div>
  );
};

export default EmailManagement;

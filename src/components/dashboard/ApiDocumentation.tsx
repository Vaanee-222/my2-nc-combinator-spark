import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Code2, Database, Mail, ShieldCheck, Terminal } from "lucide-react";

const methodGroups = [
  {
    name: "api.audit",
    icon: ShieldCheck,
    description: "Admin audit trail helpers.",
    methods: [
      { sig: "record(action, table, recordId?, details?)", desc: "Writes an entry to admin_audit_log. Fire-and-forget." },
      { sig: "history(table, recordId)", desc: "Full trail for one record, newest first." },
      { sig: "list(limit = 2000)", desc: "Global audit feed." },
    ],
  },
  {
    name: "api.cofounders",
    icon: Database,
    description: "Co-founder request moderation.",
    methods: [
      { sig: "list({ reviewStatus?, status? })", desc: "Server-side filtered listing." },
      { sig: "review(id, review_status, review_notes?)", desc: "Approve / reject / re-open, audited." },
      { sig: "bulkReview(ids[], review_status, notes?)", desc: "Batch moderation with a single audit row." },
      { sig: "update(id, patch)", desc: "Audited edit." },
      { sig: "remove(id)", desc: "Audited delete." },
    ],
  },
  {
    name: "api.introductions",
    icon: Mail,
    description: "Investor introduction workflow.",
    methods: [
      { sig: "list(status?)", desc: "Admin queue." },
      { sig: "mine()", desc: "RLS-scoped to the signed-in requester." },
      { sig: "setStatus(row, status)", desc: "Audits and emails the requester." },
      { sig: "setNotes(row, notes)", desc: "Audits and emails the requester." },
    ],
  },
  {
    name: "api.notifications",
    icon: Mail,
    description: "Transactional email dispatch.",
    methods: [
      { sig: "send({ event, to, recipientName?, subjectContext?, notes?, recordId? })", desc: "Sends via the send-notification edge function." },
    ],
  },
  {
    name: "api.table",
    icon: Database,
    description: "Generic audited CRUD for any table.",
    methods: [
      { sig: "list(table, orderBy?)", desc: "Ordered read." },
      { sig: "create(table, values)", desc: "Audited insert." },
      { sig: "update(table, id, patch)", desc: "Audited update." },
      { sig: "remove(table, id)", desc: "Audited delete." },
    ],
  },
];

const edgeFunctions = [
  { name: "send-notification", auth: "Bearer JWT", purpose: "Approval / rejection / update emails for introductions and co-founder requests." },
  { name: "ai-agent-chat", auth: "Bearer JWT", purpose: "Streaming AI advisory chat." },
  { name: "startup-health-score", auth: "Bearer JWT", purpose: "AI health scoring across 5 dimensions." },
  { name: "seed-demo-data", auth: "Admin only", purpose: "Seeds demo accounts and content." },
];

const CodeBlock = ({ children }: { children: string }) => (
  <pre className="rounded-md border border-border bg-muted/40 p-4 text-xs font-mono overflow-x-auto whitespace-pre">
    {children}
  </pre>
);

const ApiDocumentation = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold">API &amp; Documentation</h2>
          <p className="text-sm text-muted-foreground">
            Typed entry point for every backend read/write: <code className="font-mono">src/lib/api</code>
          </p>
        </div>
        <Badge variant="secondary">v1.0.0</Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Getting started</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <CodeBlock>{`import { api } from "@/lib/api";

const { data, error } = await api.cofounders.list({ reviewStatus: "pending" });`}</CodeBlock>
          <p className="text-sm text-muted-foreground">
            Every method returns <code className="font-mono">ApiResult&lt;T&gt; = &#123; data: T | null; error: string | null &#125;</code> — nothing throws.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {methodGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.name}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-mono">{group.name}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">{group.description}</p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[260px]">
                  <div className="space-y-3">
                    {group.methods.map((m) => (
                      <div key={m.sig}>
                        <p className="text-xs font-mono text-primary break-all">{m.sig}</p>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Edge functions (HTTP)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Function</TableHead>
                <TableHead>Auth</TableHead>
                <TableHead>Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {edgeFunctions.map((fn) => (
                <TableRow key={fn.name}>
                  <TableCell className="font-mono text-xs">{fn.name}</TableCell>
                  <TableCell className="text-xs">{fn.auth}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{fn.purpose}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="space-y-2">
            <p className="text-sm font-medium">POST /send-notification</p>
            <CodeBlock>{`// request
{
  "event": "introduction_approved",
  "to": "founder@example.com",
  "recipientName": "Aditi",
  "subjectContext": "Sequoia Surge",
  "notes": "Great traction",
  "recordId": "uuid"
}

// response
{ "delivered": true, "subject": "Your introduction request was approved" }`}</CodeBlock>
            <p className="text-xs text-muted-foreground">
              Events: introduction_approved · introduction_rejected · introduction_updated · cofounder_approved · cofounder_rejected · cofounder_updated
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">REST (PostgREST) access</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <CodeBlock>{`curl "$API_URL/rest/v1/cofounder_requests?review_status=eq.approved&select=*" \\
  -H "apikey: $ANON_KEY" \\
  -H "Authorization: Bearer $USER_JWT"`}</CodeBlock>
          <p className="text-xs text-muted-foreground">
            All tables are subject to Row Level Security; requests are scoped to the caller&apos;s role.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDocumentation;

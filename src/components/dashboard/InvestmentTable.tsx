import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import InvestmentApplicationDialog from "@/components/InvestmentApplicationDialog";
import { useMyInvestorInquiries, formatDate } from "@/hooks/useMyData";

const InvestmentTable = () => {
  const { data: inquiries = [], isLoading } = useMyInvestorInquiries();
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investment Applications</h2>
        <InvestmentApplicationDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </InvestmentApplicationDialog>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading investment applications…</p>
          ) : inquiries.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No investment applications yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investor</TableHead>
                  <TableHead>Ticket Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((app: any) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.investor_name}{app.firm ? ` — ${app.firm}` : ""}</TableCell>
                    <TableCell>{app.ticket_size}</TableCell>
                    <TableCell>
                      <Badge variant={app.status === "accepted" ? "default" : "secondary"} className="capitalize">
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(app.created_at)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelected(app)}>View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.investor_name}</DialogTitle>
            <DialogDescription>
              Submitted {formatDate(selected?.created_at)} • Status: {selected?.status}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              {[
                ["Startup", selected.startup_name],
                ["Firm", selected.firm],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Investor type", selected.investor_type],
                ["Ticket size", selected.ticket_size],
                ["Stage preference", selected.stage_preference],
                ["Instrument", selected.instrument],
                ["Timeline", selected.timeline],
                ["Profile", selected.profile_url],
                ["Message", selected.message],
                ["Admin notes", selected.admin_notes],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between gap-4 border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-right font-medium break-all">{value || "—"}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentTable;

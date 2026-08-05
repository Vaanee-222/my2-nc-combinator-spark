import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecordManager, { StatusBadge } from "@/components/dashboard/RecordManager";
import { Cloud, TrendingDown, TrendingUp, Wallet } from "lucide-react";

interface LedgerRow {
  provider: string;
  entry_type: string;
  amount_usd: number | string;
  status: string;
}

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const LedgerSummary = () => {
  const [rows, setRows] = useState<LedgerRow[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("cloud_credit_ledger")
        .select("provider, entry_type, amount_usd, status");
      if (active) setRows((data as LedgerRow[]) ?? []);
    })();
    return () => { active = false; };
  }, []);

  const totals = useMemo(() => {
    const approved = rows.filter((r) => r.status === "approved");
    const sum = (type: string) =>
      approved.filter((r) => r.entry_type === type).reduce((acc, r) => acc + Number(r.amount_usd ?? 0), 0);
    const allocated = sum("allocation") + sum("adjustment");
    const redeemed = sum("redemption");
    const byProvider = new Map<string, number>();
    approved.forEach((r) => {
      const delta = r.entry_type === "redemption" ? -Number(r.amount_usd ?? 0) : Number(r.amount_usd ?? 0);
      byProvider.set(r.provider, (byProvider.get(r.provider) ?? 0) + delta);
    });
    return {
      allocated,
      redeemed,
      remaining: allocated - redeemed,
      pending: rows.filter((r) => r.status === "pending").length,
      byProvider: Array.from(byProvider.entries()).sort((a, b) => b[1] - a[1]),
    };
  }, [rows]);

  const cards = [
    { label: "Approved allocations", value: money(totals.allocated), icon: TrendingUp },
    { label: "Redeemed", value: money(totals.redeemed), icon: TrendingDown },
    { label: "Remaining balance", value: money(totals.remaining), icon: Wallet },
    { label: "Awaiting approval", value: String(totals.pending), icon: Cloud },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {totals.byProvider.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Remaining balance by provider</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {totals.byProvider.map(([provider, amount]) => (
              <div key={provider} className="rounded-lg border border-border px-3 py-2">
                <p className="text-xs text-muted-foreground">{provider}</p>
                <p className="font-semibold">{money(amount)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const CloudCreditLedger = () => (
  <div className="space-y-6">
    <LedgerSummary />
    <RecordManager
      table="cloud_credit_ledger"
      title="Ledger Entry"
      description="Track credit allocations, redemptions and adjustments. Entries only count towards balances once approved."
      statusKey="status"
      statusOptions={["pending", "approved", "rejected"]}
      searchKeys={["startup_name", "beneficiary_email", "provider", "reference"]}
      defaults={{ status: "pending", entry_type: "allocation" }}
      columns={[
        { key: "startup_name", label: "Startup" },
        { key: "beneficiary_email", label: "Beneficiary" },
        { key: "provider", label: "Provider" },
        { key: "entry_type", label: "Type" },
        { key: "amount_usd", label: "Amount", render: (r) => money(Number(r.amount_usd ?? 0)) },
        { key: "reference", label: "Reference" },
        { key: "occurred_on", label: "Date" },
        { key: "status", label: "Approval", render: (r) => <StatusBadge value={r.status} /> },
      ]}
      fields={[
        { key: "startup_name", label: "Startup", required: true },
        { key: "beneficiary_email", label: "Beneficiary email" },
        { key: "provider", label: "Provider", required: true, placeholder: "AWS, Google Cloud, Azure…" },
        { key: "entry_type", label: "Entry type", type: "select", options: ["allocation", "redemption", "adjustment"] },
        { key: "amount_usd", label: "Amount (USD)", type: "number" },
        { key: "occurred_on", label: "Date (YYYY-MM-DD)" },
        { key: "reference", label: "Reference / voucher code" },
        { key: "supporting_url", label: "Supporting document URL" },
        { key: "status", label: "Approval status", type: "select", options: ["pending", "approved", "rejected"] },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      emptyMessage="No ledger entries yet. Create one to record an allocation."
    />
  </div>
);

export default CloudCreditLedger;

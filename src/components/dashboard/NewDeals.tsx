import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSourceableStartups, useMyDeals, useIncomingIntroductions } from "@/hooks/useInvestorData";
import { formatDate as formatDealDate } from "@/hooks/useMyData";

const NewDeals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: startups = [], isLoading } = useSourceableStartups();
  const { data: deals = [] } = useMyDeals();
  const { data: intros = [] } = useIncomingIntroductions();
  const [sector, setSector] = useState("all");
  const [stage, setStage] = useState("all");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState<string | null>(null);

  const sectors = useMemo(
    () => Array.from(new Set(startups.map((s: any) => s.sector).filter(Boolean))).sort(),
    [startups],
  );
  const stages = useMemo(
    () => Array.from(new Set(startups.map((s: any) => s.stage).filter(Boolean))).sort(),
    [startups],
  );

  const sourcedIds = useMemo(() => new Set(deals.map((d: any) => d.startup_id).filter(Boolean)), [deals]);

  const filtered = useMemo(
    () =>
      startups.filter((s: any) => {
        const matchSector = sector === "all" || s.sector === sector;
        const matchStage = stage === "all" || s.stage === stage;
        const matchSearch = !search || `${s.name} ${s.description ?? ""}`.toLowerCase().includes(search.toLowerCase());
        return matchSector && matchStage && matchSearch;
      }),
    [startups, sector, stage, search],
  );

  const sourceDeal = async (startup: any) => {
    setAdding(startup.id);
    const { error } = await supabase.from("investor_deals").insert({
      user_id: user!.id,
      startup_id: startup.id,
      company_name: startup.name,
      sector: startup.sector,
      stage: "Sourced",
      progress: 10,
      team_size: null,
      founded_year: startup.founded_year ?? null,
      source: "Directory",
    });
    setAdding(null);
    if (error) {
      toast({ title: "Could not add deal", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Added to pipeline", description: `${startup.name} is now in Sourced.` });
    queryClient.invalidateQueries({ queryKey: ["investor-deals", user?.id] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl font-bold">New Investment Opportunities</h2>
        <Button variant="outline" onClick={() => navigate("/startup-directory")}>Browse full directory</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search startups" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Sector" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sectors</SelectItem>
            {sectors.map((s: any) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Stage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {stages.map((s: any) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {intros.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Introduction requests to you</CardTitle>
            <CardDescription>Founders who asked to be connected.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {intros.map((i: any) => (
              <div key={i.id} className="flex flex-wrap justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{i.startup_name || i.requester_name}</p>
                  <p className="text-sm text-muted-foreground">{i.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">{i.status}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDealDate(i.created_at)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading opportunities…</p>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-6 text-sm text-muted-foreground">No startups match these filters.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((s: any) => (
            <Card key={s.id} className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="text-lg">{s.name}</CardTitle>
                <CardDescription>
                  {[s.stage, s.sector, s.country].filter(Boolean).join(" • ")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{s.description || "No description provided."}</p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    size="sm"
                    disabled={sourcedIds.has(s.id) || adding === s.id}
                    onClick={() => sourceDeal(s)}
                  >
                    {sourcedIds.has(s.id) ? "In pipeline" : adding === s.id ? "Adding…" : "Add to pipeline"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/startup-profile/${s.slug ?? s.id}`)}>
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewDeals;

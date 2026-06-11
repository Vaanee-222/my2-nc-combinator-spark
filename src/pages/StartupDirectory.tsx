import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, TrendingUp, MapPin, Search, Filter, Globe2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StartupProfileDialog from "@/components/StartupProfileDialog";
import IncApplicationDialog from "@/components/IncApplicationDialog";
import { supabase } from "@/integrations/supabase/client";
import { GLOBAL_STARTUPS, COUNTRIES, REGIONS, type StartupSeed } from "@/data/globalStartups";
import { trackEvent } from "@/lib/analytics";

type StartupRow = StartupSeed & { id?: string };

const PAGE_SIZE = 9;

const StartupDirectory = () => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [all, setAll] = useState<StartupRow[]>(GLOBAL_STARTUPS);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All Sectors");
  const [stage, setStage] = useState("All Stages");
  const [country, setCountry] = useState("All Countries");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).from("startups").select("*").eq("is_active", true).order("sort_order");
      if (data && data.length > 0) setAll(data as StartupRow[]);
    })();
  }, []);

  const sectors = useMemo(() => ["All Sectors", ...Array.from(new Set(all.map((s) => s.sector)))], [all]);
  const stages = useMemo(() => ["All Stages", ...Array.from(new Set(all.map((s) => s.stage)))], [all]);
  const countries = useMemo(() => ["All Countries", ...Array.from(new Set([...COUNTRIES, ...all.map((s) => s.country)]))], [all]);

  const filtered = useMemo(() => {
    return all.filter((s) => {
      const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.description ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesSector = sector === "All Sectors" || s.sector === sector;
      const matchesStage = stage === "All Stages" || s.stage === stage;
      const matchesCountry = country === "All Countries" || s.country === country;
      return matchesSearch && matchesSector && matchesStage && matchesCountry;
    });
  }, [all, search, sector, stage, country]);

  const shown = filtered.slice(0, visible);

  const handleCountryChange = (c: string) => {
    setCountry(c);
    setVisible(PAGE_SIZE);
    trackEvent("startup_filter_country", { country: c });
  };

  const handleView = (s: any) => { setSelected(s); setProfileOpen(true); };
  const handleConnect = (s: any) => toast({ title: "Connection Request Sent", description: `Sent to ${s.name}` });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-4">
            <Globe2 className="h-3.5 w-3.5" /> Global Directory
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Startup Directory
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover breakout startups from around the world. Connect with founders building solutions to humanity's biggest challenges across markets.
          </p>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: "Total Startups", value: `${all.length}+`, sub: `Across ${sectors.length - 1}+ sectors`, Icon: Building2 },
            { title: "Active Founders", value: "5,200+", sub: "Building globally", Icon: Users },
            { title: "Total Funding", value: "$42B+", sub: "Raised collectively", Icon: TrendingUp },
            { title: "Countries", value: `${countries.length - 1}+`, sub: "Around the world", Icon: Globe2 },
          ].map((s, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                <s.Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{s.value}</div>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" /><span>Filter Startups</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search startups..." className="pl-10" value={search} onChange={(e) => { setSearch(e.target.value); setVisible(PAGE_SIZE); }} />
              </div>
              <Select value={sector} onValueChange={(v) => { setSector(v); setVisible(PAGE_SIZE); }}>
                <SelectTrigger><SelectValue placeholder="Sector" /></SelectTrigger>
                <SelectContent>{sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={stage} onValueChange={(v) => { setStage(v); setVisible(PAGE_SIZE); }}>
                <SelectTrigger><SelectValue placeholder="Stage" /></SelectTrigger>
                <SelectContent>{stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={country} onValueChange={handleCountryChange}>
                <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent>{countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((s, i) => (
            <Card key={s.id ?? s.slug ?? i} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate">{s.name}</CardTitle>
                      <CardDescription className="text-sm truncate">{s.website}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0">{s.stage}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{s.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(s.tags ?? []).map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-muted-foreground">Sector</p><p className="font-medium">{s.sector}</p></div>
                  <div><p className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />Country</p><p className="font-medium">{s.country}</p></div>
                  <div><p className="text-muted-foreground">Founded</p><p className="font-medium">{s.founded_year}</p></div>
                  <div><p className="text-muted-foreground">Team</p><p className="font-medium">{s.team_size}</p></div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1" size="sm" onClick={() => handleView(s)}>View Profile</Button>
                  <Button variant="outline" size="sm" onClick={() => handleConnect(s)}>Connect</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {visible < filtered.length && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Load More Startups ({filtered.length - visible} remaining)
            </Button>
          </div>
        )}

        {shown.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No startups match your filters. Try resetting one of them.</div>
        )}

        {/* CTA */}
        <section className="text-center py-16 mt-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Want to be Featured?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Xi Combinator and get your startup featured in our global directory.
          </p>
          <IncApplicationDialog>
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
              Apply to Xi Combinator
            </Button>
          </IncApplicationDialog>
        </section>
      </main>

      {selected && (
        <StartupProfileDialog
          open={profileOpen}
          onOpenChange={setProfileOpen}
          startup={selected}
          onConnect={() => handleConnect(selected)}
        />
      )}
      <Footer />
    </div>
  );
};

export default StartupDirectory;

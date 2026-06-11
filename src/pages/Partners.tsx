import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Globe2, ExternalLink, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Partner {
  id: string;
  name: string;
  note: string | null;
  website_url: string | null;
  logo_url: string | null;
  description: string | null;
  sort_order: number;
}

interface Region {
  id: string;
  name: string;
  flag: string | null;
  description: string | null;
  sort_order: number;
  partners: Partner[];
}

const Partners = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<(Partner & { regionName?: string; regionFlag?: string | null }) | null>(null);

  useEffect(() => {
    const load = async () => {
      const [rRes, pRes] = await Promise.all([
        (supabase as any).from("partner_regions").select("*").eq("is_active", true).order("sort_order"),
        (supabase as any).from("partners").select("*").eq("is_active", true).order("sort_order"),
      ]);
      const partners: any[] = pRes.data ?? [];
      const merged: Region[] = (rRes.data ?? []).map((r: any) => ({
        ...r,
        partners: partners.filter((p) => p.region_id === r.id),
      }));
      setRegions(merged);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
            <Globe2 className="h-3.5 w-3.5" /> Global Network
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Our Partners
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            A trusted network of accelerators, investors, consultants, and ecosystem partners spanning five regions —
            helping Xi Combinator founders scale beyond borders from day one.
          </p>
        </section>

        {/* Regions */}
        <section className="container mx-auto px-4 pb-16 space-y-12">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading partners…</p>
          ) : regions.length === 0 ? (
            <p className="text-center text-muted-foreground">No partners yet.</p>
          ) : (
            regions.map((region) => (
              <div key={region.id} className="space-y-5">
                <div className="flex items-end justify-between border-b border-border/60 pb-3">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <span className="text-3xl" aria-hidden>{region.flag}</span>
                      {region.name}
                    </h2>
                    {region.description && (
                      <p className="text-sm text-muted-foreground mt-1">{region.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground hidden md:block">
                    {region.partners.length} {region.partners.length === 1 ? "partner" : "partners"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {region.partners.map((p) => (
                    <Card
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelected({ ...p, regionName: region.name, regionFlag: region.flag })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected({ ...p, regionName: region.name, regionFlag: region.flag });
                        }
                      }}
                      className="p-5 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden">
                          {p.logo_url ? (
                            <img src={p.logo_url} alt={p.name} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold leading-tight">{p.name}</h3>
                          {p.note && <p className="text-xs text-muted-foreground mt-0.5">{p.note}</p>}
                        </div>
                      </div>
                      {p.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{p.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-primary hover:underline">View details →</span>
                        {p.website_url && (
                          <a
                            href={p.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                          >
                            Website <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 pb-20">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-orange-500/5 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Become an Xi Combinator Partner</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join our global network to co-build the next generation of breakout startups across regions.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/partnership">Explore Partnership Programs</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Partner detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center overflow-hidden shrink-0">
                {selected?.logo_url ? (
                  <img src={selected.logo_url} alt={selected.name} className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="h-6 w-6" />
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate">{selected?.name}</div>
                {selected?.regionName && (
                  <div className="text-xs font-normal text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <span>{selected.regionFlag}</span> {selected.regionName}
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            {(selected as any)?.partnership_tier && (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {(selected as any).partnership_tier} Partner
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {(selected as any)?.headquarters && (
                <div><div className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">Headquarters</div><p>{(selected as any).headquarters}</p></div>
              )}
              {(selected as any)?.founded_year && (
                <div><div className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">Founded</div><p>{(selected as any).founded_year}</p></div>
              )}
            </div>
            {selected?.note && (
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Focus</div>
                <p>{selected.note}</p>
              </div>
            )}
            {selected?.description && (
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">About</div>
                <p className="text-muted-foreground whitespace-pre-line">{selected.description}</p>
              </div>
            )}
            {Array.isArray((selected as any)?.benefits) && (selected as any).benefits.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Benefits</div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {(selected as any).benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            )}
            <div className="flex gap-2">
              {selected?.website_url && (
                <Button asChild variant="outline" className="flex-1">
                  <a href={selected.website_url} target="_blank" rel="noopener noreferrer">
                    Visit website <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                  </a>
                </Button>
              )}
              {(selected as any)?.case_study_url && (
                <Button asChild variant="outline" className="flex-1">
                  <a href={(selected as any).case_study_url} target="_blank" rel="noopener noreferrer">
                    Case study <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <Footer />
    </div>
  );
};

export default Partners;

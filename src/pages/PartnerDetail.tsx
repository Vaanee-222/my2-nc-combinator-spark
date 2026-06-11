import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ExternalLink, MapPin, Calendar, ArrowLeft, CheckCircle2, Globe2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Partner = {
  id: string;
  slug: string;
  name: string;
  note: string | null;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  case_study_url: string | null;
  founded_year: number | null;
  headquarters: string | null;
  partnership_tier: string | null;
  category: string | null;
  benefits: string[] | null;
  region_id: string;
};

const PartnerDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [regionName, setRegionName] = useState<string | null>(null);
  const [related, setRelated] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from("partners")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (cancelled) return;
      setPartner(data ?? null);
      if (data) {
        const [{ data: region }, { data: more }] = await Promise.all([
          (supabase as any).from("partner_regions").select("name").eq("id", data.region_id).maybeSingle(),
          (supabase as any).from("partners").select("*").eq("region_id", data.region_id).neq("id", data.id).eq("is_active", true).limit(3),
        ]);
        if (!cancelled) {
          setRegionName(region?.name ?? null);
          setRelated((more as any) ?? []);
        }
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      {partner && (
        <Helmet>
          <title>{`${partner.name} — Xi Combinator Partner`}</title>
          <meta name="description" content={partner.tagline ?? partner.note ?? partner.description ?? `${partner.name} is a Xi Combinator partner.`} />
          <link rel="canonical" href={`/partners/${partner.slug}`} />
          <meta property="og:title" content={partner.name} />
          <meta property="og:description" content={partner.tagline ?? partner.note ?? ""} />
          <meta property="og:type" content="profile" />
          {partner.logo_url && <meta property="og:image" content={partner.logo_url} />}
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: partner.name,
            url: partner.website_url ?? undefined,
            logo: partner.logo_url ?? undefined,
            description: partner.description ?? partner.tagline ?? undefined,
            foundingDate: partner.founded_year ?? undefined,
            address: partner.headquarters ?? undefined,
          })}</script>
        </Helmet>
      )}

      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12 max-w-5xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/partners")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> All partners
        </Button>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !partner ? (
          <Card>
            <CardContent className="py-12 text-center space-y-3">
              <Building2 className="h-10 w-10 mx-auto text-muted-foreground" />
              <h1 className="text-xl font-semibold">Partner not found</h1>
              <Button asChild><Link to="/partners">Browse partners</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-start gap-5 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden border border-border/60">
                {partner.logo_url ? (
                  <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="h-10 w-10" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {partner.category && <Badge variant="outline">{partner.category}</Badge>}
                  {partner.partnership_tier && <Badge>{partner.partnership_tier} Partner</Badge>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{partner.name}</h1>
                {partner.tagline && <p className="text-lg text-muted-foreground mt-1">{partner.tagline}</p>}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                  {partner.headquarters && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{partner.headquarters}</span>}
                  {partner.founded_year && <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Founded {partner.founded_year}</span>}
                  {regionName && <span className="flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5" />{regionName}</span>}
                </div>
                <div className="flex gap-2 mt-4">
                  {partner.website_url && (
                    <Button asChild variant="default">
                      <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                        Visit website <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                      </a>
                    </Button>
                  )}
                  {partner.case_study_url && (
                    <Button asChild variant="outline">
                      <a href={partner.case_study_url} target="_blank" rel="noopener noreferrer">
                        Case study <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {partner.description && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">About {partner.name}</h2>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{partner.description}</p>
                </CardContent>
              </Card>
            )}

            {Array.isArray(partner.benefits) && partner.benefits.length > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Benefits for Xi Combinator startups</h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {partner.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {related.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">More partners in this region</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {related.map((r) => (
                      <Link key={r.id} to={`/partners/${r.slug}`} className="block p-4 rounded-lg bg-muted/40 hover:bg-muted transition-colors">
                        <p className="font-medium">{r.name}</p>
                        {r.note && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.note}</p>}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PartnerDetail;

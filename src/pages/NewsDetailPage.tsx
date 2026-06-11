import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ArrowLeft, ExternalLink, Share2, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NEWS_2026 } from "@/data/news2026";

type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  category: string;
  source: string;
  source_url?: string | null;
  impact?: string | null;
  published_at: string;
};

const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from("news")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      let found: NewsItem | null = data ?? null;
      if (!found) found = (NEWS_2026 as any[]).find((n) => n.slug === slug) ?? null;
      if (cancelled) return;
      setItem(found);
      if (data) {
        const { data: rel } = await (supabase as any).from("news").select("*").eq("is_published", true).neq("slug", slug).order("published_at", { ascending: false }).limit(3);
        setRelated((rel as any) ?? []);
      } else {
        setRelated((NEWS_2026 as any[]).filter((n) => n.slug !== slug).slice(0, 3));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (item?.title) document.title = `${item.title} — Xi News`;
  }, [item]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-6" onClick={() => navigate("/news")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to News
          </Button>

          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : !item ? (
            <Card>
              <CardContent className="py-12 text-center space-y-3">
                <Newspaper className="h-10 w-10 mx-auto text-muted-foreground" />
                <h2 className="text-xl font-semibold">News article not found</h2>
                <Button onClick={() => navigate("/news")}>Browse all news</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{item.category}</Badge>
                  {item.impact && <Badge variant="secondary">{item.impact} Impact</Badge>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">{item.title}</h1>
                <p className="text-lg text-muted-foreground">{item.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span>Source: {item.source}</span>
                  <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{fmt(item.published_at)}</div>
                </div>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none mb-10">
                <div className="whitespace-pre-line text-base leading-relaxed">
                  {item.content ?? item.excerpt}
                </div>
              </div>

              <Card className="mb-10">
                <CardContent className="pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      if (navigator.share) navigator.share({ title: item.title, url: window.location.href }).catch(() => {});
                      else navigator.clipboard?.writeText(window.location.href);
                    }}>
                      <Share2 className="h-4 w-4 mr-2" /> Share
                    </Button>
                    {item.source_url && (
                      <Button asChild variant="outline" size="sm">
                        <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                          Original Source <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {related.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Related News</h3>
                    <div className="space-y-3">
                      {related.map((r) => (
                        <Link key={r.slug} to={`/news/${r.slug}`} className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <p className="font-medium">{r.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{r.source} • {fmt(r.published_at)}</p>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetailPage;

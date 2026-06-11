import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, TrendingUp, DollarSign, Building2, Search, ExternalLink, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NEWS_2026 } from "@/data/news2026";

type NewsItem = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  source: string;
  source_url?: string;
  impact?: string;
  published_at: string;
  is_breaking?: boolean;
};

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
};

const News = () => {
  const [items, setItems] = useState<NewsItem[]>(NEWS_2026 as NewsItem[]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).from("news").select("*").eq("is_published", true).order("published_at", { ascending: false });
      if (data && data.length > 0) setItems(data as any);
    })();
  }, []);

  const filtered = useMemo(
    () => items.filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const breaking = filtered.find((n) => n.is_breaking) ?? filtered[0];
  const byCategory = (cat: string) => filtered.filter((n) => n.category === cat && n !== breaking);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Startup News & Updates
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time coverage of global startup funding, policy, market trends, and ecosystem updates.
          </p>
        </section>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search news..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {breaking && (
          <Card className="mb-8 border-primary/40 bg-primary/5">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Badge variant="destructive" className="animate-pulse">Breaking</Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" /><span>{fmtTime(breaking.published_at)}</span>
                </div>
              </div>
              <CardTitle className="text-xl">{breaking.title}</CardTitle>
              <CardDescription>{breaking.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">{breaking.category}</Badge>
                  <span className="text-sm text-muted-foreground">{breaking.source}</span>
                </div>
                <Button asChild size="sm"><Link to={`/news/${breaking.slug}`}>Read Full Story <ExternalLink className="ml-2 h-3 w-3" /></Link></Button>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" /><span>Top Stories</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filtered.filter((n) => n !== breaking).slice(0, 3).map((s) => (
              <Card key={s.slug} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{s.category}</Badge>
                    <Newspaper className="h-5 w-5 text-primary/60" />
                  </div>
                  <CardTitle className="text-lg leading-tight">{s.title}</CardTitle>
                  <CardDescription>{s.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{s.source}</span>
                    <div className="flex items-center space-x-1"><Clock className="h-3 w-3" /><span>{fmtTime(s.published_at)}</span></div>
                  </div>
                  <Button asChild className="w-full" variant="outline"><Link to={`/news/${s.slug}`}>Read More</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Tabs defaultValue="Funding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="Funding"><DollarSign className="h-4 w-4 mr-2" />Funding</TabsTrigger>
            <TabsTrigger value="Policy"><Building2 className="h-4 w-4 mr-2" />Policy</TabsTrigger>
            <TabsTrigger value="Market"><TrendingUp className="h-4 w-4 mr-2" />Market</TabsTrigger>
            <TabsTrigger value="AI"><Newspaper className="h-4 w-4 mr-2" />AI</TabsTrigger>
          </TabsList>

          {(["Funding", "Policy", "Market", "AI"] as const).map((cat) => (
            <TabsContent key={cat} value={cat} className="space-y-4">
              <h3 className="text-2xl font-bold">Latest {cat} News</h3>
              {byCategory(cat).length === 0 ? (
                <p className="text-muted-foreground text-sm">No news in this category yet.</p>
              ) : byCategory(cat).map((n) => (
                <Card key={n.slug}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{n.title}</h4>
                        <p className="text-muted-foreground text-sm mb-2">{n.excerpt}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{n.source}</span>
                          <span>•</span>
                          <span>{fmtTime(n.published_at)}</span>
                          {n.impact && <><span>•</span><Badge variant="outline" className="text-xs">{n.impact} Impact</Badge></>}
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm"><Link to={`/news/${n.slug}`}>Details</Link></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <Card className="bg-gradient-to-r from-primary/10 to-orange-400/10 mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Daily Startup Briefing</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get the most important global startup news every morning.
            </p>
            <div className="flex max-w-md mx-auto space-x-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default News;

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, Share2, ArrowLeft, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BLOGS_2026 } from "@/data/blogs2026";

type Blog = {
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  author: string;
  category: string;
  tags: string[];
  read_time_minutes: number;
  published_at: string;
  cover_image_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
};

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      // DB first
      const { data } = await (supabase as any)
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      let found: Blog | null = data ?? null;
      if (!found) {
        found = (BLOGS_2026 as any[]).find((b) => b.slug === slug) ?? null;
      }
      if (cancelled) return;
      setPost(found);
      // related
      const cat = found?.category;
      const allSrc: Blog[] = data ? [] : (BLOGS_2026 as any);
      if (data) {
        const { data: rel } = await (supabase as any)
          .from("blogs")
          .select("*")
          .eq("is_published", true)
          .neq("slug", slug)
          .limit(3);
        setRelated((rel as any) ?? []);
      } else {
        setRelated(allSrc.filter((b) => b.slug !== slug && b.category === cat).slice(0, 3));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (post?.title) document.title = `${post.title} — Xi Combinator`;
  }, [post]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      {post && (
        <Helmet>
          <title>{post.meta_title || `${post.title} — Xi Combinator`}</title>
          <meta name="description" content={post.meta_description || post.excerpt} />
          <link rel="canonical" href={`/blog/${post.slug}`} />
          <meta property="og:title" content={post.meta_title || post.title} />
          <meta property="og:description" content={post.meta_description || post.excerpt} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`/blog/${post.slug}`} />
          {(post.og_image_url || post.cover_image_url) && (
            <meta property="og:image" content={post.og_image_url || post.cover_image_url || ""} />
          )}
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            author: { "@type": "Person", name: post.author },
            datePublished: post.published_at,
            articleSection: post.category,
            image: post.og_image_url || post.cover_image_url || undefined,
          })}</script>
        </Helmet>
      )}
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-6" onClick={() => navigate("/blogs")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Articles
          </Button>

          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : !post ? (
            <Card>
              <CardContent className="py-12 text-center space-y-3">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                <h2 className="text-xl font-semibold">Article not found</h2>
                <Button onClick={() => navigate("/blogs")}>Browse all articles</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-5 mb-8">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">{post.title}</h1>
                <p className="text-lg text-muted-foreground">{post.excerpt}</p>
                <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><User className="h-4 w-4" />{post.author}</div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{fmt(post.published_at)}</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{post.read_time_minutes} min read</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(post.tags ?? []).map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </div>

              {post.cover_image_url && (
                <img src={post.cover_image_url} alt={post.title} className="w-full rounded-xl mb-8" />
              )}

              <div className="prose prose-gray dark:prose-invert max-w-none mb-10">
                <div className="whitespace-pre-line text-base leading-relaxed">
                  {post.content ?? post.excerpt}
                </div>
              </div>

              <Card className="mb-10">
                <CardContent className="pt-6 flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => {
                    if (navigator.share) navigator.share({ title: post.title, url: window.location.href }).catch(() => {});
                    else navigator.clipboard?.writeText(window.location.href);
                  }}>
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                  <span className="text-xs text-muted-foreground">Published {fmt(post.published_at)}</span>
                </CardContent>
              </Card>

              {related.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {related.map((r) => (
                        <Link key={r.slug} to={`/blog/${r.slug}`} className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <Badge variant="outline" className="text-xs mb-2">{r.category}</Badge>
                          <h4 className="font-medium leading-snug">{r.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{r.author} • {r.read_time_minutes} min</p>
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

export default BlogDetailPage;

import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Clock, Search, Tag, FileText } from "lucide-react";
import BlogDetail from "@/components/BlogDetail";
import { supabase } from "@/integrations/supabase/client";
import { BLOGS_2026 } from "@/data/blogs2026";

type Blog = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  category: string;
  tags: string[];
  read_time_minutes: number;
  published_at: string;
  is_featured?: boolean;
};

const Blogs = () => {
  const [posts, setPosts] = useState<Blog[]>(BLOGS_2026 as Blog[]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (data && data.length > 0) setPosts(data as any);
    })();
  }, []);

  const categories = useMemo(
    () => ["All Categories", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  );

  const filtered = posts.filter((p) => {
    const matchesS = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchesC = category === "All Categories" || p.category === category;
    return matchesS && matchesC;
  });

  const featured = filtered.find((p) => p.is_featured) ?? filtered[0];
  const rest = filtered.filter((p) => p !== featured);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Startup Insights & Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Thought-leadership for global founders. Funding analysis, founder playbooks, ecosystem insights, and market commentary.
          </p>
        </section>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {featured && (
          <Card className="mb-12 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 flex items-center justify-center bg-gradient-to-br from-primary/10 to-orange-400/10">
                <FileText className="h-24 w-24 text-primary/40" />
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="default">Featured</Badge>
                  <Badge variant="outline">{featured.category}</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-4">{featured.title}</h2>
                <p className="text-muted-foreground mb-6">{featured.excerpt}</p>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center space-x-2"><User className="h-4 w-4" /><span>{featured.author}</span></div>
                  <div className="flex items-center space-x-2"><Calendar className="h-4 w-4" /><span>{fmtDate(featured.published_at)}</span></div>
                  <div className="flex items-center space-x-2"><Clock className="h-4 w-4" /><span>{featured.read_time_minutes} min read</span></div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featured.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
                <BlogDetail blog={featured as any}><Button size="lg">Read Article</Button></BlogDetail>
              </div>
            </div>
          </Card>
        )}

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2"><Tag className="h-5 w-5" /><span>Categories</span></h3>
          <div className="flex flex-wrap gap-2">
            {categories.slice(1).map((c) => (
              <Badge key={c} variant={category === c ? "default" : "outline"} className="cursor-pointer" onClick={() => setCategory(c)}>{c}</Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {rest.map((post) => (
            <Card key={post.slug} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <FileText className="h-5 w-5 text-primary/60" />
                </div>
                <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1"><User className="h-3 w-3" /><span>{post.author}</span></div>
                  <div className="flex items-center space-x-1"><Calendar className="h-3 w-3" /><span>{fmtDate(post.published_at)}</span></div>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" /><span>{post.read_time_minutes} min read</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
                <BlogDetail blog={post as any}><Button className="w-full" variant="outline">Read More</Button></BlogDetail>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-orange-400/10">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated With Founder Insights</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Weekly thought-leadership, funding analysis, and founder playbooks delivered to your inbox.
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

export default Blogs;

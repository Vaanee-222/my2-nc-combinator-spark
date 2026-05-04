import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Clock, Search, Tag, TrendingUp } from "lucide-react";
import BlogDetail from "@/components/BlogDetail";

const Blogs = () => {
  const featuredPost = {
    id: 1,
    title: "The Future of Indian Startups: Trends to Watch in 2025",
    excerpt: "From AI integration to sustainable tech, discover the key trends that will shape the Indian startup ecosystem in the coming year.",
    author: "Ravi Kumar",
    date: "Dec 20, 2024",
    readTime: "8 min read",
    category: "Trends",
    image: "📈",
    tags: ["AI", "Sustainability", "Future Tech"]
  };

  const blogPosts = [
    {
      id: 2,
      title: "Raising Your First Round: A Complete Guide for Indian Founders",
      excerpt: "Everything you need to know about raising seed funding in India, from pitch decks to term sheets.",
      author: "Priya Sharma",
      date: "Dec 18, 2024",
      readTime: "12 min read",
      category: "Funding",
      image: "💰",
      tags: ["Funding", "Seed Round", "Pitch Deck"]
    },
    {
      id: 3,
      title: "Building for Bharat: Designing Products for Rural India",
      excerpt: "Key insights on creating technology solutions that work for India's rural population.",
      author: "Amit Singh",
      date: "Dec 15, 2024",
      readTime: "6 min read",
      category: "Product",
      image: "🌾",
      tags: ["Rural", "Product Design", "Bharat"]
    },
    {
      id: 4,
      title: "The MVP Trap: Why Your First Version Shouldn't Be Perfect",
      excerpt: "Learn why shipping an imperfect MVP is better than waiting for the perfect product.",
      author: "Neha Gupta",
      date: "Dec 12, 2024",
      readTime: "5 min read",
      category: "Product",
      image: "🚀",
      tags: ["MVP", "Product Development", "Lean Startup"]
    },
    {
      id: 5,
      title: "Customer Discovery in the Indian Market: A Practical Approach",
      excerpt: "How to conduct effective customer interviews and validate your startup idea in India.",
      author: "Rohit Agarwal",
      date: "Dec 10, 2024",
      readTime: "10 min read",
      category: "Research",
      image: "🔍",
      tags: ["Customer Discovery", "Market Research", "Validation"]
    },
    {
      id: 6,
      title: "Scaling Your Startup Team: Hiring Best Practices",
      excerpt: "Strategic insights on building and scaling your startup team in the Indian context.",
      author: "Kavya Reddy",
      date: "Dec 8, 2024",
      readTime: "7 min read",
      category: "Team",
      image: "👥",
      tags: ["Hiring", "Team Building", "Scaling"]
    },
    {
      id: 7,
      title: "Fintech Revolution: Opportunities in Digital Payments",
      excerpt: "Exploring the untapped opportunities in India's rapidly growing digital payments sector.",
      author: "Suresh Patel",
      date: "Dec 5, 2024",
      readTime: "9 min read",
      category: "Fintech",
      image: "💳",
      tags: ["Fintech", "Digital Payments", "UPI"]
    },
    {
      id: 8,
      title: "The Art of Pivoting: When and How to Change Direction",
      excerpt: "Recognizing when your startup needs to pivot and executing the transition successfully.",
      author: "Anjali Mehta",
      date: "Dec 2, 2024",
      readTime: "8 min read",
      category: "Strategy",
      image: "🔄",
      tags: ["Pivot", "Strategy", "Adaptation"]
    },
    {
      id: 9,
      title: "Building in Public: The Indian Founder's Guide",
      excerpt: "How Indian startups can leverage building in public to gain customers and investors.",
      author: "Vikram Singh",
      date: "Nov 28, 2024",
      readTime: "6 min read",
      category: "Marketing",
      image: "📢",
      tags: ["Building in Public", "Marketing", "Community"]
    }
  ];

  const categories = ["All Categories", "Funding", "Product", "Marketing", "Team", "Strategy", "Fintech", "Research", "Trends"];
  const authors = ["All Authors", "Ravi Kumar", "Priya Sharma", "Amit Singh", "Neha Gupta", "Rohit Agarwal"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Startup Insights & Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn from successful founders, industry experts, and IC Combinator mentors. Get actionable insights to build and scale your startup.
          </p>
        </section>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(" ", "-")}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author} value={author.toLowerCase().replace(" ", "-")}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Featured Post */}
        <Card className="mb-12 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 flex items-center justify-center bg-gradient-to-br from-primary/10 to-orange-400/10">
              <div className="text-8xl">{featuredPost.image}</div>
            </div>
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="default">Featured</Badge>
                <Badge variant="outline">{featuredPost.category}</Badge>
              </div>
              <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{featuredPost.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{featuredPost.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {featuredPost.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <BlogDetail blog={featuredPost}>
                <Button size="lg">Read Article</Button>
              </BlogDetail>
            </div>
          </div>
        </Card>

        {/* Popular Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Popular Topics</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Funding", "MVP", "Product-Market Fit", "Scaling", "Team Building", "Customer Discovery", "Pivot", "Growth Hacking", "Indian Market", "B2B SaaS"].map((tag) => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">{post.category}</Badge>
                  <div className="text-3xl">{post.image}</div>
                </div>
                <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <BlogDetail blog={post}>
                  <Button className="w-full" variant="outline">Read More</Button>
                </BlogDetail>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mb-12">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-primary/10 to-orange-400/10">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Latest Insights</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get weekly startup insights, founder stories, and actionable tips delivered to your inbox.
            </p>
            <div className="flex max-w-md mx-auto space-x-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Join 5,000+ founders getting our weekly newsletter
            </p>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <section className="text-center py-16 mt-16">
          <h2 className="text-3xl font-bold mb-4">Share Your Startup Story</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have insights to share with the startup community? We'd love to feature your story on our blog.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
              Submit Article
            </Button>
            <Button variant="outline" size="lg">
              Content Guidelines
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;

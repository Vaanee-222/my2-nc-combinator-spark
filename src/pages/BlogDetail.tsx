import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Share2, Bookmark, Heart, MessageCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comment, setComment] = useState("");

  // Mock blog data - in real app, fetch based on ID
  const blog = {
    id: 1,
    title: "The Future of Indian Startups: Trends to Watch in 2025",
    excerpt: "From AI integration to sustainable tech, discover the key trends that will shape the Indian startup ecosystem in the coming year.",
    author: "Ravi Kumar",
    date: "Dec 20, 2024",
    readTime: "8 min read",
    category: "Trends",
    image: "",
    tags: ["AI", "Sustainability", "Future Tech"]
  };

  const fullContent = `
${blog.excerpt}

## Introduction

The Indian startup ecosystem is evolving at an unprecedented pace. As we step into 2025, the landscape is being reshaped by emerging technologies, changing consumer behaviors, and innovative business models that are uniquely Indian yet globally scalable.

## Key Trends Shaping the Future

### 1. AI-First Approach
Indian startups are increasingly adopting AI-first strategies, not just as a feature but as the core of their business models. From healthcare diagnostics to agricultural solutions, AI is becoming the backbone of innovation.

### 2. Sustainable Technology
Climate tech and sustainable solutions are gaining massive traction. Investors are actively seeking startups that can address environmental challenges while building profitable businesses.

### 3. Rural Market Penetration
The next wave of growth is coming from Bharat - rural India. Startups that can crack the rural market code are seeing exponential growth and investor interest.

## Market Opportunities

The Indian market presents unique opportunities:

- **Digital Payments**: Still growing at 50%+ annually
- **EdTech**: Vernacular content is the next frontier
- **HealthTech**: Telemedicine adoption accelerating post-pandemic
- **Fintech**: Credit and lending still largely untapped

## Challenges and Solutions

### Funding Winter Impact
While funding has been challenging, it's also creating more resilient startups focused on unit economics and sustainable growth.

### Talent Acquisition
The competition for top talent remains fierce, but remote work has opened up new talent pools across India.

## Conclusion

The future of Indian startups looks incredibly promising. Those who can combine global best practices with local insights will lead the next wave of unicorns from India.

*What do you think about these trends? Share your thoughts in the comments below.*
  `;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/blogs')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>

          {/* Article Header */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{blog.category}</Badge>
              <div className="text-4xl">{blog.image}</div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{blog.title}</h1>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{blog.readTime}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
            <div className="whitespace-pre-line text-base leading-relaxed">
              {fullContent}
            </div>
          </div>

          {/* Engagement Actions */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLiked(!liked)}
                    className={liked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                    {liked ? "Liked" : "Like"} (42)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBookmarked(!bookmarked)}
                    className={bookmarked ? "text-primary" : ""}
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? "fill-current" : ""}`} />
                    {bookmarked ? "Saved" : "Save"}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                <Badge variant="secondary">1.2k views</Badge>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium">Comments (8)</span>
                </div>
                
                <div className="space-y-2">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button size="sm">Post Comment</Button>
                  </div>
                </div>

                {/* Sample Comments */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm text-white">
                        R
                      </div>
                      <span className="font-medium">Rohit Sharma</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-muted-foreground ml-10">
                      Great insights! The AI-first approach is indeed becoming crucial for startups.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-sm text-white">
                        P
                      </div>
                      <span className="font-medium">Priya Patel</span>
                      <span className="text-sm text-muted-foreground">5 hours ago</span>
                    </div>
                    <p className="text-muted-foreground ml-10">
                      Rural market penetration is the next big opportunity. Thanks for highlighting this!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer">
                  <div className="text-2xl"></div>
                  <div className="flex-1">
                    <h4 className="font-medium">Raising Your First Round: A Complete Guide</h4>
                    <p className="text-sm text-muted-foreground">Everything you need to know about raising seed funding in India...</p>
                    <p className="text-xs text-muted-foreground mt-1">Priya Sharma • 12 min read</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer">
                  <div className="text-2xl"></div>
                  <div className="flex-1">
                    <h4 className="font-medium">Building for Bharat: Designing Products for Rural India</h4>
                    <p className="text-sm text-muted-foreground">Key insights on creating technology solutions for rural population...</p>
                    <p className="text-xs text-muted-foreground mt-1">Amit Singh • 6 min read</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-12 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">IC</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                    Xi Combinator
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Empowering crazy founders to build scalable solutions for India's biggest challenges.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Programs</h4>
                <div className="space-y-2 text-sm">
                  <a href="/mvp-lab" className="block text-muted-foreground hover:text-primary cursor-pointer">MVP Lab</a>
                  <a href="/incubation" className="block text-muted-foreground hover:text-primary cursor-pointer">Incubation</a>
                  <a href="/hackathon" className="block text-muted-foreground hover:text-primary cursor-pointer">Hackathon Track</a>
                  <a href="/inclab" className="block text-muted-foreground hover:text-primary cursor-pointer">Xi Lab</a>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Resources</h4>
                <div className="space-y-2 text-sm">
                  <a href="/resources" className="block text-muted-foreground hover:text-primary cursor-pointer">Resources</a>
                  <a href="/partnership" className="block text-muted-foreground hover:text-primary cursor-pointer">Partnership</a>
                  <a href="/deals" className="block text-muted-foreground hover:text-primary cursor-pointer">Deals & Offers</a>
                  <a href="/startup-directory" className="block text-muted-foreground hover:text-primary cursor-pointer">Startup Directory</a>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Connect</h4>
                <div className="space-y-2 text-sm">
                  <a href="/about" className="block text-muted-foreground hover:text-primary cursor-pointer">About Us</a>
                  <a href="/contact" className="block text-muted-foreground hover:text-primary cursor-pointer">Contact</a>
                  <a href="/meet-cofounder" className="block text-muted-foreground hover:text-primary cursor-pointer">Meet Co-founder</a>
                  <a href="/investor-centre" className="block text-muted-foreground hover:text-primary cursor-pointer">Investor Centre</a>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Community</h4>
                <div className="space-y-2 text-sm">
                  <a href="/blogs" className="block text-muted-foreground hover:text-primary cursor-pointer">Blogs</a>
                  <a href="/news" className="block text-muted-foreground hover:text-primary cursor-pointer">News</a>
                  <a href="/privacy-policy" className="block text-muted-foreground hover:text-primary cursor-pointer">Privacy Policy</a>
                  <a href="/terms-conditions" className="block text-muted-foreground hover:text-primary cursor-pointer">Terms & Conditions</a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                © 2024 Xi Combinator. Inspired by the vision of transforming India through innovation.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default BlogDetail;
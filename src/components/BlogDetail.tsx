import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Share2, Bookmark, Heart, MessageCircle } from "lucide-react";

interface BlogDetailProps {
  children: React.ReactNode;
  blog: {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    image: string;
    tags: string[];
  };
}

const BlogDetail = ({ children, blog }: BlogDetailProps) => {
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comment, setComment] = useState("");

  const fullContent = `
${blog.excerpt}

## Introduction

The Indian startup ecosystem is evolving at an unprecedented pace. As we step into 2026, the landscape is being reshaped by emerging technologies, changing consumer behaviors, and innovative business models that are uniquely Indian yet globally scalable.

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{blog.category}</Badge>
              <div className="text-3xl">{blog.image}</div>
            </div>
            <DialogTitle className="text-2xl leading-tight">{blog.title}</DialogTitle>
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
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Article Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {fullContent}
            </div>
          </div>

          {/* Engagement Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
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
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                        R
                      </div>
                      <span className="font-medium text-sm">Rohit Sharma</span>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">
                      Great insights! The AI-first approach is indeed becoming crucial for startups.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs text-white">
                        P
                      </div>
                      <span className="font-medium text-sm">Priya Patel</span>
                      <span className="text-xs text-muted-foreground">5 hours ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">
                      Rural market penetration is the next big opportunity. Thanks for highlighting this!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDetail;
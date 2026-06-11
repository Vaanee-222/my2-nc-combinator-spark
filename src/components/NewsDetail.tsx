import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ExternalLink, Share2, Bookmark } from "lucide-react";

interface NewsDetailProps {
  children: React.ReactNode;
  news: {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    time: string;
    source: string;
    image?: string;
  };
}

const NewsDetail = ({ children, news }: NewsDetailProps) => {
  const [open, setOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const fullContent = `
${news.excerpt}

## Breaking Development

This development marks a significant milestone for the Indian startup ecosystem, demonstrating the resilience and growth potential of the market despite global economic uncertainties.

## Market Impact

Industry experts believe this trend will have far-reaching implications:

### Immediate Effects
- Increased investor confidence in Indian startups
- More capital available for early-stage companies  
- Enhanced valuation multiples across sectors

### Long-term Implications
- Strengthening of India's position as a global startup hub
- Acceleration of digital transformation initiatives
- Creation of more employment opportunities in the tech sector

## Key Statistics

- **Total Funding**: $8.3B raised in Q4 2026
- **Number of Deals**: 342 funding rounds completed
- **Average Deal Size**: $24.3M across all stages
- **Unicorn Creation**: 5 new unicorns minted this quarter

## Sector Breakdown

The funding was distributed across various sectors:

1. **Fintech** - 28% of total funding
2. **E-commerce** - 22% of total funding  
3. **SaaS** - 18% of total funding
4. **Healthtech** - 15% of total funding
5. **Others** - 17% of total funding

## Expert Commentary

"This record funding demonstrates that India continues to be one of the most attractive markets for startup investment globally," said Ravi Gururaj, Chairman of Nasscom Product Council.

The surge in funding comes at a time when many global markets are experiencing a slowdown, making India's performance even more remarkable.

## What This Means for Startups

For startups looking to raise funding, this environment presents both opportunities and challenges:

- **Opportunities**: More capital available, increased investor interest
- **Challenges**: Higher competition, elevated due diligence standards

## Looking Ahead

Analysts predict that 2026 will see continued momentum, with early indicators showing strong deal pipeline and sustained investor interest in the Indian market.

*Stay tuned for more updates on the evolving startup landscape.*
  `;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="outline">{news.category}</Badge>
                {news.image && <div className="text-2xl">{news.image}</div>}
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{news.time}</span>
              </div>
            </div>
            <DialogTitle className="text-2xl leading-tight">{news.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Source: {news.source}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* News Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {fullContent}
            </div>
          </div>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBookmarked(!bookmarked)}
                    className={bookmarked ? "text-primary" : ""}
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? "fill-current" : ""}`} />
                    {bookmarked ? "Saved" : "Save for Later"}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Article
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Original Source
                  </Button>
                </div>
                <Badge variant="secondary">Updated 2 hours ago</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Related News */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Related News</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Indian SaaS Market Hits $8B Revenue Mark</p>
                    <p className="text-xs text-muted-foreground">Economic Times • 1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Government Announces New Startup Policy Framework</p>
                    <p className="text-xs text-muted-foreground">Business Standard • 2 days ago</p>
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

export default NewsDetail;
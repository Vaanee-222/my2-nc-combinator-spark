import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { quarterlyTop5, availableQuarters, availableCategories } from "@/data/cohorts";
import { trackEvent } from "@/lib/analytics";
import { Trophy, TrendingUp } from "lucide-react";

const QuarterlyTop5 = () => {
  const [quarter, setQuarter] = useState(availableQuarters[0]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    trackEvent("cohort_announcement_viewed", { cohort_type: "quarterly_top_5", period: quarter });
  }, [quarter]);

  const filtered = useMemo(() => quarterlyTop5.filter((s) => s.period === quarter && (category === "All" || s.category === category)), [quarter, category]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <section className="py-16 bg-hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95" />
          <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary">Quarterly Cohort</Badge>
            <h1 className="text-4xl md:text-6xl font-bold">
              Quarterly <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Top 5 Cohort</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              The 5 startups that emerge from each quarter's monthly selections — these are the founders who advance into the IC Combinator cohort.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 space-y-8">
            <Card className="p-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">Filter:</span>
              <Select value={quarter} onValueChange={setQuarter}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>{availableQuarters.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>{availableCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-auto">{filtered.length} startup{filtered.length !== 1 ? "s" : ""}</span>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filtered.map((s, idx) => (
                <Card key={s.id} className="p-6 bg-card-gradient border-border hover:shadow-orange-glow transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Rank #{idx + 1}</Badge>
                        <Badge className="bg-green-600/20 text-green-400">Advanced</Badge>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{s.name}</h3>
                        <div className="text-sm text-muted-foreground">Founded by {s.founder}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">{s.category}</Badge>
                        <Badge variant="outline" className="text-xs">{s.stage}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{s.description}</p>
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                        <div>
                          <div className="text-xs text-muted-foreground">Traction</div>
                          <div className="text-sm font-medium text-primary">{s.traction}</div>
                        </div>
                        {s.highlight && (
                          <div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3 h-3" />Highlight</div>
                            <div className="text-sm font-medium">{s.highlight}</div>
                          </div>
                        )}
                      </div>
                      <Link to={`/startup-profile/${s.id}`} onClick={() => trackEvent("cohort_startup_clicked", { cohort_type: "quarterly_top_5", startup_id: s.id, startup_name: s.name })}>
                        <Button variant="outline" className="w-full">View Profile</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted-foreground">No startups for this filter.</div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QuarterlyTop5;

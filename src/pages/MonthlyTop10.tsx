import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { monthlyTop10, availableMonths, availableCategories } from "@/data/cohorts";
import { trackEvent } from "@/lib/analytics";

const formatMonth = (m: string) => {
  const [y, mo] = m.split("-");
  return new Date(Number(y), Number(mo) - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
};

const MonthlyTop10 = () => {
  const [month, setMonth] = useState(availableMonths[0]);
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    trackEvent("cohort_announcement_viewed", { cohort_type: "monthly_top_10", period: month });
  }, [month]);

  const filtered = useMemo(() => {
    return monthlyTop10.filter((s) =>
      s.period === month &&
      (category === "All" || s.category === category) &&
      (status === "all" || s.status.toLowerCase().replace(" ", "_") === status)
    );
  }, [month, category, status]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <section className="py-16 bg-hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95" />
          <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary">Monthly Selection</Badge>
            <h1 className="text-4xl md:text-6xl font-bold">
              Monthly <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Top 10 Startups</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Every month, we shortlist 10 standout startups from hundreds of applications. The top 5 advance to the quarterly cohort.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 space-y-8">
            <Card className="p-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">Filter:</span>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {availableMonths.map((m) => <SelectItem key={m} value={m}>{formatMonth(m)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {availableCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-auto">{filtered.length} startup{filtered.length !== 1 ? "s" : ""}</span>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s, idx) => (
                <Card key={s.id} className="p-6 bg-card-gradient border-border hover:shadow-orange-glow transition-all group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">#{idx + 1}</Badge>
                      <Badge variant={s.status === "Selected" ? "default" : "secondary"} className={s.status === "Selected" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}>
                        {s.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{s.name}</h3>
                      <div className="text-sm text-muted-foreground">by {s.founder}</div>
                      <div className="flex gap-2"><Badge variant="outline" className="text-xs">{s.category}</Badge><Badge variant="outline" className="text-xs">{s.stage}</Badge></div>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                    <div className="text-xs"><span className="text-muted-foreground">Traction: </span><span className="text-primary font-medium">{s.traction}</span></div>
                    <Link to={`/startup-profile/${s.id}`} onClick={() => trackEvent("cohort_startup_clicked", { cohort_type: "monthly_top_10", startup_id: s.id, startup_name: s.name })}>
                      <Button variant="ghost" className="w-full text-sm group-hover:bg-primary/10">View Profile</Button>
                    </Link>
                  </div>
                </Card>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted-foreground">No startups match these filters.</div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MonthlyTop10;

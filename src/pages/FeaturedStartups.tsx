
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingUp, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const FeaturedStartups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const featuredStartups = [
    {
      id: 1,
      name: "AgriTech Solutions",
      founder: "Rajesh Kumar",
      category: "Agriculture",
      description: "AI-powered crop monitoring system helping farmers increase yield by 40%",
      stage: "Series A",
      funding: "$2Cr raised",
      impact: "50,000+ farmers impacted",
      location: "Bangalore",
      team: 12,
      featured: true
    },
    {
      id: 2,
      name: "HealthBridge",
      founder: "Dr. Anita Sharma",
      category: "Healthcare",
      description: "Telemedicine platform connecting rural patients with urban specialists",
      stage: "Series A",
      funding: "$15Cr raised",
      impact: "1M+ consultations",
      location: "Delhi",
      team: 25,
      featured: true
    },
    {
      id: 3,
      name: "EduTech Pro",
      founder: "Vikash Kumar",
      category: "Education",
      description: "Vernacular language learning platform for skill development",
      stage: "Seed",
      funding: "$50L raised",
      impact: "200K+ students",
      location: "Mumbai",
      team: 8,
      featured: true
    },
    {
      id: 4,
      name: "CleanWater Tech",
      founder: "Priya Patel",
      category: "CleanTech",
      description: "IoT-based water purification systems for rural communities",
      stage: "Pre-seed",
      funding: "$30L raised",
      impact: "100+ villages",
      location: "Pune",
      team: 6,
      featured: false
    },
    {
      id: 5,
      name: "FinFlow",
      founder: "Amit Gupta",
      category: "FinTech",
      description: "Digital lending platform for small businesses",
      stage: "Seed",
      funding: "$1Cr raised",
      impact: "10K+ loans disbursed",
      location: "Bangalore",
      team: 15,
      featured: false
    },
    {
      id: 6,
      name: "SpaceLogistics",
      founder: "Neha Singh",
      category: "Logistics",
      description: "Drone-based delivery system for remote areas",
      stage: "MVP",
      funding: "$25L raised",
      impact: "500+ deliveries",
      location: "Hyderabad",
      team: 10,
      featured: false
    }
  ];

  const filteredStartups = featuredStartups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || startup.category.toLowerCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "agriculture", "healthcare", "education", "cleantech", "fintech", "logistics"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Header Section */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <h1 className="text-4xl md:text-6xl font-bold">
                Featured{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Startups
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover the most promising Indian startups across various disciplines, 
                making real impact and solving mass problems through innovation.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-16 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search startups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Startups Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredStartups.map((startup) => (
                <Card key={startup.id} className="p-6 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300 group relative">
                  {startup.featured && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {startup.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {startup.stage}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {startup.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {startup.founder}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {startup.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Funding:</span>
                        <span className="font-medium text-primary">{startup.funding}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Impact:</span>
                        <span className="font-medium">{startup.impact}</span>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {startup.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {startup.team} members
                        </div>
                      </div>
                    </div>

                    <Link to={`/startup-profile/${startup.id}`}>
                      <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary/10">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {filteredStartups.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-muted-foreground mb-4">No startups found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturedStartups;

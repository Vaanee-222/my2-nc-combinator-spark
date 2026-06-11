
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, TrendingUp, MapPin, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import StartupProfileDialog from "@/components/StartupProfileDialog";
import IncApplicationDialog from "@/components/IncApplicationDialog";

const StartupDirectory = () => {
  const { toast } = useToast();
  const [selectedStartup, setSelectedStartup] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const startups = [
    {
      id: 1,
      name: "AI Healthcare Solutions",
      description: "Revolutionizing healthcare with AI-powered diagnostics and personalized treatment plans.",
      sector: "HealthTech",
      stage: "Series A",
      location: "Bangalore",
      founded: "2022",
      employees: "25-50",
      website: "aihealthcare.com",
      logo: "🏥",
      tags: ["AI", "Healthcare", "Diagnostics"]
    },
    {
      id: 2,
      name: "GreenTech Innovations",
      description: "Sustainable technology solutions for renewable energy and waste management.",
      sector: "CleanTech",
      stage: "Seed",
      location: "Mumbai",
      founded: "2021",
      employees: "11-25",
      website: "greentech.in",
      logo: "🌱",
      tags: ["CleanTech", "Renewable Energy", "Sustainability"]
    },
    {
      id: 3,
      name: "EdTech Platform",
      description: "Personalized learning platform using adaptive AI for K-12 education.",
      sector: "Education",
      stage: "Pre-Seed",
      location: "Delhi",
      founded: "2023",
      employees: "5-10",
      website: "edtechplatform.com",
      logo: "📚",
      tags: ["EdTech", "AI", "K-12"]
    },
    {
      id: 4,
      name: "FinTech Solutions",
      description: "Digital banking solutions for rural and underbanked populations.",
      sector: "FinTech",
      stage: "Series B",
      location: "Hyderabad",
      founded: "2020",
      employees: "51-100",
      website: "fintechsolutions.in",
      logo: "💰",
      tags: ["FinTech", "Digital Banking", "Rural"]
    },
    {
      id: 5,
      name: "AgriTech Connect",
      description: "Connecting farmers directly with consumers through our marketplace platform.",
      sector: "AgriTech",
      stage: "Seed",
      location: "Pune",
      founded: "2022",
      employees: "11-25",
      website: "agritechconnect.com",
      logo: "🌾",
      tags: ["AgriTech", "Marketplace", "Farmers"]
    },
    {
      id: 6,
      name: "Logistics AI",
      description: "AI-powered supply chain optimization and last-mile delivery solutions.",
      sector: "Logistics",
      stage: "Series A",
      location: "Chennai",
      founded: "2021",
      employees: "26-50",
      website: "logisticsai.com",
      logo: "🚚",
      tags: ["Logistics", "AI", "Supply Chain"]
    }
  ];

  const sectors = ["All Sectors", "HealthTech", "FinTech", "EdTech", "CleanTech", "AgriTech", "Logistics"];
  const stages = ["All Stages", "Pre-Seed", "Seed", "Series A", "Series B", "Series C"];
  const locations = ["All Locations", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai"];

  const handleViewProfile = (startup: any) => {
    setSelectedStartup(startup);
    setProfileOpen(true);
  };

  const handleConnect = (startup: any) => {
    toast({
      title: "Connection Request Sent",
      description: `Your connection request has been sent to ${startup.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Startup Directory
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover India's most promising startups backed by Xi Combinator. Connect with innovative founders building solutions for India's biggest challenges.
          </p>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">1,247</div>
              <p className="text-xs text-muted-foreground">Across 15+ sectors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Founders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">2,156</div>
              <p className="text-xs text-muted-foreground">Building the future</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">$850Cr</div>
              <p className="text-xs text-muted-foreground">Raised collectively</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cities</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">25+</div>
              <p className="text-xs text-muted-foreground">Across India</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Startups</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search startups..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector.toLowerCase().replace(" ", "-")}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage.toLowerCase().replace(" ", "-")}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase().replace(" ", "-")}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Startups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <Card key={startup.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{startup.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{startup.name}</CardTitle>
                      <CardDescription className="text-sm">{startup.website}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{startup.stage}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{startup.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {startup.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sector</p>
                    <p className="font-medium">{startup.sector}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{startup.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Founded</p>
                    <p className="font-medium">{startup.founded}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Team Size</p>
                    <p className="font-medium">{startup.employees}</p>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    className="flex-1" 
                    size="sm"
                    onClick={() => handleViewProfile(startup)}
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleConnect(startup)}
                  >
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Startups
          </Button>
        </div>

        {/* CTA Section */}
        <section className="text-center py-16 mt-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Want to be Featured?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Xi Combinator and get your startup featured in our directory. Connect with investors, mentors, and fellow entrepreneurs.
          </p>
          <IncApplicationDialog>
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
              Apply to Xi Combinator
            </Button>
          </IncApplicationDialog>
        </section>
      </main>

      {/* Startup Profile Dialog */}
      {selectedStartup && (
        <StartupProfileDialog
          open={profileOpen}
          onOpenChange={setProfileOpen}
          startup={selectedStartup}
          onConnect={() => handleConnect(selectedStartup)}
        />
      )}

      <Footer />
    </div>
  );
};

export default StartupDirectory;

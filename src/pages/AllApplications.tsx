
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Calendar, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const AllApplications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const applications = [
    {
      id: 1,
      startupName: "NeoFinance",
      founder: "Rahul Sharma",
      category: "FinTech",
      stage: "MVP",
      appliedDate: "2026-01-15",
      status: "Selected",
      score: 92
    },
    {
      id: 2,
      startupName: "GreenEnergy Solutions",
      founder: "Priya Patel",
      category: "CleanTech",
      stage: "Early Traction",
      appliedDate: "2026-01-18",
      status: "Selected",
      score: 89
    },
    {
      id: 3,
      startupName: "LogiChain",
      founder: "Arjun Singh",
      category: "Logistics",
      stage: "Beta",
      appliedDate: "2026-01-20",
      status: "Under Review",
      score: 85
    },
    {
      id: 4,
      startupName: "MedAssist",
      founder: "Dr. Sneha Reddy",
      category: "HealthTech",
      stage: "Pilot",
      appliedDate: "2026-01-22",
      status: "Selected",
      score: 94
    },
    {
      id: 5,
      startupName: "SkillBridge",
      founder: "Vikash Kumar",
      category: "EdTech",
      stage: "MVP",
      appliedDate: "2026-01-25",
      status: "Under Review",
      score: 82
    },
    {
      id: 6,
      startupName: "FoodTech Pro",
      founder: "Anjali Verma",
      category: "FoodTech",
      stage: "Idea",
      appliedDate: "2026-01-28",
      status: "Waitlisted",
      score: 78
    },
    {
      id: 7,
      startupName: "CyberShield",
      founder: "Karan Malhotra",
      category: "CyberSecurity",
      stage: "Pre-seed",
      appliedDate: "2026-02-01",
      status: "Rejected",
      score: 65
    },
    {
      id: 8,
      startupName: "SmartCity Solutions",
      founder: "Rohan Gupta",
      category: "GovTech",
      stage: "MVP",
      appliedDate: "2026-02-05",
      status: "Under Review",
      score: 88
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.founder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status.toLowerCase().replace(" ", "-") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selected": return "bg-green-600/20 text-green-400";
      case "Under Review": return "bg-yellow-600/20 text-yellow-400";
      case "Waitlisted": return "bg-blue-600/20 text-blue-400";
      case "Rejected": return "bg-red-600/20 text-red-400";
      default: return "bg-gray-600/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Header Section */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
              <h1 className="text-4xl md:text-6xl font-bold">
                All{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Applications
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Browse through all startup applications received for our accelerator programs. 
                Filter by status, category, or search by name.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <Card className="p-6 text-center bg-card-gradient border-border">
                <div className="text-3xl font-bold text-primary mb-2">
                  {applications.length}
                </div>
                <div className="text-muted-foreground">Total Applications</div>
              </Card>
              <Card className="p-6 text-center bg-card-gradient border-border">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {applications.filter(app => app.status === "Selected").length}
                </div>
                <div className="text-muted-foreground">Selected</div>
              </Card>
              <Card className="p-6 text-center bg-card-gradient border-border">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {applications.filter(app => app.status === "Under Review").length}
                </div>
                <div className="text-muted-foreground">Under Review</div>
              </Card>
              <Card className="p-6 text-center bg-card-gradient border-border">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {applications.filter(app => app.status === "Waitlisted").length}
                </div>
                <div className="text-muted-foreground">Waitlisted</div>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by startup name, founder, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Applications Table */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="bg-card-gradient border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Startup</TableHead>
                    <TableHead>Founder</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.startupName}
                      </TableCell>
                      <TableCell>{application.founder}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                          {application.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {application.stage}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {application.appliedDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{application.score}</div>
                          <div className="text-xs text-muted-foreground">/100</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/startup-profile/${application.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {filteredApplications.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-muted-foreground mb-4">No applications found</h3>
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

export default AllApplications;

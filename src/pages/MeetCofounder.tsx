import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Briefcase, Star, Search, Users, Plus, ExternalLink, Mail, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CofounderPostDialog from "@/components/CofounderPostDialog";
import CofounderDetailsDialog from "@/components/CofounderDetailsDialog";

const MeetCofounder = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [connectMessage, setConnectMessage] = useState("");
  const [selectedCofounder, setSelectedCofounder] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const featuredProfiles = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Tech Co-founder",
      expertise: "AI/ML, Backend Development",
      experience: "8 years",
      location: "Bangalore",
      company: "Ex-Google",
      bio: "Former ML engineer at Google, looking to build the next big thing in HealthTech. Passionate about using AI to solve healthcare challenges in India.",
      skills: ["Python", "TensorFlow", "AWS", "Microservices"],
      lookingFor: "Business Co-founder",
      availability: "Immediately Available",
      linkedin: "linkedin.com/in/priyasharma",
      rating: 4.9,
      avatar: "👩‍💻"
    },
    {
      id: 2,
      name: "Rahul Verma",
      role: "Business Co-founder",
      expertise: "Strategy, Operations, Fundraising",
      experience: "6 years",
      location: "Mumbai",
      company: "Ex-McKinsey",
      bio: "Former consultant at McKinsey with expertise in scaling businesses. Successfully raised $2M+ for previous ventures. Interested in FinTech and EdTech.",
      skills: ["Business Strategy", "Fundraising", "Operations", "Market Analysis"],
      lookingFor: "Technical Co-founder",
      availability: "Available part-time",
      linkedin: "linkedin.com/in/rahulverma",
      rating: 4.8,
      avatar: "👨‍💼"
    },
    {
      id: 3,
      name: "Anita Singh",
      role: "Product Co-founder",
      expertise: "Product Management, UX Design",
      experience: "5 years",
      location: "Delhi",
      company: "Ex-Flipkart",
      bio: "Product lead at Flipkart who shipped features used by 100M+ users. Expertise in product strategy, user research, and design thinking.",
      skills: ["Product Strategy", "UX Design", "User Research", "Data Analytics"],
      lookingFor: "Tech Co-founder",
      availability: "Immediately Available",
      linkedin: "linkedin.com/in/anitasingh",
      rating: 4.7,
      avatar: "👩‍🎨"
    }
  ];

  const allProfiles = [
    {
      id: 4,
      name: "Vikram Patel",
      role: "CTO",
      expertise: "Full-stack Development",
      experience: "7 years",
      location: "Pune",
      company: "Ex-Amazon",
      skills: ["React", "Node.js", "MongoDB", "Docker"],
      lookingFor: "Business Co-founder",
      avatar: "👨‍💻"
    },
    {
      id: 5,
      name: "Sneha Reddy",
      role: "CMO",
      expertise: "Digital Marketing, Growth",
      experience: "4 years",
      location: "Hyderabad",
      company: "Ex-Zomato",
      skills: ["Growth Hacking", "SEO", "Social Media", "Content Marketing"],
      lookingFor: "Tech Co-founder",
      avatar: "👩‍💼"
    },
    {
      id: 6,
      name: "Arjun Kumar",
      role: "CFO",
      expertise: "Finance, Operations",
      experience: "6 years",
      location: "Chennai",
      company: "Ex-KPMG",
      skills: ["Financial Planning", "Fundraising", "Operations", "Compliance"],
      lookingFor: "Product Co-founder",
      avatar: "👨‍💼"
    },
    {
      id: 7,
      name: "Kavya Agarwal",
      role: "CPO",
      expertise: "Product Strategy, Design",
      experience: "5 years",
      location: "Bangalore",
      company: "Ex-Swiggy",
      skills: ["Product Management", "UI/UX", "User Testing", "Agile"],
      lookingFor: "Tech Co-founder",
      avatar: "👩‍🎨"
    },
    {
      id: 8,
      name: "Rohit Gupta",
      role: "CTO",
      expertise: "DevOps, Cloud Architecture",
      experience: "9 years",
      location: "Gurgaon",
      company: "Ex-Microsoft",
      skills: ["Kubernetes", "AWS", "DevOps", "System Design"],
      lookingFor: "Business Co-founder",
      avatar: "👨‍💻"
    }
  ];

  const startupPosts = [
    {
      id: 1,
      startup: "HealthTech Solutions",
      founder: "Dr. Amit Sharma",
      stage: "Pre-Seed",
      sector: "HealthTech",
      seeking: "Technical Co-founder (CTO)",
      equity: "15-25%",
      description: "Building AI-powered diagnostic tools for rural healthcare. Looking for a tech co-founder with ML/AI expertise.",
      requirements: ["5+ years ML experience", "Healthcare domain knowledge", "Full-stack capabilities"],
      posted: "2 days ago",
      applications: 12
    },
    {
      id: 2,
      startup: "EduLearn Platform",
      founder: "Priya Mehta",
      stage: "MVP",
      sector: "EdTech",
      seeking: "Business Co-founder (COO)",
      equity: "20-30%",
      description: "Personalized learning platform for K-12 students. Need someone to handle operations and business development.",
      requirements: ["Education industry experience", "Operations expertise", "Fundraising experience"],
      posted: "1 week ago",
      applications: 8
    },
    {
      id: 3,
      startup: "GreenTech Innovations",
      founder: "Rajesh Kumar",
      stage: "Seed",
      sector: "CleanTech",
      seeking: "Product Co-founder (CPO)",
      equity: "10-20%",
      description: "Renewable energy solutions for residential complexes. Looking for product leader to scale our offerings.",
      requirements: ["Product management experience", "B2B SaaS background", "Energy sector knowledge"],
      posted: "3 days ago",
      applications: 15
    }
  ];

  const roles = ["All Roles", "CTO", "CEO", "CPO", "CMO", "CFO", "COO"];
  const locations = ["All Locations", "Bangalore", "Mumbai", "Delhi", "Pune", "Hyderabad", "Chennai"];
  const experiences = ["All Experience", "0-2 years", "3-5 years", "6-8 years", "9+ years"];

  const handleConnect = (cofounder: any) => {
    setSelectedCofounder(cofounder);
    toast({
      title: "Connection Request Sent",
      description: `Your connection request has been sent to ${cofounder.name}`,
    });
  };

  const handleViewDetails = (cofounder: any) => {
    setSelectedCofounder(cofounder);
    setDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Find Your Co-founder
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Connect with like-minded entrepreneurs and build something amazing together. Join India's largest co-founder matching platform.
          </p>
          <div className="flex justify-center space-x-4">
            <CofounderPostDialog>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                <Plus className="mr-2 h-4 w-4" />
                Post Your Requirement
              </Button>
            </CofounderPostDialog>
            <Button variant="outline" size="lg" onClick={() => {
              const browseSection = document.getElementById('browse-profiles');
              browseSection?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <Users className="mr-2 h-4 w-4" />
              Browse Profiles
            </Button>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
              <p className="text-sm text-muted-foreground">Active Co-founders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">850+</div>
              <p className="text-sm text-muted-foreground">Successful Matches</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <p className="text-sm text-muted-foreground">Startups Formed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">$50Cr+</div>
              <p className="text-sm text-muted-foreground">Total Funding Raised</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Co-founders</TabsTrigger>
            <TabsTrigger value="opportunities">Startup Opportunities</TabsTrigger>
            <TabsTrigger value="create">Post Requirement</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6" id="browse-profiles">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or skills..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role.toLowerCase().replace(" ", "-")}>
                          {role}
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {experiences.map((exp) => (
                        <SelectItem key={exp} value={exp.toLowerCase().replace(" ", "-")}>
                          {exp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Featured Profiles */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Star className="h-6 w-6 text-primary" />
                <span>Featured Co-founders</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {featuredProfiles.map((profile) => (
                  <Card key={profile.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{profile.avatar}</div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{profile.name}</CardTitle>
                          <CardDescription className="font-medium text-primary">{profile.role}</CardDescription>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{profile.rating}</span>
                            </div>
                            <Badge variant="secondary">{profile.availability}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{profile.bio}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Experience</p>
                          <p className="font-medium">{profile.experience}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Location</p>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span className="font-medium">{profile.location}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Previous</p>
                          <p className="font-medium">{profile.company}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Looking For</p>
                          <p className="font-medium">{profile.lookingFor}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-sm mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {profile.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {profile.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(profile)}
                          className="flex-1"
                        >
                          View Details
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="flex-1" size="sm">
                              Connect
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Connect with {profile.name}</DialogTitle>
                              <DialogDescription>
                                Send a personalized message to connect with this co-founder
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Message</label>
                                <Textarea 
                                  placeholder="Hi! I'm interested in connecting to discuss potential collaboration..."
                                  value={connectMessage}
                                  onChange={(e) => setConnectMessage(e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => {
                                handleConnect(profile);
                                setConnectMessage("");
                              }}>
                                Send Message
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => window.open(`https://${profile.linkedin}`, '_blank')}>
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* All Profiles */}
            <section>
              <h2 className="text-2xl font-bold mb-6">All Co-founders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allProfiles.map((profile) => (
                  <Card key={profile.id} className="hover:shadow-md transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{profile.avatar}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{profile.name}</h3>
                          <p className="text-primary font-medium">{profile.role}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span>{profile.experience}</span>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{profile.location}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{profile.company}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-2">{profile.lookingFor}</Badge>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" onClick={() => handleViewDetails(profile)}>View</Button>
                            <Button size="sm" onClick={() => handleConnect(profile)}>Connect</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">Load More Profiles</Button>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Startup Co-founder Opportunities</h2>
            <div className="space-y-6">
              {startupPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{post.startup}</CardTitle>
                        <CardDescription className="text-lg font-medium text-primary">
                          Seeking: {post.seeking}
                        </CardDescription>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">{post.stage}</Badge>
                          <Badge variant="secondary">{post.sector}</Badge>
                          <span className="text-sm text-muted-foreground">by {post.founder}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">{post.equity}</p>
                        <p className="text-sm text-muted-foreground">Equity Offered</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{post.description}</p>
                    
                    <div>
                      <p className="font-medium mb-2">Requirements:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {post.requirements.map((req, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Posted {post.posted}</span>
                        <span>{post.applications} applications</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Learn More</Button>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <CofounderPostDialog>
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6 text-center">
                  <Plus className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Post Your Co-founder Requirement</h3>
                  <p className="text-muted-foreground">
                    Tell us what kind of co-founder you're looking for and we'll help you find the perfect match.
                  </p>
                </CardContent>
              </Card>
            </CofounderPostDialog>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <section className="text-center py-16 mt-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Co-founder?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have found their perfect co-founder match through our platform.
          </p>
          <div className="flex justify-center space-x-4">
            <CofounderPostDialog>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Get Started Today
              </Button>
            </CofounderPostDialog>
            <Button variant="outline" size="lg" onClick={() => navigate('/success-stories')}>
              Success Stories
            </Button>
          </div>
        </section>
      </main>

      {/* Co-founder Details Dialog */}
      {selectedCofounder && (
        <CofounderDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          cofounder={selectedCofounder}
          onConnect={() => handleConnect(selectedCofounder)}
        />
      )}

      <Footer />
    </div>
  );
};

export default MeetCofounder;

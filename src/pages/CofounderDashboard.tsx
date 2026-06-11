
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Eye, MessageSquare, Users, TrendingUp, Star } from "lucide-react";
import CofounderPostDialog from "@/components/CofounderPostDialog";
import { useToast } from "@/hooks/use-toast";

const CofounderDashboard = () => {
  const { toast } = useToast();
  
  const cofounderProfile = {
    name: "Sarah Chen",
    role: "Technical Co-founder",
    experience: "5+ years",
    skills: ["React", "Node.js", "AI/ML", "Product Strategy"],
    profileViews: 245,
    applications: 12,
    matches: 3
  };

  const myPosts = [
    {
      id: 1,
      company: "AI Healthcare Solutions",
      role: "Looking for Business Co-founder",
      equity: "15-25%",
      applications: 8,
      views: 156,
      status: "Active",
      postedDate: "Dec 15, 2026"
    },
    {
      id: 2,
      company: "GreenTech Startup",
      role: "Seeking Marketing Co-founder",
      equity: "10-15%",
      applications: 5,
      views: 89,
      status: "Active",
      postedDate: "Dec 10, 2026"
    }
  ];

  const applications = [
    {
      id: 1,
      company: "EdTech Platform",
      role: "CTO Position",
      applicant: "Alex Johnson",
      experience: "7 years",
      skills: ["React", "Python", "AWS"],
      status: "Under Review",
      appliedDate: "Dec 18, 2026",
      matchScore: 92
    },
    {
      id: 2,
      company: "FinTech Startup",
      role: "Technical Lead",
      applicant: "Priya Sharma",
      experience: "5 years",
      skills: ["Node.js", "Blockchain", "DevOps"],
      status: "Shortlisted",
      appliedDate: "Dec 16, 2026",
      matchScore: 87
    }
  ];

  const opportunities = [
    {
      id: 1,
      company: "NextGen AI",
      role: "Co-founder & CTO",
      equity: "20-30%",
      stage: "Idea",
      industry: "AI/ML",
      matchScore: 95,
      posted: "2 days ago"
    },
    {
      id: 2,
      company: "CleanEnergy Solutions",
      role: "Technical Co-founder",
      equity: "15-20%",
      stage: "MVP",
      industry: "CleanTech",
      matchScore: 88,
      posted: "4 days ago"
    }
  ];

  const handleViewApplication = (applicationId: number) => {
    toast({
      title: "Application Details",
      description: `Opening details for application #${applicationId}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Co-founder Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your co-founder search and applications</p>
        </div>

        {/* Profile Overview */}
        <Card className="mb-8 bg-card-gradient border-border">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{cofounderProfile.name}</CardTitle>
                <CardDescription className="text-lg">{cofounderProfile.role}</CardDescription>
                <div className="flex space-x-2 mt-2">
                  {cofounderProfile.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                  {cofounderProfile.skills.length > 3 && (
                    <Badge variant="outline">+{cofounderProfile.skills.length - 3}</Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{cofounderProfile.profileViews}</div>
                    <div className="text-xs text-muted-foreground">Profile Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{cofounderProfile.applications}</div>
                    <div className="text-xs text-muted-foreground">Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{cofounderProfile.matches}</div>
                    <div className="text-xs text-muted-foreground">Matches</div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Co-founder Posts</h2>
              <CofounderPostDialog>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Post
                </Button>
              </CofounderPostDialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myPosts.map((post) => (
                <Card key={post.id} className="bg-card-gradient border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{post.company}</CardTitle>
                      <Badge variant="default">{post.status}</Badge>
                    </div>
                    <CardDescription>{post.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Equity: </span>
                          <span className="font-medium">{post.equity}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Posted: </span>
                          <span className="font-medium">{post.postedDate}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{post.applications}</div>
                          <div className="text-xs text-muted-foreground">Applications</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{post.views}</div>
                          <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" />
                          View Applications ({post.applications})
                        </Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Applications Received</h2>
              <Badge variant="secondary">{applications.length} New Applications</Badge>
            </div>
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id} className="bg-card-gradient border-border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="text-lg font-semibold">{application.applicant}</h3>
                          <p className="text-sm text-muted-foreground">
                            Applied for {application.role} at {application.company}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span><strong>Experience:</strong> {application.experience}</span>
                          <span><strong>Applied:</strong> {application.appliedDate}</span>
                        </div>
                        <div className="flex space-x-2">
                          {application.skills.map((skill) => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right space-y-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-lg font-bold">{application.matchScore}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Match Score</div>
                        </div>
                        <Badge variant={
                          application.status === "Shortlisted" ? "default" : 
                          application.status === "Under Review" ? "secondary" : "outline"
                        }>
                          {application.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleViewApplication(application.id)}>
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recommended Opportunities</h2>
              <Button variant="outline">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {opportunities.map((opportunity) => (
                <Card key={opportunity.id} className="bg-card-gradient border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{opportunity.company}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-bold">{opportunity.matchScore}%</span>
                      </div>
                    </div>
                    <CardDescription>{opportunity.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Equity: </span>
                          <span className="font-medium">{opportunity.equity}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stage: </span>
                          <Badge variant="outline" className="text-xs">{opportunity.stage}</Badge>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Industry: </span>
                        <span className="font-medium">{opportunity.industry}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Posted {opportunity.posted}</div>
                      <div className="flex space-x-2">
                        <Button className="flex-1" size="sm">Apply Now</Button>
                        <Button variant="outline" size="sm">Learn More</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Profile Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Profile Views</span>
                        <span>245 this month</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Application Rate</span>
                        <span>12 applications</span>
                      </div>
                      <Progress value={60} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle>Monthly Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">+45%</div>
                      <div className="text-sm text-muted-foreground">Profile Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">+28%</div>
                      <div className="text-sm text-muted-foreground">Applications</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle>Success Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Response Rate</span>
                      <span className="font-bold text-primary">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Match Quality</span>
                      <span className="font-bold text-primary">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Success Rate</span>
                      <span className="font-bold text-primary">78%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CofounderDashboard;

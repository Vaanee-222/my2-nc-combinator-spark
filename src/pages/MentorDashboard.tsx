
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, MessageSquare, Clock, Users, Star, Calendar, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MentorDashboard = () => {
  const { toast } = useToast();
  
  const mentorProfile = {
    name: "Dr. Rajesh Kumar",
    expertise: "Technology & Product Strategy",
    experience: "15+ years",
    company: "Former CTO at TechCorp",
    totalMentees: 42,
    activeMentees: 18,
    completedSessions: 156,
    rating: 4.9,
    specializations: ["Product Strategy", "Technology Leadership", "Fundraising", "Team Building"]
  };

  const activeMentees = [
    {
      id: 1,
      name: "Priya Sharma",
      startup: "HealthTech Solutions",
      stage: "Seed",
      sector: "HealthTech",
      nextSession: "Dec 25, 2026",
      progress: "Fundraising",
      sessionsCompleted: 8,
      status: "Active"
    },
    {
      id: 2,
      name: "Arjun Patel",
      startup: "EduNext Platform",
      stage: "Pre-Seed",
      sector: "EdTech",
      nextSession: "Dec 27, 2026",
      progress: "Product Development",
      sessionsCompleted: 5,
      status: "Active"
    },
    {
      id: 3,
      name: "Sneha Gupta",
      startup: "FinFlow AI",
      stage: "Series A",
      sector: "FinTech",
      nextSession: "Dec 30, 2026",
      progress: "Scaling Team",
      sessionsCompleted: 12,
      status: "Active"
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      mentee: "Priya Sharma",
      time: "2:00 PM - 3:00 PM",
      date: "Dec 25, 2026",
      topic: "Fundraising Strategy",
      type: "Video Call",
      status: "Confirmed"
    },
    {
      id: 2,
      mentee: "Arjun Patel",
      time: "10:00 AM - 11:00 AM",
      date: "Dec 27, 2026",
      topic: "Product Roadmap Review",
      type: "In-Person",
      status: "Confirmed"
    }
  ];

  const mentorshipRequests = [
    {
      id: 1,
      founder: "Vikash Singh",
      startup: "GreenTech Solutions",
      sector: "CleanTech",
      stage: "Idea",
      requestDate: "Dec 20, 2026",
      challenge: "Need guidance on sustainable technology implementation",
      matchScore: 92
    },
    {
      id: 2,
      founder: "Anita Roy",
      startup: "AI Diagnostics",
      sector: "HealthTech",
      stage: "MVP",
      requestDate: "Dec 22, 2026",
      challenge: "Scaling AI models and regulatory compliance",
      matchScore: 88
    }
  ];

  const handleViewMenteeDetails = (menteeId: number) => {
    toast({
      title: "Mentee Details",
      description: `Opening details for mentee #${menteeId}`,
    });
  };

  const handleAcceptRequest = (requestId: number) => {
    toast({
      title: "Request Accepted",
      description: `Mentorship request #${requestId} has been accepted.`,
    });
  };

  const handleScheduleSession = (sessionId: number) => {
    toast({
      title: "Session Scheduled",
      description: `Session #${sessionId} has been scheduled successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Mentor Dashboard
          </h1>
          <p className="text-muted-foreground">Guide the next generation of entrepreneurs</p>
        </div>

        {/* Mentor Overview */}
        <Card className="mb-8 bg-card-gradient border-border">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{mentorProfile.name}</CardTitle>
                <CardDescription className="text-lg">{mentorProfile.expertise}</CardDescription>
                <p className="text-sm text-muted-foreground mt-1">{mentorProfile.company}</p>
                <div className="flex space-x-2 mt-2">
                  {mentorProfile.specializations.slice(0, 3).map((spec) => (
                    <Badge key={spec} variant="secondary">{spec}</Badge>
                  ))}
                  {mentorProfile.specializations.length > 3 && (
                    <Badge variant="outline">+{mentorProfile.specializations.length - 3}</Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{mentorProfile.totalMentees}</div>
                    <div className="text-xs text-muted-foreground">Total Mentees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{mentorProfile.activeMentees}</div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{mentorProfile.completedSessions}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-2xl font-bold text-primary">{mentorProfile.rating}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="mentees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mentees">Active Mentees</TabsTrigger>
            <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="requests">New Requests</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="mentees" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Mentees</h2>
              <Button variant="outline">View All Mentees</Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Founder</TableHead>
                      <TableHead>Startup</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Current Focus</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Next Session</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeMentees.map((mentee) => (
                      <TableRow key={mentee.id}>
                        <TableCell className="font-medium">{mentee.name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{mentee.startup}</div>
                            <Badge variant="outline" className="text-xs">{mentee.sector}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{mentee.stage}</Badge>
                        </TableCell>
                        <TableCell>{mentee.progress}</TableCell>
                        <TableCell>{mentee.sessionsCompleted}</TableCell>
                        <TableCell>{mentee.nextSession}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewMenteeDetails(mentee.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
            </div>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <Card key={session.id} className="bg-card-gradient border-border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="text-lg font-semibold">{session.mentee}</h3>
                          <p className="text-sm text-muted-foreground">{session.topic}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{session.time}</span>
                          </div>
                          <Badge variant="outline">{session.type}</Badge>
                        </div>
                      </div>
                      <div className="text-right space-y-3">
                        <Badge variant="default">{session.status}</Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleScheduleSession(session.id)}>
                            Join Session
                          </Button>
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mentorship Requests</h2>
              <Badge variant="secondary">{mentorshipRequests.length} Pending Requests</Badge>
            </div>
            <div className="space-y-4">
              {mentorshipRequests.map((request) => (
                <Card key={request.id} className="bg-card-gradient border-border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="text-lg font-semibold">{request.founder}</h3>
                          <p className="text-sm text-muted-foreground">
                            {request.startup} • {request.sector} • {request.stage} Stage
                          </p>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Challenge: </span>
                          <span>{request.challenge}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Requested on {request.requestDate}
                        </div>
                      </div>
                      <div className="text-right space-y-3">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-bold">{request.matchScore}% Match</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleAcceptRequest(request.id)}>
                            Accept
                          </Button>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Mentorship Resources</span>
                  </CardTitle>
                  <CardDescription>Tools and guides for effective mentoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Mentorship Best Practices Guide
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Session Planning Templates
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Startup Assessment Framework
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Communication Guidelines
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle>Mentorship Impact</CardTitle>
                  <CardDescription>Your contribution to the startup ecosystem</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Successful Mentees</span>
                      <span className="font-bold text-primary">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Funding Raised by Mentees</span>
                      <span className="font-bold text-primary">$5.4M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Jobs Created</span>
                      <span className="font-bold text-primary">180+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Mentee Growth</span>
                      <span className="font-bold text-primary">65%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle>Training & Certification</CardTitle>
                  <CardDescription>Enhance your mentoring skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full">
                      Advanced Mentorship Training
                    </Button>
                    <Button variant="outline" className="w-full">
                      Industry-Specific Workshops
                    </Button>
                    <Button variant="outline" className="w-full">
                      Mentor Certification Program
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle>Community</CardTitle>
                  <CardDescription>Connect with fellow mentors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Mentor Forums
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Peer Support Groups
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Monthly Meetups
                    </Button>
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

export default MentorDashboard;

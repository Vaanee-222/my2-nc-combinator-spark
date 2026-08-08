import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, Trophy, BookOpen, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HackathonRegistrationDialog from "@/components/HackathonRegistrationDialog";
import ApplicationDialog from "@/components/ApplicationDialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  useMyProfile,
  useMyApplications,
  useUpcomingPrograms,
  useOpenCofounderPosts,
  useLearningResources,
  progressForStatus,
  formatDate,
} from "@/hooks/useMyData";

const statusVariant = (status?: string | null) => {
  const s = (status ?? "").toLowerCase();
  if (["approved", "accepted", "registered"].includes(s)) return "default" as const;
  if (["rejected", "declined"].includes(s)) return "destructive" as const;
  if (["reviewing", "under review", "shortlisted"].includes(s)) return "secondary" as const;
  return "outline" as const;
};

const Empty = ({ text }: { text: string }) => (
  <Card className="bg-card-gradient border-border">
    <CardContent className="py-10 text-center text-sm text-muted-foreground">{text}</CardContent>
  </Card>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: applications = [], isLoading: appsLoading } = useMyApplications();
  const { data: programs = [], isLoading: programsLoading } = useUpcomingPrograms();
  const { data: cofounderPosts = [], isLoading: cofounderLoading } = useOpenCofounderPosts();
  const { data: resources = [], isLoading: resourcesLoading } = useLearningResources();

  const name = profile?.full_name || user?.email?.split("@")[0] || "there";
  const filled = [profile?.full_name, profile?.email, profile?.phone, profile?.city, profile?.bio, profile?.avatar_url].filter(Boolean).length;
  const profileCompletion = Math.round((filled / 6) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Welcome back, {name}
          </h1>
          <p className="text-muted-foreground">Manage your applications and track your entrepreneurial journey</p>
        </div>

        {/* Profile Overview */}
        <Card className="mb-8 bg-card-gradient border-border">
          <CardHeader>
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <CardTitle className="text-2xl">{name}</CardTitle>
                <CardDescription className="text-lg">{profile?.email ?? user?.email}</CardDescription>
                <Badge variant="secondary" className="mt-2 capitalize">{userRole ?? "Member"}</Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Profile Completion</div>
                <div className="text-2xl font-bold text-primary">{profileCompletion}%</div>
                <Progress value={profileCompletion} className="w-32 mt-2" />
                <div className="text-xs text-muted-foreground mt-2">Joined {formatDate(profile?.created_at)}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="cofounder">Co-founder</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Applications ({applications.length})</h2>
              <ApplicationDialog program="New Application">
                <Button>Submit New Application</Button>
              </ApplicationDialog>
            </div>
            {appsLoading ? (
              <Empty text="Loading your applications…" />
            ) : applications.length === 0 ? (
              <Empty text="No submissions yet. Apply to a program to see it tracked here." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((application) => (
                  <Card key={`${application.source}-${application.id}`} className="bg-card-gradient border-border">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg">{application.program}</CardTitle>
                        <Badge variant={statusVariant(application.status)} className="capitalize">{application.status}</Badge>
                      </div>
                      <CardDescription>
                        {application.source} • Submitted {formatDate(application.submittedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{progressForStatus(application.status)}%</span>
                          </div>
                          <Progress value={progressForStatus(application.status)} />
                        </div>
                        {application.notes && (
                          <p className="text-xs text-muted-foreground">Reviewer note: {application.notes}</p>
                        )}
                        <Button variant="outline" className="w-full" size="sm" onClick={() => navigate("/application-status")}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Programs & Events</h2>
              <Button onClick={() => navigate("/hackathon")}>Browse All Events</Button>
            </div>
            {programsLoading ? (
              <Empty text="Loading events…" />
            ) : programs.length === 0 ? (
              <Empty text="No events posted yet. Check back soon." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((event: any) => (
                  <Card key={event.id} className="bg-card-gradient border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.start_date || "Dates TBA"}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="capitalize">{event.program_type}</Badge>
                          <Badge variant="secondary" className="capitalize">{event.status}</Badge>
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                        )}
                        {event.program_type === "hackathon" ? (
                          <HackathonRegistrationDialog>
                            <Button className="w-full" size="sm">Register Now</Button>
                          </HackathonRegistrationDialog>
                        ) : (
                          <ApplicationDialog program={event.name}>
                            <Button className="w-full" size="sm">Apply Now</Button>
                          </ApplicationDialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cofounder" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Co-founder Opportunities</h2>
              <Button onClick={() => navigate("/meet-cofounder")}>View All Opportunities</Button>
            </div>
            {cofounderLoading ? (
              <Empty text="Loading opportunities…" />
            ) : cofounderPosts.length === 0 ? (
              <Empty text="No approved co-founder posts yet." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cofounderPosts.map((opportunity: any) => (
                  <Card key={opportunity.id} className="bg-card-gradient border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <CardDescription>{opportunity.skills_needed || "Skills flexible"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {opportunity.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{opportunity.description}</p>
                        )}
                        <div className="flex justify-between text-sm">
                          <span>Equity:</span>
                          <span className="font-medium">{opportunity.equity_offered || "Discuss"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Commitment:</span>
                          <Badge variant="outline" className="text-xs">{opportunity.commitment || "Flexible"}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {opportunity.location || "Remote"} • Posted {formatDate(opportunity.created_at)}
                        </div>
                        <Button className="w-full" size="sm" onClick={() => navigate("/meet-cofounder")}>View Post</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Learning Resources</h2>
              <Button onClick={() => navigate("/resources")}>Browse All Resources</Button>
            </div>
            {resourcesLoading ? (
              <Empty text="Loading resources…" />
            ) : resources.length === 0 ? (
              <Empty text="No published resources yet." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource: any) => (
                  <Card key={resource.id} className="bg-card-gradient border-border">
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{resource.read_time_minutes ?? 5} min read</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Badge variant="outline">{resource.category || "Guide"}</Badge>
                        {resource.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{resource.excerpt}</p>
                        )}
                        <Button className="w-full" size="sm" onClick={() => navigate(`/blog/${resource.slug}`)}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Read
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Messages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with fellow entrepreneurs and share insights.
                  </p>
                  <Button className="w-full" size="sm" onClick={() => navigate("/messages")}>Open Messages</Button>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Networking Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Attend virtual and in-person networking sessions.
                  </p>
                  <Button className="w-full" size="sm" onClick={() => navigate("/past-events")}>View Events</Button>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span>Success Stories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Read inspiring stories from our alumni.
                  </p>
                  <Button className="w-full" size="sm" onClick={() => navigate("/success-stories")}>
                    Read Stories
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserDashboard;

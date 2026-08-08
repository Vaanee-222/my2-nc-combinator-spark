import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StartupOverview from "@/components/dashboard/StartupOverview";
import ApplicationStatus from "@/components/dashboard/ApplicationStatus";
import InvestmentTable from "@/components/dashboard/InvestmentTable";
import CofounderPostDialog from "@/components/CofounderPostDialog";
import {
  useMyApplications,
  useMyCofounderPosts,
  useActiveDeals,
  useMyCloudCredits,
  useMyInvestorInquiries,
  progressForStatus,
  formatDate,
} from "@/hooks/useMyData";

const StartupDashboard = () => {
  const navigate = useNavigate();
  const { data: applications = [] } = useMyApplications();
  const { data: myPosts = [], isLoading: postsLoading } = useMyCofounderPosts();
  const { data: deals = [], isLoading: dealsLoading } = useActiveDeals();
  const { data: credits = [] } = useMyCloudCredits();
  const { data: inquiries = [] } = useMyInvestorInquiries();

  const primary = applications[0];
  const applicationStatus = {
    stage: primary?.status ? primary.status : "No application yet",
    progress: primary ? progressForStatus(primary.status) : 0,
    submittedDate: formatDate(primary?.submittedAt),
    nextReview: primary ? "Within 7 business days" : "—",
    program: primary?.program,
    notes: primary?.notes ?? null,
  };

  const stats = {
    applications: applications.length,
    deals: deals.length,
    credits: credits.length,
    inquiries: inquiries.length,
    cofounderPosts: myPosts.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Startup Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your startup journey with Xi Combinator</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="cofounder">Co-founder</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <StartupOverview applicationStatus={applicationStatus} stats={stats} />
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <ApplicationStatus applicationStatus={applicationStatus} applications={applications} />
          </TabsContent>

          <TabsContent value="investment" className="space-y-6">
            <InvestmentTable />
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Available Deals</h2>
              <Button variant="outline" onClick={() => navigate('/deals')}>Browse All Deals</Button>
            </div>
            {dealsLoading ? (
              <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading deals…</CardContent></Card>
            ) : deals.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No approved deals available yet.</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {deals.map((deal: any) => (
                  <Card key={deal.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg">{deal.title}</CardTitle>
                        <Badge variant="default">{deal.discount || "Offer"}</Badge>
                      </div>
                      <CardDescription className="text-2xl font-bold text-primary">
                        {deal.offer_value || "—"}
                      </CardDescription>
                      <CardDescription>{deal.company_name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {deal.valid_until ? `Valid until: ${deal.valid_until}` : "No expiry listed"}
                      </p>
                      <Button
                        className="w-full"
                        onClick={() => (deal.redemption_url ? window.open(deal.redemption_url, "_blank") : navigate("/deals"))}
                      >
                        Claim Deal
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {credits.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">My Cloud Credit Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {credits.map((c: any) => (
                    <Card key={c.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-lg">{c.provider}</CardTitle>
                          <Badge variant="secondary" className="capitalize">{c.status}</Badge>
                        </div>
                        <CardDescription>{c.credit_amount || "Amount TBD"}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">Requested {formatDate(c.created_at)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cofounder" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Co-founder Requirements</h2>
              <CofounderPostDialog>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Requirement
                </Button>
              </CofounderPostDialog>
            </div>
            {postsLoading ? (
              <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading your posts…</CardContent></Card>
            ) : myPosts.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">You haven't posted a co-founder requirement yet.</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myPosts.map((post: any) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle>{post.title}</CardTitle>
                        <Badge variant="secondary" className="capitalize">{post.review_status}</Badge>
                      </div>
                      <CardDescription>Posted {formatDate(post.created_at)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4 line-clamp-3">{post.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {(post.skills_needed || "")
                          .split(",")
                          .map((s: string) => s.trim())
                          .filter(Boolean)
                          .map((s: string) => (
                            <Badge key={s} variant="outline">{s}</Badge>
                          ))}
                      </div>
                      {post.review_notes && (
                        <p className="mt-4 text-xs text-muted-foreground">Reviewer note: {post.review_notes}</p>
                      )}
                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" onClick={() => navigate("/meet-cofounder")}>View Public Listing</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StartupDashboard;

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Plus,
  BrainCircuit,
  LayoutDashboard,
  FileText,
  TrendingUp,
  Gift,
  Users,
  Inbox,
  Bell,
  Settings,
  Handshake,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import StartupOverview from "@/components/dashboard/StartupOverview";
import ApplicationStatus from "@/components/dashboard/ApplicationStatus";
import InvestmentTable from "@/components/dashboard/InvestmentTable";
import CofounderPostDialog from "@/components/CofounderPostDialog";
import AdvisorPanel from "@/components/AdvisorPanel";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import AccountSettingsPanel from "@/components/dashboard/AccountSettingsPanel";
import DashboardNav, { type DashboardNavGroup } from "@/components/dashboard/DashboardNav";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { EmptyState, SkeletonCards } from "@/components/dashboard/EmptyState";
import { useDashboardTab } from "@/hooks/useDashboardTab";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  useMyApplications,
  useMyCofounderPosts,
  useActiveDeals,
  useMyCloudCredits,
  useMyInvestorInquiries,
  useApplicationsToMyPosts,
  useMyDealClaims,
  progressForStatus,
  formatDate,
} from "@/hooks/useMyData";

const APPLICANT_STAGES = ["new", "shortlisted", "accepted", "rejected"];

const StartupDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: applications = [] } = useMyApplications();
  const { data: myPosts = [], isLoading: postsLoading } = useMyCofounderPosts();
  const { data: deals = [], isLoading: dealsLoading } = useActiveDeals();
  const { data: credits = [] } = useMyCloudCredits();
  const { data: inquiries = [] } = useMyInvestorInquiries();
  const { data: applicants = [], isLoading: applicantsLoading } = useApplicationsToMyPosts();
  const { data: dealClaims = [] } = useMyDealClaims();
  const [claiming, setClaiming] = useState<string | null>(null);
  const [tab, setTab] = useDashboardTab("startup-dashboard-tab", "overview");
  const { unreadCount } = useNotifications();


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

  const claimedIds = new Set(dealClaims.map((c: any) => c.deal_id));

  const claimDeal = async (deal: any) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to claim this deal." });
      navigate("/login");
      return;
    }
    setClaiming(deal.id);
    const { error } = await supabase.from("deal_claims").insert({
      user_id: user.id,
      deal_id: deal.id,
      deal_title: deal.title,
      company_name: deal.company_name,
      offer_value: deal.offer_value,
      redemption_url: deal.redemption_url,
    });
    setClaiming(null);
    if (error) {
      toast({ title: "Could not claim deal", description: error.message, variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["my-deal-claims"] });
    toast({ title: "Deal claimed", description: `${deal.title} has been added to your deal history.` });
    if (deal.redemption_url) window.open(deal.redemption_url, "_blank", "noopener");
  };

  const updateApplicantStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("cofounder_applications").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["applications-to-my-posts"] });
    toast({ title: "Applicant updated", description: `Moved to ${status}.` });
  };

  const newApplicants = applicants.filter((a: any) => (a.status ?? "new") === "new").length;

  const navGroups: DashboardNavGroup[] = [
    {
      label: "Overview",
      items: [{ value: "overview", label: "Today", icon: LayoutDashboard }],
    },
    {
      label: "Work",
      items: [
        { value: "application", label: "Application", icon: FileText },
        { value: "investment", label: "Investment", icon: TrendingUp },
        { value: "deals", label: "Deals & Credits", icon: Gift },
        { value: "cofounder", label: "Co-founder posts", icon: Users },
        { value: "applicants", label: "Applicants", icon: Inbox, badge: newApplicants },
      ],
    },
    {
      label: "Growth",
      items: [{ value: "advisor", label: "AI Advisor", icon: BrainCircuit }],
    },
    {
      label: "Account",
      items: [
        { value: "notifications", label: "Alerts", icon: Bell, badge: unreadCount },
        { value: "account", label: "Account", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <DashboardHeader
          title="Startup Dashboard"
          subtitle="Track applications, funding conversations and perks in one place"
          onOpenNotifications={() => setTab("notifications")}
          onOpenSettings={() => setTab("account")}
        />

        <Tabs value={tab} onValueChange={setTab} className="flex flex-col lg:flex-row lg:gap-8">
          <DashboardNav groups={navGroups} value={tab} onChange={setTab} />

          <div className="min-w-0 flex-1 space-y-6">

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview
              onOpenAccount={() => setTab("account")}
              onOpenAlerts={() => setTab("notifications")}
              kpis={[
                { label: "Applications", value: stats.applications, icon: FileText },
                { label: "Investor inquiries", value: stats.inquiries, icon: TrendingUp },
                { label: "Co-founder applicants", value: applicants.length, icon: Users },
              ]}
              steps={[
                ...(stats.applications === 0
                  ? [{ id: "apply", label: "Submit your first program application", description: "Apply to incubation, MVP Lab or Xi Lab.", actionLabel: "Apply", onAction: () => navigate("/incubation") }]
                  : []),
                ...(newApplicants > 0
                  ? [{ id: "applicants", label: `${newApplicants} new co-founder applicant(s)`, description: "Review and move them through your pipeline.", actionLabel: "Review", onAction: () => setTab("applicants") }]
                  : []),
                ...(stats.credits === 0
                  ? [{ id: "credits", label: "Claim your cloud credits", description: "Free infra credits from partner providers.", actionLabel: "Browse", onAction: () => navigate("/cloud-credits") }]
                  : []),
              ]}
            />
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
              <SkeletonCards />
            ) : deals.length === 0 ? (
              <EmptyState icon={Gift} title="No deals available yet" description="Partner offers appear here once they are approved." actionLabel="Browse deals" onAction={() => navigate("/deals")} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {deals.map((deal: any) => {
                  const claimed = claimedIds.has(deal.id);
                  return (
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
                          variant={claimed ? "secondary" : "default"}
                          disabled={claiming === deal.id}
                          onClick={() =>
                            claimed
                              ? deal.redemption_url
                                ? window.open(deal.redemption_url, "_blank", "noopener")
                                : navigate("/deals")
                              : claimDeal(deal)
                          }
                        >
                          {claiming === deal.id ? "Claiming…" : claimed ? "Claimed — Open Offer" : "Claim Deal"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Deal Claim History ({dealClaims.length})</CardTitle>
                <CardDescription>Every deal you have claimed through Xi Combinator</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {dealClaims.length === 0 ? (
                  <p className="p-6 text-sm text-muted-foreground">You haven't claimed any deals yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Deal</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Claimed</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dealClaims.map((c: any) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.deal_title}</TableCell>
                          <TableCell>{c.company_name || "—"}</TableCell>
                          <TableCell>{c.offer_value || "—"}</TableCell>
                          <TableCell><Badge variant="outline" className="capitalize">{c.status}</Badge></TableCell>
                          <TableCell>{formatDate(c.created_at)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!c.redemption_url}
                              onClick={() => window.open(c.redemption_url, "_blank", "noopener")}
                            >
                              Open
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

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
              <SkeletonCards count={2} />
            ) : myPosts.length === 0 ? (
              <EmptyState icon={Users} title="No co-founder requirement posted" description="Describe the co-founder you need and receive applications directly here." />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myPosts.map((post: any) => {
                  const postApplicants = applicants.filter((a: any) => a.request_id === post.id);
                  return (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle>{post.title}</CardTitle>
                          <Badge variant="secondary" className="capitalize">{post.review_status}</Badge>
                        </div>
                        <CardDescription>Posted {formatDate(post.created_at)} • {postApplicants.length} application(s)</CardDescription>
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
                          <Button
                            size="sm"
                            disabled={post.review_status !== "approved"}
                            onClick={() => navigate(`/meet-cofounder?post=${post.id}`)}
                          >
                            {post.review_status === "approved" ? "View Public Listing" : "Awaiting approval"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applicants" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Co-founder Applications Received</h2>
              <Badge variant="secondary">{applicants.length} total</Badge>
            </div>
            {applicantsLoading ? (
              <SkeletonCards count={2} />
            ) : applicants.length === 0 ? (
              <EmptyState icon={Inbox} title="No applicants yet" description="Applications to your co-founder posts will show up here." actionLabel="Post a requirement" onAction={() => setTab("cofounder")} />
            ) : (
              <div className="space-y-4">
                {applicants.map((a: any) => (
                  <Card key={a.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-3 flex-wrap">
                        <div>
                          <CardTitle className="text-lg">{a.applicant_name}</CardTitle>
                          <CardDescription>
                            Applied to “{a.post_title}” • {formatDate(a.created_at)}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="capitalize">{a.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {a.headline && <p className="text-sm font-medium">{a.headline}</p>}
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.message}</p>
                      {a.skills && (
                        <div className="flex flex-wrap gap-1">
                          {String(a.skills).split(",").map((s: string) => s.trim()).filter(Boolean).map((s: string) => (
                            <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>{a.email}</span>
                        {a.linkedin_url && (
                          <a href={a.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            Profile link
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {APPLICANT_STAGES.filter((s) => s !== a.status).map((s) => (
                          <Button key={s} size="sm" variant="outline" className="capitalize" onClick={() => updateApplicantStatus(a.id, s)}>
                            Mark {s}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="advisor" className="space-y-6">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Startup Advisor</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Practise your pitch, get legal guidance, plan GTM, or talk things through — right from your dashboard.
            </p>
            <AdvisorPanel compact />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationsPanel />
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <AccountSettingsPanel />
          </TabsContent>
          </div>
        </Tabs>

      </main>
    </div>
  );
};

export default StartupDashboard;

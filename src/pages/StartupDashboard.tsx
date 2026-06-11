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

const StartupDashboard = () => {
  const navigate = useNavigate();
  
  const applicationStatus = {
    stage: "Under Review",
    progress: 65,
    submittedDate: "Dec 15, 2024",
    nextReview: "Jan 5, 2025"
  };

  const deals = [
    { id: 1, title: "AWS Credits", value: "$50,000", status: "Active", expires: "Jan 15, 2025" },
    { id: 2, title: "Google Cloud Credits", value: "$30,000", status: "Active", expires: "Feb 10, 2025" },
    { id: 3, title: "Notion Pro", value: "$12,000", status: "Claimed", expires: "Dec 31, 2024" }
  ];

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
            <StartupOverview applicationStatus={applicationStatus} />
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <ApplicationStatus applicationStatus={applicationStatus} />
          </TabsContent>

          <TabsContent value="investment" className="space-y-6">
            <InvestmentTable />
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Available Deals</h2>
              <Button variant="outline" onClick={() => navigate('/deals')}>Browse All Deals</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <Card key={deal.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{deal.title}</CardTitle>
                      <Badge variant={deal.status === "Active" ? "default" : deal.status === "Claimed" ? "secondary" : "outline"}>
                        {deal.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-2xl font-bold text-primary">{deal.value}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Expires: {deal.expires}</p>
                    <Button className="w-full" disabled={deal.status === "Claimed"}>
                      {deal.status === "Claimed" ? "Already Claimed" : "Claim Deal"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Looking for CTO</CardTitle>
                  <CardDescription>Posted 3 days ago • 8 applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Seeking a technical co-founder with experience in AI/ML and full-stack development...</p>
                  <div className="flex space-x-2">
                    <Badge>AI/ML</Badge>
                    <Badge>Full-stack</Badge>
                    <Badge>5+ years exp</Badge>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm">View Applications (8)</Button>
                    <Button variant="outline" size="sm">Edit Post</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Looking for CMO</CardTitle>
                  <CardDescription>Posted 1 week ago • 4 applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Need a marketing co-founder with expertise in growth hacking and digital marketing...</p>
                  <div className="flex space-x-2">
                    <Badge>Growth Hacking</Badge>
                    <Badge>Digital Marketing</Badge>
                    <Badge>B2B SaaS</Badge>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm">View Applications (4)</Button>
                    <Button variant="outline" size="sm">Edit Post</Button>
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

export default StartupDashboard;
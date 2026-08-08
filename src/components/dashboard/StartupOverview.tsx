import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, TrendingUp, DollarSign, Users, Plus } from "lucide-react";
import CofounderPostDialog from "@/components/CofounderPostDialog";
import InvestmentApplicationDialog from "@/components/InvestmentApplicationDialog";
import { useNavigate } from "react-router-dom";

interface StartupOverviewProps {
  applicationStatus: {
    stage: string;
    progress: number;
    submittedDate: string;
    nextReview: string;
    program?: string;
    notes?: string | null;
  };
  stats?: {
    applications: number;
    deals: number;
    credits: number;
    inquiries: number;
    cofounderPosts: number;
  };
}

const StartupOverview = ({ applicationStatus, stats }: StartupOverviewProps) => {
  const navigate = useNavigate();
  const s = stats ?? { applications: 0, deals: 0, credits: 0, inquiries: 0, cofounderPosts: 0 };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Application Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{applicationStatus.stage}</div>
            <Progress value={applicationStatus.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{s.deals}</div>
            <p className="text-xs text-muted-foreground">{s.credits} cloud credit requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investor Inquiries</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{s.inquiries}</div>
            <p className="text-xs text-muted-foreground">{s.applications} total submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Co-founder Posts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{s.cofounderPosts}</div>
            <p className="text-xs text-muted-foreground">Posted by you</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Latest Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {applicationStatus.program ? (
              <>
                <div>
                  <p className="text-sm font-medium">{applicationStatus.program}</p>
                  <p className="text-xs text-muted-foreground">Submitted {applicationStatus.submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm">Stage: <span className="capitalize font-medium">{applicationStatus.stage}</span></p>
                  <Progress value={applicationStatus.progress} className="mt-2" />
                </div>
                {applicationStatus.notes && (
                  <p className="text-xs text-muted-foreground">Reviewer note: {applicationStatus.notes}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No submissions yet — apply to a program to track progress here.</p>
            )}
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CofounderPostDialog>
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Post Co-founder Requirement
              </Button>
            </CofounderPostDialog>
            <InvestmentApplicationDialog>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Apply for Investment
              </Button>
            </InvestmentApplicationDialog>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/deals')}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Browse Active Deals
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Update Application
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StartupOverview;
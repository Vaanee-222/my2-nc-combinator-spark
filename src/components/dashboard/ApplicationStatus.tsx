import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import { MyApplication, progressForStatus, formatDate } from "@/hooks/useMyData";

interface ApplicationStatusProps {
  applicationStatus: {
    stage: string;
    progress: number;
    submittedDate: string;
    nextReview: string;
    program?: string;
    notes?: string | null;
  };
  applications?: MyApplication[];
}

const ApplicationStatus = ({ applicationStatus, applications = [] }: ApplicationStatusProps) => {
  const stageIndex = applicationStatus.progress >= 100 ? 3 : applicationStatus.progress >= 60 ? 2 : 1;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Track your Xi Combinator application progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold capitalize">
                Current Stage: {applicationStatus.stage}
              </h3>
              <p className="text-sm text-muted-foreground">
                {applicationStatus.program ? `${applicationStatus.program} • ` : ""}
                Submitted on {applicationStatus.submittedDate}
              </p>
            </div>
            <Badge variant="secondary">{applicationStatus.progress}% Complete</Badge>
          </div>
          <Progress value={applicationStatus.progress} className="h-2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {["Application Submitted", "Under Review", "Final Decision"].map((label, i) => (
              <div key={label} className={`p-4 border rounded-lg ${stageIndex < i + 1 ? "opacity-50" : ""}`}>
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${stageIndex >= i + 1 ? "bg-primary" : "bg-muted"}`}>
                  <span className="text-sm text-primary-foreground">{i + 1}</span>
                </div>
                <p className="font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">
                  {i === 0 ? applicationStatus.submittedDate : stageIndex >= i + 1 ? "Reached" : "Pending"}
                </p>
              </div>
            ))}
          </div>
          {applicationStatus.notes && (
            <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-primary" />
              <p className="text-sm">Reviewer note: {applicationStatus.notes}</p>
            </div>
          )}
          <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-primary" />
            <p className="text-sm">Next review: {applicationStatus.nextReview}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions ({applications.length})</CardTitle>
          <CardDescription>Every application, registration and request you've made</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          ) : (
            applications.map((a) => (
              <div key={`${a.source}-${a.id}`} className="flex items-center justify-between gap-4 border rounded-lg p-3 flex-wrap">
                <div>
                  <p className="text-sm font-medium">{a.program}</p>
                  <p className="text-xs text-muted-foreground">{a.source} • {formatDate(a.submittedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={progressForStatus(a.status)} className="w-24 h-2" />
                  <Badge variant="outline" className="capitalize">{a.status}</Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationStatus;

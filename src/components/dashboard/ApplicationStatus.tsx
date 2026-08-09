import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

const STAGE_TIMELINE = ["Submitted", "Under Review", "Shortlisted", "Decision"];

const timelineFor = (status: string) => {
  const s = status.toLowerCase();
  if (["approved", "accepted", "registered", "rejected", "declined"].includes(s)) return 4;
  if (["shortlisted"].includes(s)) return 3;
  if (["reviewing", "under review"].includes(s)) return 2;
  return 1;
};

const ApplicationStatus = ({ applicationStatus, applications = [] }: ApplicationStatusProps) => {
  const stageIndex = applicationStatus.progress >= 100 ? 3 : applicationStatus.progress >= 60 ? 2 : 1;
  const [selected, setSelected] = useState<MyApplication | null>(null);


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
                  <Button variant="outline" size="sm" onClick={() => setSelected(a)}>View</Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.program}</DialogTitle>
            <DialogDescription>
              {selected?.source} • Submitted {formatDate(selected?.submittedAt)}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">{selected.status}</Badge>
                <span className="text-sm text-muted-foreground">{progressForStatus(selected.status)}% complete</span>
              </div>
              <Progress value={progressForStatus(selected.status)} className="h-2" />
              <ol className="space-y-3">
                {STAGE_TIMELINE.map((label, i) => {
                  const reached = timelineFor(selected.status) >= i + 1;
                  return (
                    <li key={label} className="flex items-start gap-3">
                      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${reached ? "bg-primary" : "bg-muted"}`} />
                      <div>
                        <p className={`text-sm font-medium ${reached ? "" : "text-muted-foreground"}`}>{label}</p>
                        <p className="text-xs text-muted-foreground">
                          {i === 0 ? formatDate(selected.submittedAt) : reached ? "Reached" : "Pending"}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              {selected.notes && (
                <div className="rounded-lg bg-muted/50 p-3 text-sm">Reviewer note: {selected.notes}</div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default ApplicationStatus;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

interface ApplicationStatusProps {
  applicationStatus: {
    stage: string;
    progress: number;
    submittedDate: string;
    nextReview: string;
  };
}

const ApplicationStatus = ({ applicationStatus }: ApplicationStatusProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Track your Xi Combinator application progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Current Stage: {applicationStatus.stage}</h3>
              <p className="text-sm text-muted-foreground">Submitted on {applicationStatus.submittedDate}</p>
            </div>
            <Badge variant="secondary">{applicationStatus.progress}% Complete</Badge>
          </div>
          <Progress value={applicationStatus.progress} className="h-2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-sm"></span>
              </div>
              <p className="font-medium">Application Submitted</p>
              <p className="text-xs text-muted-foreground">Dec 15, 2024</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-sm">2</span>
              </div>
              <p className="font-medium">Under Review</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="p-4 border rounded-lg opacity-50">
              <div className="w-8 h-8 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">3</span>
              </div>
              <p className="font-medium">Final Decision</p>
              <p className="text-xs text-muted-foreground">Expected: Jan 5, 2025</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <p className="text-sm">Next review scheduled for {applicationStatus.nextReview}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationStatus;
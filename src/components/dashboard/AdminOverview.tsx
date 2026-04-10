import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, FileText, Code, Rocket } from "lucide-react";
import { format } from "date-fns";

interface AdminOverviewProps {
  stats: {
    totalApplications: number;
    totalHackathonRegs: number;
    totalIncubationApps: number;
    totalCofounderReqs: number;
    totalUsers: number;
  };
  applications: any[];
  hackathonRegs: any[];
  incubationApps: any[];
  loading: boolean;
}

const AdminOverview = ({ stats, applications, hackathonRegs, incubationApps, loading }: AdminOverviewProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Program applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hackathon Regs</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalHackathonRegs}</div>
            <p className="text-xs text-muted-foreground">Total registrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incubation</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalIncubationApps}</div>
            <p className="text-xs text-muted-foreground">Incubation apps</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Co-founder</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalCofounderReqs}</div>
            <p className="text-xs text-muted-foreground">Active requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest program applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{app.startup_name || app.applicant_name}</h4>
                    <p className="text-sm text-muted-foreground">{app.applicant_name} • {app.program}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={app.status === "approved" ? "default" : app.status === "under_review" ? "secondary" : "outline"}>
                      {app.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(app.created_at), "MMM d, yyyy")}</p>
                  </div>
                </div>
              ))}
              {applications.length === 0 && <p className="text-muted-foreground text-center py-4">No applications yet</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Hackathon Registrations</CardTitle>
            <CardDescription>Latest hackathon sign-ups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hackathonRegs.slice(0, 5).map((reg) => (
                <div key={reg.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{reg.full_name}</h4>
                    <p className="text-sm text-muted-foreground">{reg.city || "—"} • {reg.specialization || "General"}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={reg.status === "approved" ? "default" : "outline"}>
                      {reg.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(reg.created_at), "MMM d, yyyy")}</p>
                  </div>
                </div>
              ))}
              {hackathonRegs.length === 0 && <p className="text-muted-foreground text-center py-4">No registrations yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;

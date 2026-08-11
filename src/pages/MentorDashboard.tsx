import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Clock, Star, Calendar, CheckCircle2, Users } from "lucide-react";
import AdvisorPanel from "@/components/AdvisorPanel";
import { useAuth } from "@/contexts/AuthContext";
import {
  useMentorProfile,
  useMentorships,
  useMentorSessions,
  useMentorshipRequests,
  useMentorMutations,
  type Mentorship,
  type MentorSession,
} from "@/hooks/useMentorData";

const emptyMentee = {
  mentee_name: "",
  mentee_email: "",
  startup_name: "",
  sector: "",
  stage: "",
  current_focus: "",
  next_session_on: "",
  status: "active",
  notes: "",
};

const emptySession = {
  mentee_name: "",
  topic: "",
  session_type: "Video Call",
  scheduled_at: "",
  duration_minutes: 60,
  meeting_url: "",
  status: "confirmed",
  notes: "",
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

const formatTime = (value?: string | null) =>
  value ? new Date(value).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "";

const MentorDashboard = () => {
  const { user } = useAuth();
  const { data: profile } = useMentorProfile();
  const { data: mentees = [], isLoading: menteesLoading } = useMentorships();
  const { data: sessions = [], isLoading: sessionsLoading } = useMentorSessions();
  const { data: requests = [], isLoading: requestsLoading } = useMentorshipRequests();
  const {
    saveProfile,
    saveMentee,
    deleteMentee,
    saveSession,
    deleteSession,
    completeSession,
    respondToRequest,
  } = useMentorMutations();

  const [menteeDialog, setMenteeDialog] = useState<{ open: boolean; id?: string; values: typeof emptyMentee }>({
    open: false,
    values: emptyMentee,
  });
  const [sessionDialog, setSessionDialog] = useState<{ open: boolean; id?: string; values: typeof emptySession }>({
    open: false,
    values: emptySession,
  });
  const [confirmDelete, setConfirmDelete] = useState<{ type: "mentee" | "session"; id: string } | null>(null);
  const [profileForm, setProfileForm] = useState<Record<string, string | boolean> | null>(null);

  const pendingRequests = useMemo(() => requests.filter((r) => r.status === "pending"), [requests]);
  const activeMentees = useMemo(() => mentees.filter((m) => m.status === "active"), [mentees]);
  const upcomingSessions = useMemo(
    () => sessions.filter((s) => s.status !== "completed" && s.status !== "cancelled"),
    [sessions],
  );
  const completedSessions = useMemo(() => sessions.filter((s) => s.status === "completed").length, [sessions]);

  const specializations = (profile?.specializations ?? []) as string[];

  const profileValues = profileForm ?? {
    full_name: profile?.full_name ?? "",
    expertise: profile?.expertise ?? "",
    experience: profile?.experience ?? "",
    company: profile?.company ?? "",
    bio: profile?.bio ?? "",
    linkedin_url: profile?.linkedin_url ?? "",
    specializations: specializations.join(", "),
    notify_new_requests: profile?.notify_new_requests ?? true,
    notify_session_reminders: profile?.notify_session_reminders ?? true,
  };

  const setProfileValue = (key: string, value: string | boolean) =>
    setProfileForm({ ...profileValues, [key]: value });

  const submitProfile = () => {
    saveProfile.mutate({
      full_name: profileValues.full_name as string,
      expertise: profileValues.expertise as string,
      experience: profileValues.experience as string,
      company: profileValues.company as string,
      bio: profileValues.bio as string,
      linkedin_url: (profileValues.linkedin_url as string) || null,
      specializations: String(profileValues.specializations || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      notify_new_requests: Boolean(profileValues.notify_new_requests),
      notify_session_reminders: Boolean(profileValues.notify_session_reminders),
    });
  };

  const openMentee = (mentee?: Mentorship) =>
    setMenteeDialog({
      open: true,
      id: mentee?.id,
      values: mentee
        ? {
            mentee_name: mentee.mentee_name ?? "",
            mentee_email: mentee.mentee_email ?? "",
            startup_name: mentee.startup_name ?? "",
            sector: mentee.sector ?? "",
            stage: mentee.stage ?? "",
            current_focus: mentee.current_focus ?? "",
            next_session_on: mentee.next_session_on ?? "",
            status: mentee.status ?? "active",
            notes: mentee.notes ?? "",
          }
        : emptyMentee,
    });

  const openSession = (session?: MentorSession) =>
    setSessionDialog({
      open: true,
      id: session?.id,
      values: session
        ? {
            mentee_name: session.mentee_name ?? "",
            topic: session.topic ?? "",
            session_type: session.session_type ?? "Video Call",
            scheduled_at: session.scheduled_at ? session.scheduled_at.slice(0, 16) : "",
            duration_minutes: session.duration_minutes ?? 60,
            meeting_url: session.meeting_url ?? "",
            status: session.status ?? "confirmed",
            notes: session.notes ?? "",
          }
        : emptySession,
    });

  const submitMentee = () => {
    const v = menteeDialog.values;
    if (!v.mentee_name.trim()) return;
    saveMentee.mutate(
      {
        id: menteeDialog.id,
        values: {
          mentee_name: v.mentee_name.trim(),
          mentee_email: v.mentee_email || null,
          startup_name: v.startup_name || null,
          sector: v.sector || null,
          stage: v.stage || null,
          current_focus: v.current_focus || null,
          next_session_on: v.next_session_on || null,
          status: v.status,
          notes: v.notes || null,
        },
      },
      { onSuccess: () => setMenteeDialog({ open: false, values: emptyMentee }) },
    );
  };

  const submitSession = () => {
    const v = sessionDialog.values;
    if (!v.mentee_name.trim() || !v.topic.trim() || !v.scheduled_at) return;
    saveSession.mutate(
      {
        id: sessionDialog.id,
        values: {
          mentee_name: v.mentee_name.trim(),
          topic: v.topic.trim(),
          session_type: v.session_type,
          scheduled_at: new Date(v.scheduled_at).toISOString(),
          duration_minutes: Number(v.duration_minutes) || 60,
          meeting_url: v.meeting_url || null,
          status: v.status,
          notes: v.notes || null,
        },
      },
      { onSuccess: () => setSessionDialog({ open: false, values: emptySession }) },
    );
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

        <Card className="mb-8 bg-card-gradient border-border">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
              <div>
                <CardTitle className="text-2xl">
                  {profile?.full_name || user?.email || "Your mentor profile"}
                </CardTitle>
                <CardDescription className="text-lg">
                  {profile?.expertise || "Add your expertise in the Profile tab"}
                </CardDescription>
                <p className="text-sm text-muted-foreground mt-1">
                  {[profile?.company, profile?.experience].filter(Boolean).join(" • ") || "—"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {specializations.slice(0, 4).map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{mentees.length}</div>
                  <div className="text-xs text-muted-foreground">Total Mentees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{activeMentees.length}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{completedSessions}</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-2xl font-bold text-primary">{Number(profile?.rating ?? 0).toFixed(1)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="mentees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="mentees">Mentees</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="requests">Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}</TabsTrigger>
            <TabsTrigger value="advisor">AI Advisor</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="mentees" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Mentees</h2>
              <Button onClick={() => openMentee()}>
                <Plus className="mr-2 h-4 w-4" /> Add Mentee
              </Button>
            </div>
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Founder</TableHead>
                      <TableHead>Startup</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Current Focus</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Next Session</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menteesLoading && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Loading mentees…
                        </TableCell>
                      </TableRow>
                    )}
                    {!menteesLoading && mentees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No mentees yet. Accept a request or add one manually.
                        </TableCell>
                      </TableRow>
                    )}
                    {mentees.map((mentee) => (
                      <TableRow key={mentee.id}>
                        <TableCell className="font-medium">{mentee.mentee_name}</TableCell>
                        <TableCell>
                          <div className="font-medium">{mentee.startup_name || "—"}</div>
                          {mentee.sector && (
                            <Badge variant="outline" className="text-xs">
                              {mentee.sector}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{mentee.stage ? <Badge variant="secondary">{mentee.stage}</Badge> : "—"}</TableCell>
                        <TableCell>{mentee.current_focus || "—"}</TableCell>
                        <TableCell>{mentee.sessions_completed}</TableCell>
                        <TableCell>{formatDate(mentee.next_session_on)}</TableCell>
                        <TableCell>
                          <Badge variant={mentee.status === "active" ? "default" : "outline"}>{mentee.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openMentee(mentee)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfirmDelete({ type: "mentee", id: mentee.id })}
                            >
                              <Trash2 className="h-4 w-4" />
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
              <Button onClick={() => openSession()}>
                <Plus className="mr-2 h-4 w-4" /> Schedule Session
              </Button>
            </div>
            {sessionsLoading && <p className="text-muted-foreground">Loading sessions…</p>}
            {!sessionsLoading && upcomingSessions.length === 0 && (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No upcoming sessions scheduled.
                </CardContent>
              </Card>
            )}
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <Card key={session.id} className="bg-card-gradient border-border">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="text-lg font-semibold">{session.mentee_name}</h3>
                          <p className="text-sm text-muted-foreground">{session.topic}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(session.scheduled_at)}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {formatTime(session.scheduled_at)} • {session.duration_minutes} min
                          </span>
                          <Badge variant="outline">{session.session_type}</Badge>
                        </div>
                      </div>
                      <div className="space-y-3 md:text-right">
                        <Badge>{session.status}</Badge>
                        <div className="flex flex-wrap gap-2">
                          {session.meeting_url && (
                            <Button size="sm" asChild>
                              <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                                Join Session
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="secondary" onClick={() => completeSession.mutate(session)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openSession(session)}>
                            Reschedule
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmDelete({ type: "session", id: session.id })}
                          >
                            Cancel
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
              <Badge variant="secondary">{pendingRequests.length} Pending</Badge>
            </div>
            {requestsLoading && <p className="text-muted-foreground">Loading requests…</p>}
            {!requestsLoading && requests.length === 0 && (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No mentorship requests yet.
                </CardContent>
              </Card>
            )}
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="bg-card-gradient border-border">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="text-lg font-semibold">{request.founder_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {[request.startup_name, request.sector, request.stage].filter(Boolean).join(" • ") || "—"}
                          </p>
                        </div>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Challenge: </span>
                          {request.challenge}
                        </p>
                        <p className="text-xs text-muted-foreground">Requested on {formatDate(request.created_at)}</p>
                        {request.mentor_notes && (
                          <p className="text-xs text-muted-foreground">Notes: {request.mentor_notes}</p>
                        )}
                      </div>
                      <div className="space-y-3 md:text-right">
                        {request.match_score > 0 && (
                          <div className="flex items-center gap-2 md:justify-end">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-bold">{request.match_score}% Match</span>
                          </div>
                        )}
                        <Badge variant={request.status === "pending" ? "secondary" : "default"}>{request.status}</Badge>
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => respondToRequest.mutate({ request, status: "accepted" })}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => respondToRequest.mutate({ request, status: "declined" })}
                            >
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advisor">
            <AdvisorPanel />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" /> Mentor Profile
                </CardTitle>
                <CardDescription>This information is used for mentee matching.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Full name</Label>
                    <Input
                      value={String(profileValues.full_name)}
                      onChange={(e) => setProfileValue("full_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Expertise</Label>
                    <Input
                      value={String(profileValues.expertise)}
                      onChange={(e) => setProfileValue("expertise", e.target.value)}
                      placeholder="Technology & Product Strategy"
                    />
                  </div>
                  <div>
                    <Label>Company / Title</Label>
                    <Input
                      value={String(profileValues.company)}
                      onChange={(e) => setProfileValue("company", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Experience</Label>
                    <Input
                      value={String(profileValues.experience)}
                      onChange={(e) => setProfileValue("experience", e.target.value)}
                      placeholder="15+ years"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Specializations (comma separated)</Label>
                    <Input
                      value={String(profileValues.specializations)}
                      onChange={(e) => setProfileValue("specializations", e.target.value)}
                      placeholder="Product Strategy, Fundraising, Team Building"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Bio</Label>
                    <Textarea
                      rows={4}
                      value={String(profileValues.bio)}
                      onChange={(e) => setProfileValue("bio", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>LinkedIn URL</Label>
                    <Input
                      value={String(profileValues.linkedin_url)}
                      onChange={(e) => setProfileValue("linkedin_url", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="font-medium">New request notifications</p>
                    <p className="text-sm text-muted-foreground">Email me when a founder requests mentorship</p>
                  </div>
                  <Switch
                    checked={Boolean(profileValues.notify_new_requests)}
                    onCheckedChange={(v) => setProfileValue("notify_new_requests", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session reminders</p>
                    <p className="text-sm text-muted-foreground">Remind me before scheduled sessions</p>
                  </div>
                  <Switch
                    checked={Boolean(profileValues.notify_session_reminders)}
                    onCheckedChange={(v) => setProfileValue("notify_session_reminders", v)}
                  />
                </div>
                <Button onClick={submitProfile} disabled={saveProfile.isPending}>
                  {saveProfile.isPending ? "Saving…" : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mentee dialog */}
      <Dialog
        open={menteeDialog.open}
        onOpenChange={(open) => setMenteeDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{menteeDialog.id ? "Edit mentee" : "Add mentee"}</DialogTitle>
            <DialogDescription>Track the founders you are guiding.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Founder name*</Label>
              <Input
                value={menteeDialog.values.mentee_name}
                onChange={(e) =>
                  setMenteeDialog((p) => ({ ...p, values: { ...p.values, mentee_name: e.target.value } }))
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={menteeDialog.values.mentee_email}
                onChange={(e) =>
                  setMenteeDialog((p) => ({ ...p, values: { ...p.values, mentee_email: e.target.value } }))
                }
              />
            </div>
            <div>
              <Label>Startup</Label>
              <Input
                value={menteeDialog.values.startup_name}
                onChange={(e) =>
                  setMenteeDialog((p) => ({ ...p, values: { ...p.values, startup_name: e.target.value } }))
                }
              />
            </div>
            <div>
              <Label>Sector</Label>
              <Input
                value={menteeDialog.values.sector}
                onChange={(e) => setMenteeDialog((p) => ({ ...p, values: { ...p.values, sector: e.target.value } }))}
              />
            </div>
            <div>
              <Label>Stage</Label>
              <Input
                value={menteeDialog.values.stage}
                onChange={(e) => setMenteeDialog((p) => ({ ...p, values: { ...p.values, stage: e.target.value } }))}
              />
            </div>
            <div>
              <Label>Current focus</Label>
              <Input
                value={menteeDialog.values.current_focus}
                onChange={(e) =>
                  setMenteeDialog((p) => ({ ...p, values: { ...p.values, current_focus: e.target.value } }))
                }
              />
            </div>
            <div>
              <Label>Next session</Label>
              <Input
                type="date"
                value={menteeDialog.values.next_session_on}
                onChange={(e) =>
                  setMenteeDialog((p) => ({ ...p, values: { ...p.values, next_session_on: e.target.value } }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label>Status</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={menteeDialog.values.status}
                onChange={(e) => setMenteeDialog((p) => ({ ...p, values: { ...p.values, status: e.target.value } }))}
              >
                <option value="active">active</option>
                <option value="paused">paused</option>
                <option value="completed">completed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Textarea
                rows={3}
                value={menteeDialog.values.notes}
                onChange={(e) => setMenteeDialog((p) => ({ ...p, values: { ...p.values, notes: e.target.value } }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMenteeDialog({ open: false, values: emptyMentee })}>
              Cancel
            </Button>
            <Button onClick={submitMentee} disabled={saveMentee.isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session dialog */}
      <Dialog
        open={sessionDialog.open}
        onOpenChange={(open) => setSessionDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{sessionDialog.id ? "Reschedule session" : "Schedule session"}</DialogTitle>
            <DialogDescription>Sessions are saved to your mentor calendar.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Mentee*</Label>
              <Input
                list="mentor-mentee-options"
                value={sessionDialog.values.mentee_name}
                onChange={(e) =>
                  setSessionDialog((p) => ({ ...p, values: { ...p.values, mentee_name: e.target.value } }))
                }
              />
              <datalist id="mentor-mentee-options">
                {mentees.map((m) => (
                  <option key={m.id} value={m.mentee_name} />
                ))}
              </datalist>
            </div>
            <div>
              <Label>Topic*</Label>
              <Input
                value={sessionDialog.values.topic}
                onChange={(e) => setSessionDialog((p) => ({ ...p, values: { ...p.values, topic: e.target.value } }))}
              />
            </div>
            <div>
              <Label>Date & time*</Label>
              <Input
                type="datetime-local"
                value={sessionDialog.values.scheduled_at}
                onChange={(e) =>
                  setSessionDialog((p) => ({ ...p, values: { ...p.values, scheduled_at: e.target.value } }))
                }
              />
            </div>
            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={sessionDialog.values.duration_minutes}
                onChange={(e) =>
                  setSessionDialog((p) => ({
                    ...p,
                    values: { ...p.values, duration_minutes: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={sessionDialog.values.session_type}
                onChange={(e) =>
                  setSessionDialog((p) => ({ ...p, values: { ...p.values, session_type: e.target.value } }))
                }
              >
                <option>Video Call</option>
                <option>Phone Call</option>
                <option>In-Person</option>
              </select>
            </div>
            <div>
              <Label>Meeting link</Label>
              <Input
                value={sessionDialog.values.meeting_url}
                onChange={(e) =>
                  setSessionDialog((p) => ({ ...p, values: { ...p.values, meeting_url: e.target.value } }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Textarea
                rows={3}
                value={sessionDialog.values.notes}
                onChange={(e) => setSessionDialog((p) => ({ ...p, values: { ...p.values, notes: e.target.value } }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionDialog({ open: false, values: emptySession })}>
              Cancel
            </Button>
            <Button onClick={submitSession} disabled={saveSession.isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the {confirmDelete?.type === "mentee" ? "mentee record" : "session"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirmDelete) return;
                if (confirmDelete.type === "mentee") deleteMentee.mutate(confirmDelete.id);
                else deleteSession.mutate(confirmDelete.id);
                setConfirmDelete(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MentorDashboard;

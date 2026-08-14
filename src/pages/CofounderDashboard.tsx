import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Users, TrendingUp, Star, BrainCircuit, Pencil, Trash2, Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import CofounderPostDialog from "@/components/CofounderPostDialog";
import AdvisorPanel from "@/components/AdvisorPanel";
import CofounderOpportunityDialog from "@/components/CofounderOpportunityDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  useMyCofounderPosts,
  useApplicationsToMyPosts,
  useMyCofounderApplications,
  useOpenCofounderPosts,
  useMyProfile,
  formatDate,
} from "@/hooks/useMyData";

const APPLICANT_STAGES = ["new", "shortlisted", "accepted", "rejected"];

const CofounderDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [tab, setTab] = useDashboardTab("cofounder-dashboard-tab", "posts");
  const { unreadCount } = useNotifications();

  const { data: profile } = useMyProfile();
  const { data: myPosts = [], isLoading: postsLoading } = useMyCofounderPosts();
  const { data: received = [], isLoading: receivedLoading } = useApplicationsToMyPosts();
  const { data: sent = [] } = useMyCofounderApplications();
  const { data: opportunities = [], isLoading: oppLoading } = useOpenCofounderPosts();
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [oppOpen, setOppOpen] = useState(false);
  const [oppApply, setOppApply] = useState(false);
  const [oppSearch, setOppSearch] = useState("");
  const [editPost, setEditPost] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [profileForm, setProfileForm] = useState({ full_name: "", phone: "", city: "", bio: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        city: profile.city ?? "",
        bio: profile.bio ?? "",
      });
    }
  }, [profile]);

  const appliedIds = useMemo(() => new Set(sent.map((a: any) => a.request_id)), [sent]);
  const myPostIds = useMemo(() => new Set(myPosts.map((p: any) => p.id)), [myPosts]);
  const visibleOpportunities = useMemo(() => {
    const q = oppSearch.trim().toLowerCase();
    return opportunities.filter((p: any) => {
      if (myPostIds.has(p.id)) return false;
      if (!q) return true;
      return [p.title, p.description, p.skills_needed, p.location].some((v: any) =>
        String(v ?? "").toLowerCase().includes(q));
    });
  }, [opportunities, myPostIds, oppSearch]);

  const openOpportunity = (post: any, applyMode: boolean) => {
    setSelectedOpportunity(post);
    setOppApply(applyMode);
    setOppOpen(true);
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

  const saveFounderNote = async (id: string) => {
    const { error } = await supabase
      .from("cofounder_applications")
      .update({ founder_notes: notesDraft[id] ?? "" })
      .eq("id", id);
    if (error) {
      toast({ title: "Could not save note", description: error.message, variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["applications-to-my-posts"] });
    toast({ title: "Note saved" });
  };

  const deletePost = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("cofounder_requests").delete().eq("id", deleteTarget.id);
    setDeleteTarget(null);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["my-cofounder-posts"] });
    queryClient.invalidateQueries({ queryKey: ["open-cofounder-posts"] });
    toast({ title: "Post deleted" });
  };

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update(profileForm).eq("user_id", user.id);
    setSavingProfile(false);
    if (error) {
      toast({ title: "Could not save profile", description: error.message, variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    toast({ title: "Profile updated" });
  };


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <DashboardHeader
          title="Co-founder Dashboard"
          subtitle="Manage your co-founder search, applications and profile"
          onOpenNotifications={() => setTab("notifications")}
          onOpenSettings={() => setTab("account")}
          stats={[
            { label: "My posts", value: myPosts.length },
            { label: "Applications received", value: received.length },
            { label: "Applications sent", value: sent.length },
          ]}
        />

        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">My Applications</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="advisor">Advisor</TabsTrigger>
            <TabsTrigger value="notifications">Alerts{unreadCount > 0 ? ` (${unreadCount})` : ""}</TabsTrigger>
            <TabsTrigger value="account">Profile &amp; Settings</TabsTrigger>
          </TabsList>



          <TabsContent value="posts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Co-founder Posts</h2>
              <CofounderPostDialog>
                <Button><Plus className="mr-2 h-4 w-4" />Create New Post</Button>
              </CofounderPostDialog>
            </div>
            {postsLoading ? (
              <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading your posts…</CardContent></Card>
            ) : myPosts.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">You haven't posted a requirement yet.</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myPosts.map((post: any) => {
                  const count = received.filter((a: any) => a.request_id === post.id).length;
                  return (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <Badge variant="secondary" className="capitalize">{post.review_status}</Badge>
                        </div>
                        <CardDescription>Posted {formatDate(post.created_at)}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">{post.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="text-muted-foreground">Equity: </span><span className="font-medium">{post.equity_offered || "—"}</span></div>
                          <div><span className="text-muted-foreground">Commitment: </span><span className="font-medium">{post.commitment || "—"}</span></div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{count}</div>
                          <div className="text-xs text-muted-foreground">Applications received</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            disabled={post.review_status !== "approved"}
                            onClick={() => navigate(`/meet-cofounder?post=${post.id}`)}
                          >
                            {post.review_status === "approved" ? "View Public Listing" : "Awaiting approval"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditPost(post)}>
                            <Pencil className="mr-2 h-3 w-3" />Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setDeleteTarget(post)}>
                            <Trash2 className="mr-2 h-3 w-3" />Delete
                          </Button>
                        </div>
                      </CardContent>

                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="received" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Applications Received</h2>
              <Badge variant="secondary">{received.length} total</Badge>
            </div>
            {receivedLoading ? (
              <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading…</CardContent></Card>
            ) : received.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No applications yet.</CardContent></Card>
            ) : (
              <div className="space-y-4">
                {received.map((a: any) => (
                  <Card key={a.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-3 flex-wrap">
                        <div>
                          <CardTitle className="text-lg">{a.applicant_name}</CardTitle>
                          <CardDescription>Applied to “{a.post_title}” • {formatDate(a.created_at)}</CardDescription>
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
                          <a href={a.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Profile link</a>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {APPLICANT_STAGES.filter((s) => s !== a.status).map((s) => (
                          <Button key={s} size="sm" variant="outline" className="capitalize" onClick={() => updateApplicantStatus(a.id, s)}>
                            Mark {s}
                          </Button>
                        ))}
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`mailto:${a.email}`}>Email applicant</a>
                        </Button>
                      </div>
                      <div className="space-y-2 pt-2">
                        <Label htmlFor={`note-${a.id}`} className="text-xs">Private note to applicant</Label>
                        <Textarea
                          id={`note-${a.id}`}
                          rows={2}
                          placeholder="Add feedback or next steps…"
                          value={notesDraft[a.id] ?? a.founder_notes ?? ""}
                          onChange={(e) => setNotesDraft({ ...notesDraft, [a.id]: e.target.value })}
                        />
                        <Button size="sm" variant="secondary" onClick={() => saveFounderNote(a.id)}>Save note</Button>
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-6">
            <h2 className="text-2xl font-bold">My Applications</h2>
            {sent.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">You haven't applied to any co-founder opportunity yet.</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sent.map((a: any) => (
                  <Card key={a.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg">{a.cofounder_requests?.title || "Co-founder opportunity"}</CardTitle>
                        <Badge variant="outline" className="capitalize">{a.status}</Badge>
                      </div>
                      <CardDescription>Applied {formatDate(a.created_at)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">{a.message}</p>
                      {a.founder_notes && <p className="mt-3 text-xs text-muted-foreground">Founder note: {a.founder_notes}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">Open Opportunities</h2>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search roles, skills, location…"
                  value={oppSearch}
                  onChange={(e) => setOppSearch(e.target.value)}
                />
              </div>
            </div>
            {oppLoading ? (
              <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading…</CardContent></Card>
            ) : visibleOpportunities.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No open opportunities match your search.</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleOpportunities.map((post: any) => {
                  const applied = appliedIds.has(post.id);
                  return (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          {applied && <Badge variant="secondary">Applied</Badge>}
                        </div>
                        <CardDescription>{post.location ? `Based in ${post.location}` : "Location flexible"}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-3">{post.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {post.equity_offered && <Badge variant="outline">Equity: {post.equity_offered}</Badge>}
                          {post.commitment && <Badge variant="outline">{post.commitment}</Badge>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openOpportunity(post, false)}>Learn More</Button>
                          <Button size="sm" disabled={applied} onClick={() => openOpportunity(post, true)}>
                            {applied ? "Application Sent" : "Apply Now"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Founder details</CardTitle>
                <CardDescription>Shown to founders when you apply to their posts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="p-name">Full name</Label>
                    <Input id="p-name" value={profileForm.full_name} onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-phone">Phone</Label>
                    <Input id="p-phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-city">City</Label>
                    <Input id="p-city" value={profileForm.city} onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile?.email ?? user?.email ?? ""} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-bio">Bio</Label>
                  <Textarea id="p-bio" rows={4} value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} />
                </div>
                <Button onClick={saveProfile} disabled={savingProfile}>{savingProfile ? "Saving…" : "Save Profile"}</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advisor" className="space-y-6">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Startup Advisor</h2>
            </div>
            <AdvisorPanel compact />
          </TabsContent>
        </Tabs>
      </main>

      <CofounderOpportunityDialog
        opportunity={selectedOpportunity}
        open={oppOpen}
        onOpenChange={setOppOpen}
        startInApplyMode={oppApply}
      />

      <CofounderPostDialog post={editPost} open={!!editPost} onOpenChange={(o) => !o && setEditPost(null)} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleteTarget?.title}” and its public listing will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletePost}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};


export default CofounderDashboard;

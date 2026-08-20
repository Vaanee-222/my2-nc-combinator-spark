import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Globe, History, Image as ImageIcon, Megaphone, Search, Upload, FileCode, Library, Copy, Download } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings, SITE_SETTINGS_QUERY_KEY, type SiteSettings } from "@/hooks/useSiteSettings";
import { logAudit } from "@/lib/audit";
import { MediaPickerDialog, uploadMediaAsset } from "@/components/dashboard/MediaLibrary";
import { STATIC_SITEMAP_ENTRIES, buildRobotsTxt, buildSitemapXml, DEFAULT_ROBOTS_TXT, normalizePath } from "@/lib/seoFiles";
import { SkeletonCards } from "@/components/dashboard/EmptyState";

type Draft = Partial<SiteSettings> & {
  robots_txt?: string | null;
  sitemap_extra_paths?: string[] | null;
  sitemap_enabled?: boolean | null;
};

type ImageFieldName = "logo_url" | "favicon_url" | "og_image_url";

const BASE_URL = "https://xicombinator.lovable.app";

const EDITABLE_KEYS = [
  "site_name", "tagline", "logo_url", "favicon_url", "meta_title", "meta_description",
  "og_image_url", "twitter_handle", "contact_email", "contact_phone", "address",
  "linkedin_url", "twitter_url", "youtube_url", "footer_text", "announcement_text",
  "announcement_enabled", "robots_txt", "sitemap_extra_paths", "sitemap_enabled",
] as const;

const pickEditable = (source: Draft) => {
  const out: Record<string, unknown> = {};
  for (const key of EDITABLE_KEYS) out[key] = (source as Record<string, unknown>)[key] ?? null;
  out.site_name = source.site_name || "Xi Combinator";
  out.announcement_enabled = !!source.announcement_enabled;
  out.sitemap_enabled = source.sitemap_enabled ?? true;
  out.sitemap_extra_paths = source.sitemap_extra_paths ?? [];
  return out;
};

interface VersionRow {
  id: string;
  snapshot: Record<string, unknown>;
  note: string | null;
  created_at: string;
}

const SiteSettingsCMS = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useSiteSettings();
  const live = data as Draft | null;
  const [draft, setDraft] = useState<Draft>({});
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [pickerField, setPickerField] = useState<ImageFieldName | null>(null);
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [viewVersion, setViewVersion] = useState<VersionRow | null>(null);

  useEffect(() => {
    if (!data) return;
    const record = data as Draft;
    // Resume an unpublished draft when one exists.
    const stored = (record.draft_settings as Draft | null) ?? null;
    setDraft(record.has_draft && stored ? { ...record, ...stored } : record);
  }, [data]);

  const loadVersions = async () => {
    const { data: rows } = await (supabase as any)
      .from("site_settings_versions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setVersions((rows as VersionRow[]) ?? []);
  };
  useEffect(() => { loadVersions(); }, []);

  const set = (key: keyof Draft, value: unknown) => setDraft((d) => ({ ...d, [key]: value }));

  const dirty = useMemo(() => {
    if (!live) return false;
    return JSON.stringify(pickEditable(draft)) !== JSON.stringify(pickEditable(live));
  }, [draft, live]);

  const uploadImage = async (field: ImageFieldName, file: File) => {
    setUploading(field);
    const folder = field === "logo_url" ? "logo" : field === "favicon_url" ? "favicon" : "social";
    const { asset, error } = await uploadMediaAsset(file, folder);
    setUploading(null);
    if (error || !asset) return toast({ title: "Upload failed", description: error, variant: "destructive" });
    set(field, asset.url);
    toast({ title: "Image uploaded to media library", description: "Remember to save or publish." });
  };

  /** Store the working copy without touching the live site. */
  const saveDraft = async () => {
    if (!data?.id) return;
    setSaving(true);
    const payload = pickEditable(draft);
    const { error } = await (supabase as any)
      .from("site_settings")
      .update({ draft_settings: payload, has_draft: true })
      .eq("id", data.id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    logAudit({ action: "update", table: "site_settings", recordId: data.id, details: { draft: true } });
    qc.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
    toast({ title: "Draft saved", description: "Not visible to visitors until you publish." });
  };

  /** Snapshot current live values, then push the draft live. */
  const publish = async () => {
    if (!data?.id) return;
    setPublishing(true);
    const payload = pickEditable(draft);
    const { data: userRes } = await supabase.auth.getUser();
    await (supabase as any).from("site_settings_versions").insert({
      settings_id: data.id,
      snapshot: pickEditable(live ?? {}),
      note: "Snapshot taken before publish",
      created_by: userRes.user?.id ?? null,
    });
    const { error } = await (supabase as any)
      .from("site_settings")
      .update({ ...payload, draft_settings: null, has_draft: false })
      .eq("id", data.id);
    setPublishing(false);
    if (error) return toast({ title: "Publish failed", description: error.message, variant: "destructive" });
    logAudit({ action: "update", table: "site_settings", recordId: data.id, details: { published: true } });
    qc.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
    loadVersions();
    toast({ title: "Published", description: "Changes are live across the website." });
  };

  const discardDraft = async () => {
    if (!data?.id) return;
    await (supabase as any).from("site_settings").update({ draft_settings: null, has_draft: false }).eq("id", data.id);
    setDraft(live ?? {});
    qc.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
    toast({ title: "Draft discarded" });
  };

  const restoreVersion = async (version: VersionRow) => {
    if (!data?.id) return;
    if (!confirm("Roll the live website back to this version?")) return;
    const { data: userRes } = await supabase.auth.getUser();
    await (supabase as any).from("site_settings_versions").insert({
      settings_id: data.id,
      snapshot: pickEditable(live ?? {}),
      note: "Snapshot taken before rollback",
      created_by: userRes.user?.id ?? null,
    });
    const { error } = await (supabase as any)
      .from("site_settings")
      .update({ ...version.snapshot, draft_settings: null, has_draft: false })
      .eq("id", data.id);
    if (error) return toast({ title: "Rollback failed", description: error.message, variant: "destructive" });
    logAudit({ action: "update", table: "site_settings", recordId: data.id, details: { rolledBackTo: version.id } });
    qc.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
    loadVersions();
    toast({ title: "Rolled back", description: "Live settings restored from version history." });
  };

  const extraPaths = (draft.sitemap_extra_paths ?? []).join("\n");
  const sitemapEnabled = draft.sitemap_enabled ?? true;

  const sitemapPreview = useMemo(() => {
    const entries = [
      ...STATIC_SITEMAP_ENTRIES,
      ...(draft.sitemap_extra_paths ?? [])
        .map((p) => normalizePath(p))
        .filter(Boolean)
        .map((path) => ({ path, changefreq: "monthly" as const, priority: "0.5" })),
    ];
    return buildSitemapXml(BASE_URL, entries);
  }, [draft.sitemap_extra_paths]);

  const robotsPreview = useMemo(
    () => buildRobotsTxt({ body: draft.robots_txt, baseUrl: BASE_URL, sitemapEnabled }),
    [draft.robots_txt, sitemapEnabled],
  );

  const download = (filename: string, content: string, type: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ImageField = ({ field, label, hint }: { field: ImageFieldName; label: string; hint: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        {draft[field] ? (
          <img src={draft[field] as string} alt={`${label} preview`} className="h-12 w-12 rounded border border-border object-contain bg-muted" />
        ) : (
          <div className="h-12 w-12 rounded border border-dashed border-border flex items-center justify-center text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
          </div>
        )}
        <Input value={(draft[field] as string) || ""} onChange={(e) => set(field, e.target.value)} placeholder="https://…" />
        <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => setPickerField(field)}>
          <Library className="h-3.5 w-3.5 mr-1" /> Library
        </Button>
        <label className="shrink-0">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadImage(field, e.target.files[0])}
          />
          <Button type="button" variant="outline" size="sm" asChild disabled={uploading === field}>
            <span className="cursor-pointer inline-flex items-center gap-1">
              <Upload className="h-3.5 w-3.5" /> {uploading === field ? "Uploading…" : "Upload"}
            </span>
          </Button>
        </label>
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );

  if (isLoading) return <SkeletonCards count={3} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Website CMS
            {(data as Draft)?.has_draft && <Badge variant="secondary">Unpublished draft</Badge>}
            {dirty && <Badge variant="outline">Unsaved changes</Badge>}
          </h2>
          <p className="text-sm text-muted-foreground">
            Edit safely in draft mode, preview, publish when ready — and roll back any time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data as Draft)?.has_draft && (
            <Button variant="ghost" onClick={discardDraft}>Discard draft</Button>
          )}
          <Button variant="outline" onClick={saveDraft} disabled={saving}>{saving ? "Saving…" : "Save draft"}</Button>
          <Button onClick={publish} disabled={publishing}>{publishing ? "Publishing…" : "Publish"}</Button>
        </div>
      </div>

      <Tabs defaultValue="branding">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="branding"><ImageIcon className="h-4 w-4 mr-1" /> Branding</TabsTrigger>
          <TabsTrigger value="seo"><Search className="h-4 w-4 mr-1" /> SEO</TabsTrigger>
          <TabsTrigger value="files"><FileCode className="h-4 w-4 mr-1" /> Sitemap & Robots</TabsTrigger>
          <TabsTrigger value="contact"><Globe className="h-4 w-4 mr-1" /> Contact & Social</TabsTrigger>
          <TabsTrigger value="announcement"><Megaphone className="h-4 w-4 mr-1" /> Announcement</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-1" /> Version history</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Brand identity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Site name</Label>
                  <Input value={draft.site_name || ""} onChange={(e) => set("site_name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={draft.tagline || ""} onChange={(e) => set("tagline", e.target.value)} />
                </div>
              </div>
              <ImageField field="logo_url" label="Logo" hint="Shown in the navigation bar. Transparent PNG or SVG recommended." />
              <ImageField field="favicon_url" label="Favicon" hint="Square image, 32x32 or 64x64 px." />
              <div className="space-y-2">
                <Label>Footer text</Label>
                <Textarea value={draft.footer_text || ""} onChange={(e) => set("footer_text", e.target.value)} rows={2} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Default SEO metadata</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Meta title <span className="text-xs text-muted-foreground">({(draft.meta_title || "").length}/60)</span></Label>
                <Input value={draft.meta_title || ""} onChange={(e) => set("meta_title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Meta description <span className="text-xs text-muted-foreground">({(draft.meta_description || "").length}/160)</span></Label>
                <Textarea value={draft.meta_description || ""} onChange={(e) => set("meta_description", e.target.value)} rows={3} />
              </div>
              <ImageField field="og_image_url" label="Social preview image" hint="1200x630 px recommended for link previews." />
              <div className="space-y-2">
                <Label>Twitter handle</Label>
                <Input value={draft.twitter_handle || ""} onChange={(e) => set("twitter_handle", e.target.value)} placeholder="@xicombinator" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Sitemap</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Generate sitemap.xml</Label>
                  <p className="text-xs text-muted-foreground">
                    Regenerated on every build from these settings plus published blogs, news and partners.
                  </p>
                </div>
                <Switch checked={sitemapEnabled} onCheckedChange={(c) => set("sitemap_enabled", c)} />
              </div>
              <div className="space-y-2">
                <Label>Extra paths (one per line)</Label>
                <Textarea
                  rows={4}
                  value={extraPaths}
                  onChange={(e) => set("sitemap_extra_paths", e.target.value.split("\n").map((v) => v.trim()).filter(Boolean))}
                  placeholder="/landing/demo-day"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Preview (static routes + your extra paths)</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(sitemapPreview); toast({ title: "Copied" }); }}>
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => download("sitemap.xml", sitemapPreview, "application/xml")}>
                      <Download className="h-3.5 w-3.5 mr-1" /> Download
                    </Button>
                  </div>
                </div>
                <pre className="max-h-64 overflow-auto rounded border border-border bg-muted p-3 text-xs">{sitemapPreview}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">robots.txt</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rules</Label>
                <Textarea
                  rows={8}
                  className="font-mono text-xs"
                  value={draft.robots_txt ?? DEFAULT_ROBOTS_TXT}
                  onChange={(e) => set("robots_txt", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The Sitemap directive is appended automatically when the sitemap is enabled.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Preview</Label>
                  <Button size="sm" variant="outline" onClick={() => download("robots.txt", robotsPreview, "text/plain")}>
                    <Download className="h-3.5 w-3.5 mr-1" /> Download
                  </Button>
                </div>
                <pre className="rounded border border-border bg-muted p-3 text-xs">{robotsPreview}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Contact & social links</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Contact email</Label><Input value={draft.contact_email || ""} onChange={(e) => set("contact_email", e.target.value)} /></div>
              <div className="space-y-2"><Label>Contact phone</Label><Input value={draft.contact_phone || ""} onChange={(e) => set("contact_phone", e.target.value)} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Address</Label><Input value={draft.address || ""} onChange={(e) => set("address", e.target.value)} /></div>
              <div className="space-y-2"><Label>LinkedIn URL</Label><Input value={draft.linkedin_url || ""} onChange={(e) => set("linkedin_url", e.target.value)} /></div>
              <div className="space-y-2"><Label>X / Twitter URL</Label><Input value={draft.twitter_url || ""} onChange={(e) => set("twitter_url", e.target.value)} /></div>
              <div className="space-y-2"><Label>YouTube URL</Label><Input value={draft.youtube_url || ""} onChange={(e) => set("youtube_url", e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcement" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Announcement bar</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Show announcement bar</Label>
                <Switch checked={!!draft.announcement_enabled} onCheckedChange={(c) => set("announcement_enabled", c)} />
              </div>
              <div className="space-y-2">
                <Label>Announcement text</Label>
                <Textarea value={draft.announcement_text || ""} onChange={(e) => set("announcement_text", e.target.value)} rows={2} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Version history</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Site name</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="text-sm">{new Date(v.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{String(v.snapshot?.site_name ?? "—")}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.note ?? "—"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setViewVersion(v)}>View</Button>
                        <Button size="sm" onClick={() => restoreVersion(v)}>Restore</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {versions.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No versions yet — publish once to create the first snapshot.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MediaPickerDialog
        open={!!pickerField}
        onOpenChange={(o) => !o && setPickerField(null)}
        folder={pickerField === "logo_url" ? "logo" : pickerField === "favicon_url" ? "favicon" : "social"}
        onSelect={(asset) => { if (pickerField) set(pickerField, asset.url); }}
      />

      <Dialog open={!!viewVersion} onOpenChange={(o) => !o && setViewVersion(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Version snapshot</DialogTitle></DialogHeader>
          <pre className="max-h-[60vh] overflow-auto rounded bg-muted p-3 text-xs">
            {JSON.stringify(viewVersion?.snapshot ?? {}, null, 2)}
          </pre>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewVersion(null)}>Close</Button>
            {viewVersion && <Button onClick={() => { restoreVersion(viewVersion); setViewVersion(null); }}>Restore this version</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteSettingsCMS;

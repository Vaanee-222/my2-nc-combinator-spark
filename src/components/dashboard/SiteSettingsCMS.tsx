import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Image as ImageIcon, Megaphone, Search, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings, SITE_SETTINGS_QUERY_KEY, type SiteSettings } from "@/hooks/useSiteSettings";
import { logAudit } from "@/lib/audit";

type Draft = Partial<SiteSettings>;

const SiteSettingsCMS = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useSiteSettings();
  const [draft, setDraft] = useState<Draft>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const set = (key: keyof SiteSettings, value: unknown) => setDraft((d) => ({ ...d, [key]: value }));

  const uploadImage = async (field: "logo_url" | "favicon_url" | "og_image_url", file: File) => {
    setUploading(field);
    const path = `site/${field}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
    const { error } = await supabase.storage.from("partner-logos").upload(path, file, { upsert: true });
    setUploading(null);
    if (error) return toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    const { data: pub } = supabase.storage.from("partner-logos").getPublicUrl(path);
    set(field, pub.publicUrl);
    toast({ title: "Image uploaded", description: "Remember to save your changes." });
  };

  const save = async () => {
    if (!data?.id) return;
    setSaving(true);
    const payload = {
      site_name: draft.site_name || "Xi Combinator",
      tagline: draft.tagline ?? null,
      logo_url: draft.logo_url ?? null,
      favicon_url: draft.favicon_url ?? null,
      meta_title: draft.meta_title ?? null,
      meta_description: draft.meta_description ?? null,
      og_image_url: draft.og_image_url ?? null,
      twitter_handle: draft.twitter_handle ?? null,
      contact_email: draft.contact_email ?? null,
      contact_phone: draft.contact_phone ?? null,
      address: draft.address ?? null,
      linkedin_url: draft.linkedin_url ?? null,
      twitter_url: draft.twitter_url ?? null,
      youtube_url: draft.youtube_url ?? null,
      footer_text: draft.footer_text ?? null,
      announcement_text: draft.announcement_text ?? null,
      announcement_enabled: !!draft.announcement_enabled,
    };
    const { error } = await supabase.from("site_settings").update(payload).eq("id", data.id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    logAudit({ action: "update", table: "site_settings", recordId: data.id, details: payload });
    qc.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
    toast({ title: "Site settings saved", description: "Changes are live across the website." });
  };

  const ImageField = ({
    field,
    label,
    hint,
  }: {
    field: "logo_url" | "favicon_url" | "og_image_url";
    label: string;
    hint: string;
  }) => (
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

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading site settings…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Website CMS</h2>
          <p className="text-sm text-muted-foreground">Manage branding, SEO metadata and global content shown across the public website.</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>

      <Tabs defaultValue="branding">
        <TabsList>
          <TabsTrigger value="branding"><ImageIcon className="h-4 w-4 mr-1" /> Branding</TabsTrigger>
          <TabsTrigger value="seo"><Search className="h-4 w-4 mr-1" /> SEO</TabsTrigger>
          <TabsTrigger value="contact"><Globe className="h-4 w-4 mr-1" /> Contact & Social</TabsTrigger>
          <TabsTrigger value="announcement"><Megaphone className="h-4 w-4 mr-1" /> Announcement</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default SiteSettingsCMS;

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, ImagePlus, Loader2, Search, Trash2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAudit } from "@/lib/audit";

export interface MediaAsset {
  id: string;
  file_name: string;
  url: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  folder: string;
  created_at: string;
}

export const MEDIA_FOLDERS = ["general", "logo", "favicon", "social", "partners", "content"] as const;

const BUCKET = "partner-logos";

const prettySize = (bytes: number | null) =>
  !bytes ? "—" : bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

export function useMediaAssets() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false });
    setAssets((data as MediaAsset[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  return { assets, loading, reload: load };
}

export async function uploadMediaAsset(file: File, folder: string) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `media/${folder}/${Date.now()}-${safeName}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
  if (upErr) return { error: upErr.message };
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const { data, error } = await (supabase as any)
    .from("media_assets")
    .insert({
      file_name: file.name,
      url: pub.publicUrl,
      storage_path: path,
      mime_type: file.type,
      size_bytes: file.size,
      folder,
    })
    .select()
    .maybeSingle();
  if (error) return { error: error.message };
  logAudit({ action: "create", table: "media_assets", recordId: data?.id, details: { path } });
  return { asset: data as MediaAsset };
}

interface Props {
  /** When provided the grid becomes selectable (picker mode). */
  onSelect?: (asset: MediaAsset) => void;
  compact?: boolean;
  defaultFolder?: string;
}

const MediaLibrary = ({ onSelect, compact, defaultFolder = "general" }: Props) => {
  const { toast } = useToast();
  const { assets, loading, reload } = useMediaAssets();
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState(defaultFolder);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const { error } = await uploadMediaAsset(file, folder);
      if (error) toast({ title: `Upload failed: ${file.name}`, description: error, variant: "destructive" });
    }
    setUploading(false);
    reload();
    toast({ title: "Upload complete" });
  };

  const remove = async (asset: MediaAsset) => {
    if (!confirm(`Delete ${asset.file_name}? Pages using this image will lose it.`)) return;
    await supabase.storage.from(BUCKET).remove([asset.storage_path]);
    const { error } = await (supabase as any).from("media_assets").delete().eq("id", asset.id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    logAudit({ action: "delete", table: "media_assets", recordId: asset.id, details: { path: asset.storage_path } });
    toast({ title: "Deleted" });
    reload();
  };

  const saveAlt = async (asset: MediaAsset, alt: string) => {
    await (supabase as any).from("media_assets").update({ alt_text: alt }).eq("id", asset.id);
  };

  const visible = assets.filter(
    (a) =>
      (filter === "all" || a.folder === filter) &&
      (!search || a.file_name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-4">
      {!compact && (
        <div>
          <h2 className="text-xl font-semibold">Media Library</h2>
          <p className="text-sm text-muted-foreground">
            Upload once, reuse everywhere — logos, favicons, social preview images and content imagery.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Upload to folder</Label>
          <Select value={folder} onValueChange={setFolder}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MEDIA_FOLDERS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
          />
          <Button asChild disabled={uploading}>
            <span className="cursor-pointer inline-flex items-center gap-2">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {uploading ? "Uploading…" : "Upload images"}
            </span>
          </Button>
        </label>
        <div className="flex-1 min-w-[200px] space-y-1">
          <Label className="text-xs">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="File name…" />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Filter</Label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All folders</SelectItem>
              {MEDIA_FOLDERS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading media…</div>
      ) : visible.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No media yet. Upload your first image.</CardContent></Card>
      ) : (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <img src={asset.url} alt={asset.alt_text || asset.file_name} className="max-h-full max-w-full object-contain" loading="lazy" />
              </div>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium truncate" title={asset.file_name}>{asset.file_name}</p>
                  <Badge variant="outline" className="shrink-0 text-[10px]">{asset.folder}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">{prettySize(asset.size_bytes)}</p>
                {!compact && (
                  <Input
                    className="h-7 text-xs"
                    defaultValue={asset.alt_text ?? ""}
                    placeholder="Alt text"
                    onBlur={(e) => saveAlt(asset, e.target.value)}
                  />
                )}
                <div className="flex gap-1">
                  {onSelect && (
                    <Button size="sm" className="flex-1 h-7 text-xs" onClick={() => onSelect(asset)}>
                      <Check className="h-3 w-3 mr-1" /> Use
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => { navigator.clipboard.writeText(asset.url); toast({ title: "URL copied" }); }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => remove(asset)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export const MediaPickerDialog = ({
  open,
  onOpenChange,
  onSelect,
  folder,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: MediaAsset) => void;
  folder?: string;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
      <DialogHeader><DialogTitle>Media library</DialogTitle></DialogHeader>
      <MediaLibrary compact defaultFolder={folder} onSelect={(a) => { onSelect(a); onOpenChange(false); }} />
    </DialogContent>
  </Dialog>
);

export default MediaLibrary;

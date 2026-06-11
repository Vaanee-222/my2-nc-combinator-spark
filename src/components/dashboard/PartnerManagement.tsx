import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Building2, Upload, Loader2 } from "lucide-react";

interface Region {
  id: string;
  name: string;
  flag: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

interface Partner {
  id: string;
  region_id: string;
  name: string;
  note: string | null;
  website_url: string | null;
  logo_url: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  founded_year: number | null;
  headquarters: string | null;
  partnership_tier: string | null;
  benefits: string[] | null;
  case_study_url: string | null;
}

const emptyRegion: Partial<Region> = { name: "", flag: "", description: "", is_active: true };
const emptyPartner: Partial<Partner> = {
  name: "", note: "", website_url: "", logo_url: "", description: "", is_active: true,
  founded_year: null, headquarters: "", partnership_tier: "", benefits: [], case_study_url: "",
};

const PartnerManagement = () => {
  const { toast } = useToast();
  const [regions, setRegions] = useState<Region[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const [regionDialog, setRegionDialog] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Partial<Region>>(emptyRegion);

  const [partnerDialog, setPartnerDialog] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner>>(emptyPartner);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Only image files allowed", variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image must be under 2MB", variant: "destructive" });
      return;
    }
    setUploadingLogo(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("partner-logos").upload(path, file, { upsert: false });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("partner-logos").getPublicUrl(path);
      setEditingPartner((prev) => ({ ...prev, logo_url: data.publicUrl }));
      toast({ title: "Logo uploaded" });
    }
    setUploadingLogo(false);
  };

  const load = async () => {
    setLoading(true);
    const [rRes, pRes] = await Promise.all([
      (supabase as any).from("partner_regions").select("*").order("sort_order"),
      (supabase as any).from("partners").select("*").order("sort_order"),
    ]);
    setRegions(rRes.data ?? []);
    setPartners(pRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // --- Region operations ---
  const saveRegion = async () => {
    if (!editingRegion.name) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    const payload = {
      name: editingRegion.name,
      flag: editingRegion.flag || null,
      description: editingRegion.description || null,
      is_active: editingRegion.is_active ?? true,
    };
    let error;
    if (editingRegion.id) {
      ({ error } = await (supabase as any).from("partner_regions").update(payload).eq("id", editingRegion.id));
    } else {
      const nextOrder = (regions[regions.length - 1]?.sort_order ?? 0) + 1;
      ({ error } = await (supabase as any).from("partner_regions").insert({ ...payload, sort_order: nextOrder }));
    }
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingRegion.id ? "Region updated" : "Region created" });
      setRegionDialog(false);
      setEditingRegion(emptyRegion);
      load();
    }
  };

  const deleteRegion = async (id: string) => {
    if (!confirm("Delete this region and all its partners?")) return;
    const { error } = await (supabase as any).from("partner_regions").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Region deleted" }); load(); }
  };

  const moveRegion = async (region: Region, direction: -1 | 1) => {
    const sorted = [...regions].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((r) => r.id === region.id);
    const swap = sorted[idx + direction];
    if (!swap) return;
    await (supabase as any).from("partner_regions").update({ sort_order: swap.sort_order }).eq("id", region.id);
    await (supabase as any).from("partner_regions").update({ sort_order: region.sort_order }).eq("id", swap.id);
    load();
  };

  // --- Partner operations ---
  const savePartner = async () => {
    if (!editingPartner.name || !editingPartner.region_id) {
      toast({ title: "Name and region required", variant: "destructive" });
      return;
    }
    const payload = {
      region_id: editingPartner.region_id,
      name: editingPartner.name,
      note: editingPartner.note || null,
      website_url: editingPartner.website_url || null,
      logo_url: editingPartner.logo_url || null,
      description: editingPartner.description || null,
      is_active: editingPartner.is_active ?? true,
      founded_year: editingPartner.founded_year ?? null,
      headquarters: editingPartner.headquarters || null,
      partnership_tier: editingPartner.partnership_tier || null,
      benefits: Array.isArray(editingPartner.benefits)
        ? editingPartner.benefits
        : (typeof editingPartner.benefits === "string"
            ? (editingPartner.benefits as any).split(",").map((s: string) => s.trim()).filter(Boolean)
            : null),
      case_study_url: editingPartner.case_study_url || null,
    };
    let error;
    if (editingPartner.id) {
      ({ error } = await (supabase as any).from("partners").update(payload).eq("id", editingPartner.id));
    } else {
      const regionPartners = partners.filter((p) => p.region_id === editingPartner.region_id);
      const nextOrder = (regionPartners[regionPartners.length - 1]?.sort_order ?? 0) + 1;
      ({ error } = await (supabase as any).from("partners").insert({ ...payload, sort_order: nextOrder }));
    }
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: editingPartner.id ? "Partner updated" : "Partner created" });
      setPartnerDialog(false);
      setEditingPartner(emptyPartner);
      load();
    }
  };

  const deletePartner = async (id: string) => {
    if (!confirm("Delete this partner?")) return;
    const { error } = await (supabase as any).from("partners").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Partner deleted" }); load(); }
  };

  const movePartner = async (partner: Partner, direction: -1 | 1) => {
    const siblings = partners
      .filter((p) => p.region_id === partner.region_id)
      .sort((a, b) => a.sort_order - b.sort_order);
    const idx = siblings.findIndex((p) => p.id === partner.id);
    const swap = siblings[idx + direction];
    if (!swap) return;
    await (supabase as any).from("partners").update({ sort_order: swap.sort_order }).eq("id", partner.id);
    await (supabase as any).from("partners").update({ sort_order: partner.sort_order }).eq("id", swap.id);
    load();
  };

  const openNewRegion = () => { setEditingRegion(emptyRegion); setRegionDialog(true); };
  const openEditRegion = (r: Region) => { setEditingRegion(r); setRegionDialog(true); };
  const openNewPartner = (regionId?: string) => {
    setEditingPartner({ ...emptyPartner, region_id: regionId ?? regions[0]?.id });
    setPartnerDialog(true);
  };
  const openEditPartner = (p: Partner) => { setEditingPartner(p); setPartnerDialog(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Partners Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage regions and partner entries shown on the public /partners page.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openNewRegion}>
            <Plus className="h-4 w-4 mr-1" /> Add Region
          </Button>
          <Button onClick={() => openNewPartner()} disabled={regions.length === 0}>
            <Plus className="h-4 w-4 mr-1" /> Add Partner
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : regions.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">
          No regions yet. Create one to start adding partners.
        </CardContent></Card>
      ) : (
        regions.sort((a, b) => a.sort_order - b.sort_order).map((region, idx) => {
          const regionPartners = partners
            .filter((p) => p.region_id === region.id)
            .sort((a, b) => a.sort_order - b.sort_order);
          return (
            <Card key={region.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">{region.flag}</span>
                    {region.name}
                    {!region.is_active && (
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">inactive</span>
                    )}
                  </CardTitle>
                  {region.description && (
                    <p className="text-sm text-muted-foreground mt-1">{region.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => moveRegion(region, -1)} disabled={idx === 0}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => moveRegion(region, 1)} disabled={idx === regions.length - 1}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => openEditRegion(region)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteRegion(region.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {regionPartners.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No partners in this region yet.</p>
                ) : (
                  regionPartners.map((p, pIdx) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{p.name}</span>
                            {!p.is_active && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">inactive</span>
                            )}
                          </div>
                          {p.note && <p className="text-xs text-muted-foreground truncate">{p.note}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => movePartner(p, -1)} disabled={pIdx === 0}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => movePartner(p, 1)} disabled={pIdx === regionPartners.length - 1}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openEditPartner(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deletePartner(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="outline" size="sm" className="mt-2" onClick={() => openNewPartner(region.id)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add partner to {region.name}
                </Button>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Region dialog */}
      <Dialog open={regionDialog} onOpenChange={setRegionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRegion.id ? "Edit Region" : "New Region"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={editingRegion.name ?? ""} onChange={(e) => setEditingRegion({ ...editingRegion, name: e.target.value })} placeholder="e.g. India" />
            </div>
            <div>
              <Label>Flag / Emoji</Label>
              <Input value={editingRegion.flag ?? ""} onChange={(e) => setEditingRegion({ ...editingRegion, flag: e.target.value })} placeholder="" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={editingRegion.description ?? ""} onChange={(e) => setEditingRegion({ ...editingRegion, description: e.target.value })} rows={2} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={editingRegion.is_active ?? true} onCheckedChange={(v) => setEditingRegion({ ...editingRegion, is_active: v })} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegionDialog(false)}>Cancel</Button>
            <Button onClick={saveRegion}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Partner dialog */}
      <Dialog open={partnerDialog} onOpenChange={setPartnerDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPartner.id ? "Edit Partner" : "New Partner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Region *</Label>
              <Select value={editingPartner.region_id} onValueChange={(v) => setEditingPartner({ ...editingPartner, region_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                <SelectContent>
                  {regions.map((r) => <SelectItem key={r.id} value={r.id}>{r.flag} {r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Name *</Label>
              <Input value={editingPartner.name ?? ""} onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })} />
            </div>
            <div>
              <Label>Short note</Label>
              <Input value={editingPartner.note ?? ""} onChange={(e) => setEditingPartner({ ...editingPartner, note: e.target.value })} placeholder="Strategy & advisory" />
            </div>
            <div>
              <Label>Website URL</Label>
              <Input value={editingPartner.website_url ?? ""} onChange={(e) => setEditingPartner({ ...editingPartner, website_url: e.target.value })} placeholder="https://" />
            </div>
            <div>
              <Label>Logo</Label>
              <div className="flex items-start gap-3 mt-1">
                <div className="w-16 h-16 rounded-lg border bg-muted/30 flex items-center justify-center overflow-hidden shrink-0">
                  {editingPartner.logo_url ? (
                    <img src={editingPartner.logo_url} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" disabled={uploadingLogo} asChild>
                      <label className="cursor-pointer">
                        {uploadingLogo ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-1" />}
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                        />
                      </label>
                    </Button>
                    {editingPartner.logo_url && (
                      <Button type="button" size="sm" variant="ghost" onClick={() => setEditingPartner({ ...editingPartner, logo_url: "" })}>
                        Remove
                      </Button>
                    )}
                  </div>
                  <Input
                    value={editingPartner.logo_url ?? ""}
                    onChange={(e) => setEditingPartner({ ...editingPartner, logo_url: e.target.value })}
                    placeholder="…or paste image URL"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={editingPartner.description ?? ""} onChange={(e) => setEditingPartner({ ...editingPartner, description: e.target.value })} rows={3} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={editingPartner.is_active ?? true} onCheckedChange={(v) => setEditingPartner({ ...editingPartner, is_active: v })} />
              <Label>Active</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Partnership tier</Label>
                <Select value={editingPartner.partnership_tier ?? ""} onValueChange={(v) => setEditingPartner({ ...editingPartner, partnership_tier: v })}>
                  <SelectTrigger><SelectValue placeholder="Select tier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strategic">Strategic</SelectItem>
                    <SelectItem value="Platform">Platform</SelectItem>
                    <SelectItem value="Ecosystem">Ecosystem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Headquarters</Label>
                <Input value={editingPartner.headquarters ?? ""} onChange={(e) => setEditingPartner({ ...editingPartner, headquarters: e.target.value })} placeholder="San Francisco, CA" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Founded year</Label>
                <Input type="number" value={editingPartner.founded_year ?? ""} onChange={(e) => setEditingPartner({ ...editingPartner, founded_year: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div>
                <Label>Case study URL</Label>
                <Input value={editingPartner.case_study_url ?? ""} onChange={(e) => setEditingPartner({ ...editingPartner, case_study_url: e.target.value })} placeholder="https://" />
              </div>
            </div>
            <div>
              <Label>Benefits (comma-separated)</Label>
              <Input
                value={Array.isArray(editingPartner.benefits) ? editingPartner.benefits.join(", ") : (editingPartner.benefits ?? "")}
                onChange={(e) => setEditingPartner({ ...editingPartner, benefits: e.target.value as any })}
                placeholder="Cloud credits, Mentorship, Co-marketing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPartnerDialog(false)}>Cancel</Button>
            <Button onClick={savePartner}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerManagement;

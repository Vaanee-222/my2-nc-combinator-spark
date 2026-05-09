import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Save, Code, ShieldCheck, AlertTriangle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sanitizeHeadScripts, STORAGE_KEY } from "@/lib/sanitizeHeadScripts";

const buildGA = (id: string) => {
  const trimmed = id.trim();
  if (!trimmed) return "";
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${trimmed}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${trimmed}');
</script>`;
};

const buildGTM = (id: string) => {
  const trimmed = id.trim();
  if (!trimmed) return "";
  return `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${trimmed}');</script>`;
};

const buildFB = (id: string) => {
  const trimmed = id.trim();
  if (!trimmed) return "";
  return `<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${trimmed}');
fbq('track', 'PageView');
</script>`;
};

const HeaderScripts = () => {
  const { toast } = useToast();
  const [raw, setRaw] = useState("");
  const [ga4, setGa4] = useState("");
  const [gtm, setGtm] = useState("");
  const [fb, setFb] = useState("");

  useEffect(() => {
    try {
      setRaw(localStorage.getItem(STORAGE_KEY) || "");
      setGa4(localStorage.getItem("HEAD_GA4_ID") || "");
      setGtm(localStorage.getItem("HEAD_GTM_ID") || "");
      setFb(localStorage.getItem("HEAD_FB_PIXEL_ID") || "");
    } catch {/* ignore */}
  }, []);

  const preview = useMemo(() => sanitizeHeadScripts(raw), [raw]);

  const persist = (html: string) => {
    localStorage.setItem(STORAGE_KEY, html);
    window.dispatchEvent(new Event("custom-head-scripts-updated"));
  };

  const handleSaveRaw = () => {
    const { sanitizedHtml, warnings } = sanitizeHeadScripts(raw);
    persist(sanitizedHtml);
    setRaw(sanitizedHtml);
    toast({
      title: "Header scripts saved",
      description: warnings.length
        ? `Sanitized — ${warnings.length} item(s) removed.`
        : "Injected into page <head>.",
    });
  };

  const handleSaveHelpers = () => {
    localStorage.setItem("HEAD_GA4_ID", ga4.trim());
    localStorage.setItem("HEAD_GTM_ID", gtm.trim());
    localStorage.setItem("HEAD_FB_PIXEL_ID", fb.trim());

    const merged = [buildGTM(gtm), buildGA(ga4), buildFB(fb)].filter(Boolean).join("\n");
    const { sanitizedHtml } = sanitizeHeadScripts(merged);
    persist(sanitizedHtml);
    setRaw(sanitizedHtml);
    toast({ title: "Tracking IDs saved", description: "Tags generated and injected." });
  };

  const handleClear = () => {
    persist("");
    setRaw("");
    toast({ title: "Cleared", description: "All custom head scripts removed." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Header Scripts</h2>
        <p className="text-muted-foreground">
          Inject Google Analytics, Facebook Pixel, GTM, or custom tags into the page &lt;head&gt;.
          All input is sanitized — only safe tags and attributes are allowed.
        </p>
      </div>

      <Tabs defaultValue="presets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="presets">Tracking IDs</TabsTrigger>
          <TabsTrigger value="custom">Custom HTML</TabsTrigger>
        </TabsList>

        <TabsContent value="presets">
          <Card>
            <CardHeader>
              <CardTitle>Quick setup</CardTitle>
              <CardDescription>Enter your tracking IDs — we generate the snippets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Google Analytics 4 Measurement ID</Label>
                <Input value={ga4} onChange={(e) => setGa4(e.target.value)} placeholder="G-XXXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label>Google Tag Manager ID</Label>
                <Input value={gtm} onChange={(e) => setGtm(e.target.value)} placeholder="GTM-XXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label>Facebook Pixel ID</Label>
                <Input value={fb} onChange={(e) => setFb(e.target.value)} placeholder="123456789012345" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveHelpers}><Save className="h-4 w-4 mr-1" /> Save & Inject</Button>
                <Button variant="outline" onClick={handleClear}><Trash2 className="h-4 w-4 mr-1" /> Clear all</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5" /> Custom &lt;head&gt; HTML</CardTitle>
              <CardDescription>
                Paste raw tags. Allowed: &lt;script&gt;, &lt;noscript&gt;, &lt;meta&gt;, &lt;link&gt;, &lt;style&gt;.
                Inline event handlers (onclick, onload, …), javascript:/data: URLs, and unknown tags are stripped.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                rows={12}
                className="font-mono text-xs"
                placeholder={`<!-- Example -->\n<meta name="google-site-verification" content="..." />\n<script async src="https://example.com/analytics.js"></script>`}
              />

              {preview.warnings.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Sanitizer will remove {preview.warnings.length} item(s)</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-xs">
                      {preview.warnings.slice(0, 8).map((w, i) => <li key={i}>{w}</li>)}
                      {preview.warnings.length > 8 && <li>…and {preview.warnings.length - 8} more</li>}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {preview.sanitizedHtml && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Sanitized preview (this is what gets injected)
                  </Label>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-48 whitespace-pre-wrap break-all">
                    {preview.sanitizedHtml}
                  </pre>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSaveRaw}><Save className="h-4 w-4 mr-1" /> Save & Inject</Button>
                <Button variant="outline" onClick={handleClear}><Trash2 className="h-4 w-4 mr-1" /> Clear</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeaderScripts;

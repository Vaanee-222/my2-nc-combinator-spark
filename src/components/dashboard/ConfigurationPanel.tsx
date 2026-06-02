import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key, Bot, Mail, MessageSquare, CreditCard, Globe, Shield, Eye, EyeOff, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ConfigurationPanel = () => {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (section: string) => {
    toast({ title: "Configuration Saved", description: `${section} settings have been saved.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuration</h2>
        <p className="text-muted-foreground">Manage API keys, authentication, and platform settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="ai">AI Models</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Globe className="h-5 w-5" /><span>General Settings</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input defaultValue="Xi Combinator" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@xicombinator.com" />
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="ist">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">IST (Asia/Kolkata)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="pst">PST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <Label>Maintenance Mode</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Open Registration</Label>
                <Switch defaultChecked />
              </div>
              <Button onClick={() => handleSave("General")} className="w-full"><Save className="h-4 w-4 mr-1" /> Save General Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auth */}
        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Shield className="h-5 w-5" /><span>Authentication Settings</span></CardTitle>
              <CardDescription>Configure authentication providers and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Email / Password</p>
                    <p className="text-sm text-muted-foreground">Standard email and password authentication</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Google OAuth</p>
                    <p className="text-sm text-muted-foreground">Sign in with Google accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Magic Link</p>
                    <p className="text-sm text-muted-foreground">Passwordless email login</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Phone (OTP)</p>
                    <p className="text-sm text-muted-foreground">SMS-based one-time password</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold">Password Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Password Length</Label>
                    <Input type="number" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout (hours)</Label>
                    <Input type="number" defaultValue="24" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Email Verification</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Breached Password Check (HIBP)</Label>
                  <Switch />
                </div>
              </div>
              <Button onClick={() => handleSave("Authentication")} className="w-full"><Save className="h-4 w-4 mr-1" /> Save Auth Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Models */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Bot className="h-5 w-5" /><span>AI Model Configuration</span></CardTitle>
              <CardDescription>Configure AI models used by Startup Advisor agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { agent: "Mock VC / Angel", model: "google/gemini-2.5-flash", desc: "Pitch evaluation and funding advice" },
                  { agent: "Startup Lawyer", model: "openai/gpt-5-mini", desc: "Legal structure and compliance guidance" },
                  { agent: "GTM Adviser", model: "google/gemini-2.5-flash", desc: "Go-to-market strategy planning" },
                  { agent: "Startup Buddy", model: "openai/gpt-5-mini", desc: "General startup support and mentoring" },
                  { agent: "Health Scorer", model: "google/gemini-2.5-flash", desc: "Startup readiness scoring" },
                ].map((a, i) => (
                  <div key={i} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{a.agent}</p>
                        <p className="text-sm text-muted-foreground">{a.desc}</p>
                      </div>
                      <Badge variant="outline">{a.model}</Badge>
                    </div>
                    <Select defaultValue={a.model}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                        <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                        <SelectItem value="openai/gpt-5">GPT-5</SelectItem>
                        <SelectItem value="openai/gpt-5-mini">GPT-5 Mini</SelectItem>
                        <SelectItem value="openai/gpt-5-nano">GPT-5 Nano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <Button onClick={() => handleSave("AI Model")} className="w-full"><Save className="h-4 w-4 mr-1" /> Save AI Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Mail className="h-5 w-5" /><span>Email Configuration</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sender Name</Label>
                  <Input defaultValue="Xi Combinator" />
                </div>
                <div className="space-y-2">
                  <Label>Sender Email</Label>
                  <Input defaultValue="noreply@xicombinator.com" />
                </div>
                <div className="space-y-2">
                  <Label>Reply-To Email</Label>
                  <Input defaultValue="support@xicombinator.com" />
                </div>
                <div className="space-y-2">
                  <Label>Email Provider</Label>
                  <Select defaultValue="lovable">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lovable">Lovable Cloud (Built-in)</SelectItem>
                      <SelectItem value="custom">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Email Sending Enabled</Label>
                <Switch defaultChecked />
              </div>
              <Button onClick={() => handleSave("Email")} className="w-full"><Save className="h-4 w-4 mr-1" /> Save Email Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><MessageSquare className="h-5 w-5" /><span>SMS Configuration</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SMS Provider</Label>
                  <Select defaultValue="none">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not Configured</SelectItem>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="msg91">MSG91</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sender ID</Label>
                  <Input placeholder="ICMBNR" />
                </div>
              </div>
              <ApiKeyField label="SMS API Key" keyName="sms_api" showKeys={showKeys} toggleKeyVisibility={toggleKeyVisibility} />
              <div className="flex items-center justify-between">
                <Label>OTP via SMS Enabled</Label>
                <Switch />
              </div>
              <Button onClick={() => handleSave("SMS")} className="w-full"><Save className="h-4 w-4 mr-1" /> Save SMS Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><CreditCard className="h-5 w-5" /><span>Payment Configuration</span></CardTitle>
              <CardDescription>Configure payment gateway for subscriptions and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Provider</Label>
                <Select defaultValue="mock">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mock">Mock (Demo Mode)</SelectItem>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ApiKeyField label="Publishable Key" keyName="pay_pub" showKeys={showKeys} toggleKeyVisibility={toggleKeyVisibility} />
              <ApiKeyField label="Secret Key" keyName="pay_sec" showKeys={showKeys} toggleKeyVisibility={toggleKeyVisibility} />
              <div className="flex items-center justify-between">
                <Label>Test Mode</Label>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="inr">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">INR (₹)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input readOnly defaultValue="https://api.xicombinator.com/webhooks/payment" />
                </div>
              </div>
              <Button onClick={() => handleSave("Payment")} className="w-full"><Save className="h-4 w-4 mr-1" /> Save Payment Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Key className="h-5 w-5" /><span>API Keys Management</span></CardTitle>
              <CardDescription>Manage third-party API keys and secrets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Lovable API Key", key: "lovable_api", hint: "Auto-managed by Lovable Cloud" },
                { label: "Google OAuth Client ID", key: "google_oauth", hint: "For Google Sign-In" },
                { label: "Analytics Tracking ID", key: "analytics_id", hint: "Google Analytics or similar" },
              ].map((item, i) => (
                <ApiKeyField key={i} label={item.label} keyName={item.key} hint={item.hint} showKeys={showKeys} toggleKeyVisibility={toggleKeyVisibility} />
              ))}
              <Button onClick={() => handleSave("API Keys")} className="w-full"><Save className="h-4 w-4 mr-1" /> Save API Keys</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ApiKeyField = ({ label, keyName, hint, showKeys, toggleKeyVisibility }: {
  label: string; keyName: string; hint?: string;
  showKeys: Record<string, boolean>; toggleKeyVisibility: (k: string) => void;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    <div className="flex space-x-2">
      <Input type={showKeys[keyName] ? "text" : "password"} placeholder="••••••••••••••••" className="flex-1" />
      <Button variant="ghost" size="icon" onClick={() => toggleKeyVisibility(keyName)}>
        {showKeys[keyName] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  </div>
);

export default ConfigurationPanel;

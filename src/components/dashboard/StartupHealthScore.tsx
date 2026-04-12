import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Loader2, TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HealthScoreResult {
  overallScore: number;
  category: string;
  dimensions: { name: string; score: number; feedback: string }[];
  recommendations: string[];
}

interface StartupHealthScoreProps {
  incubationApps: any[];
}

const StartupHealthScore = ({ incubationApps }: StartupHealthScoreProps) => {
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [result, setResult] = useState<HealthScoreResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeStartup = async (app: any) => {
    setSelectedApp(app);
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("startup-health-score", {
        body: {
          startup_name: app.startup_name || "Unnamed",
          founder_name: app.founder_name,
          industry: app.industry || "Not specified",
          stage: app.stage || "Not specified",
          description: app.description || "No description",
          team_size: app.team_size || "Not specified",
          funding_status: app.funding_status || "Not specified",
        },
      });

      if (error) throw error;
      setResult(data);
    } catch (err: any) {
      toast({ title: "Analysis Failed", description: err.message || "Could not analyze startup", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getCategoryBadge = (cat: string) => {
    const map: Record<string, any> = {
      "Launch Ready": { variant: "default", icon: CheckCircle },
      "Promising": { variant: "secondary", icon: TrendingUp },
      "Needs Work": { variant: "outline", icon: AlertTriangle },
      "Early Stage": { variant: "destructive", icon: XCircle },
    };
    return map[cat] || map["Early Stage"];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Startup Health Scoring</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Startup Selector */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Select Startup to Analyze</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
            {incubationApps.length === 0 && <p className="text-muted-foreground text-sm">No incubation applications found</p>}
            {incubationApps.map((app) => (
              <button
                key={app.id}
                onClick={() => analyzeStartup(app)}
                className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-muted/50 ${selectedApp?.id === app.id ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{app.startup_name || "Unnamed Startup"}</p>
                    <p className="text-xs text-muted-foreground">{app.founder_name} · {app.industry || "N/A"}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{app.stage || "N/A"}</Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Score Result */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Health Score</CardTitle></CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Analyzing with AI...</p>
              </div>
            )}

            {!loading && !result && (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Select a startup to get an AI-powered readiness score</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}</div>
                  <p className="text-sm text-muted-foreground mt-1">out of 100</p>
                  {(() => {
                    const badge = getCategoryBadge(result.category);
                    const Icon = badge.icon;
                    return (
                      <Badge variant={badge.variant} className="mt-2">
                        <Icon className="h-3 w-3 mr-1" />
                        {result.category}
                      </Badge>
                    );
                  })()}
                </div>

                {/* Dimensions */}
                <div className="space-y-3">
                  {result.dimensions.map((dim) => (
                    <div key={dim.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{dim.name}</span>
                        <span className={getScoreColor(dim.score)}>{dim.score}/100</span>
                      </div>
                      <Progress value={dim.score} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{dim.feedback}</p>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StartupHealthScore;

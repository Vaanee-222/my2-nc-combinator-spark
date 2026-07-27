import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Sparkles } from "lucide-react";

interface Props {
  programType: string;
  title?: string;
}

/**
 * Renders programs/events posted by admin from the `programs` table
 * for the given program_type. Hidden entirely when no rows exist so
 * public pages stay clean until an admin posts something.
 */
const AdminPostedEvents = ({ programType, title }: Props) => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("programs")
        .select("*")
        .eq("program_type", programType)
        .order("created_at", { ascending: false });
      setRows(data ?? []);
      setLoading(false);
    })();
  }, [programType]);

  if (loading || rows.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-3xl font-bold">{title ?? "Latest Announcements"}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rows.map((p) => (
          <Card key={p.id} className="border-primary/20 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <Badge variant={p.status === "Active" ? "default" : "secondary"}>{p.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {p.start_date && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> {p.start_date}
                  {p.duration ? ` • ${p.duration}` : ""}
                </div>
              )}
              {p.capacity ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" /> {p.capacity} seats
                </div>
              ) : null}
              {p.budget && <div className="text-muted-foreground"><strong>Rewards:</strong> {p.budget}</div>}
              {p.description && <p className="text-muted-foreground line-clamp-4">{p.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AdminPostedEvents;

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Check, Clock, Mail, X } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { usePerks } from "@/hooks/usePerks";

export const introductionSchema = z.object({
  requester_name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  contact_email: z
    .string()
    .trim()
    .email({ message: "Enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  startup_name: z
    .string()
    .trim()
    .max(120, { message: "Startup name must be less than 120 characters" })
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, { message: "Tell the investor a bit more — at least 20 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});

type FormValues = z.infer<typeof introductionSchema>;
type Status = "none" | "pending" | "approved" | "rejected";

const STATUS_META: Record<Exclude<Status, "none">, { label: string; className: string; icon: typeof Clock }> = {
  pending: {
    label: "Request Pending",
    className: "bg-amber-500/15 text-amber-500 border border-amber-500/40 hover:bg-amber-500/20",
    icon: Clock,
  },
  approved: {
    label: "Introduction Approved",
    className: "bg-emerald-600/15 text-emerald-500 border border-emerald-600/40 hover:bg-emerald-600/20",
    icon: Check,
  },
  rejected: {
    label: "Request Declined",
    className: "bg-destructive/15 text-destructive border border-destructive/40 hover:bg-destructive/20",
    icon: X,
  },
};

interface Props extends Omit<ButtonProps, "onClick" | "children"> {
  investorId: string | number;
  investorName: string;
  idleLabel?: React.ReactNode;
  redirectPath?: string;
}

const IntroductionRequestButton = ({
  investorId,
  investorName,
  idleLabel = "Request Introduction",
  redirectPath,
  className,
  ...rest
}: Props) => {
  const { user, userRole } = useAuth();
  const { intro, level } = usePerks();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("none");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [values, setValues] = useState<FormValues>({
    requester_name: "",
    contact_email: "",
    startup_name: "",
    message: "",
  });

  const loadStatus = useCallback(async () => {
    if (!user) {
      setStatus("none");
      return;
    }
    const { data } = await supabase
      .from("introduction_requests")
      .select("status")
      .eq("requester_id", user.id)
      .eq("investor_id", String(investorId))
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setStatus(((data?.status as Status) ?? "none") as Status);
  }, [user, investorId]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    if (user) {
      setValues((v) => ({
        ...v,
        requester_name: v.requester_name || (user.user_metadata?.full_name ?? ""),
        contact_email: v.contact_email || (user.email ?? ""),
      }));
    }
  }, [user]);

  const openDialog = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in as a founder to request investor introductions.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: redirectPath ?? window.location.pathname } });
      return;
    }
    if (userRole && !["startup", "cofounder", "admin"].includes(userRole)) {
      toast({
        title: "Founders only",
        description: "Only startup/founder accounts can request investor introductions.",
        variant: "destructive",
      });
      return;
    }
    setErrors({});
    setOpen(true);
  };

  const validateField = (field: keyof FormValues, value: string) => {
    const result = introductionSchema.shape[field].safeParse(value);
    setErrors((e) => ({ ...e, [field]: result.success ? undefined : result.error.issues[0].message }));
  };

  const submit = async () => {
    const parsed = introductionSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0] as keyof FormValues;
        if (!fieldErrors[key]) fieldErrors[key] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("introduction_requests").insert({
      requester_id: user.id,
      investor_id: String(investorId),
      investor_name: investorName,
      requester_name: parsed.data.requester_name,
      contact_email: parsed.data.contact_email,
      startup_name: parsed.data.startup_name || null,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not send request", description: error.message, variant: "destructive" });
      return;
    }
    setOpen(false);
    setStatus("pending");
    toast({
      title: "Introduction request submitted",
      description: `Our team will review your request for ${investorName}.`,
    });
    loadStatus();
  };

  const meta = status !== "none" ? STATUS_META[status] : null;
  const Icon = meta?.icon;
  const canReapply = status === "none" || status === "rejected";

  return (
    <>
      <Button
        {...rest}
        variant={meta ? "secondary" : rest.variant}
        className={cn(meta?.className, className)}
        onClick={canReapply ? openDialog : undefined}
        disabled={rest.disabled || !canReapply}
        aria-live="polite"
      >
        {meta && Icon ? (
          <span className="inline-flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" />
            {status === "rejected" ? "Request Declined — Try Again" : meta.label}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {idleLabel}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request introduction to {investorName}</DialogTitle>
            <DialogDescription>
              Our team reviews every request. You will see the status (pending, approved, or declined) here.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
            {intro.quota === 0 ? (
              <>You are Level {level}. Reach Level 3 to unlock a fast-tracked free introduction each month.</>
            ) : intro.remaining === 0 ? (
              <>You have used all {intro.quota === Infinity ? "your" : intro.quota} fast-tracked intros this month — this request joins the standard review queue.</>
            ) : (
              <>Fast-tracked introductions left this month: <span className="font-medium text-primary">{intro.quota === Infinity ? "Unlimited" : intro.remaining}</span></>
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="intro-name">Your name *</Label>
              <Input
                id="intro-name"
                value={values.requester_name}
                maxLength={100}
                aria-invalid={!!errors.requester_name}
                onChange={(e) => setValues({ ...values, requester_name: e.target.value })}
                onBlur={(e) => validateField("requester_name", e.target.value)}
              />
              {errors.requester_name && <p className="text-xs text-destructive">{errors.requester_name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="intro-email">Contact email *</Label>
              <Input
                id="intro-email"
                type="email"
                value={values.contact_email}
                maxLength={255}
                aria-invalid={!!errors.contact_email}
                onChange={(e) => setValues({ ...values, contact_email: e.target.value })}
                onBlur={(e) => validateField("contact_email", e.target.value)}
              />
              {errors.contact_email && <p className="text-xs text-destructive">{errors.contact_email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="intro-startup">Startup name</Label>
              <Input
                id="intro-startup"
                value={values.startup_name}
                maxLength={120}
                onChange={(e) => setValues({ ...values, startup_name: e.target.value })}
                onBlur={(e) => validateField("startup_name", e.target.value)}
              />
              {errors.startup_name && <p className="text-xs text-destructive">{errors.startup_name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="intro-message">Why this introduction? *</Label>
              <Textarea
                id="intro-message"
                rows={4}
                value={values.message}
                maxLength={1000}
                aria-invalid={!!errors.message}
                onChange={(e) => setValues({ ...values, message: e.target.value })}
                onBlur={(e) => validateField("message", e.target.value)}
              />
              <div className="flex justify-between text-xs">
                <span className="text-destructive">{errors.message}</span>
                <span className="text-muted-foreground">{values.message.trim().length}/1000</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? "Submitting…" : "Send request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntroductionRequestButton;

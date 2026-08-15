import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
};

export const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction, children }: Props) => (
  <Card className="bg-card-gradient border-border border-dashed">
    <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      {Icon && (
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {children}
    </CardContent>
  </Card>
);

export const SkeletonCards = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} className="bg-card-gradient border-border">
        <CardContent className="space-y-3 p-6">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export default EmptyState;

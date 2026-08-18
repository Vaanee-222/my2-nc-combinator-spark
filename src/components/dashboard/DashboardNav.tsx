import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardShortcuts } from "@/hooks/useDashboardShortcuts";

export type DashboardNavItem = {
  value: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

export type DashboardNavGroup = {
  label: string;
  items: DashboardNavItem[];
};

type Props = {
  groups: DashboardNavGroup[];
  value: string;
  onChange: (value: string) => void;
};

const NavList = ({ groups, value, onChange }: Props) => {
  let index = 0;
  return (
  <nav className="space-y-6">
    {groups.map((group) => (
      <div key={group.label}>
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {group.label}
        </p>
        <div className="space-y-1">
          {group.items.map((item) => {
            const Icon = item.icon;
            const active = value === item.value;
            index += 1;
            const shortcut = index <= 9 ? index : undefined;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onChange(item.value)}
                aria-current={active ? "page" : undefined}
                title={shortcut ? `${item.label} (g then ${shortcut})` : item.label}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate text-left">{item.label}</span>
                {!!item.badge && item.badge > 0 && (
                  <Badge variant={active ? "default" : "secondary"} className="ml-auto h-5 min-w-5 justify-center px-1 text-[11px]">
                    {item.badge}
                  </Badge>
                )}
                {!item.badge && shortcut && (
                  <span className="ml-auto hidden text-[10px] text-muted-foreground/70 lg:inline">g{shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    ))}
  </nav>
  );
};

const DashboardNav = ({ groups, value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const items = groups.flatMap((g) => g.items);
  const current = items.find((i) => i.value === value);
  useDashboardShortcuts(items.map((i) => i.value), onChange);

  return (
    <>
      {/* Mobile */}
      <div className="mb-4 flex items-center gap-3 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="mr-2 h-4 w-4" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 overflow-y-auto">
            <div className="pt-6">
              <NavList
                groups={groups}
                value={value}
                onChange={(v) => {
                  onChange(v);
                  setOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
        <span className="text-sm font-medium">{current?.label}</span>
      </div>

      {/* Desktop */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24 rounded-xl border border-border bg-card-gradient p-3">
          <NavList groups={groups} value={value} onChange={onChange} />
        </div>
      </aside>
    </>
  );
};

export default DashboardNav;

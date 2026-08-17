import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export type ToolbarOption = { value: string; label: string };

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filter?: { value: string; onChange: (value: string) => void; options: ToolbarOption[]; label?: string };
  sort?: { value: string; onChange: (value: string) => void; options: ToolbarOption[]; label?: string };
  children?: ReactNode;
};

/** One consistent search + filter + sort row used across every dashboard list. */
const ListToolbar = ({ search, onSearchChange, placeholder = "Search…", filter, sort, children }: Props) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div className="relative min-w-0 flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label={placeholder}
      />
    </div>
    {filter && (
      <Select value={filter.value} onValueChange={filter.onChange}>
        <SelectTrigger className="w-full sm:w-44" aria-label={filter.label ?? "Filter"}>
          <SelectValue placeholder={filter.label ?? "Filter"} />
        </SelectTrigger>
        <SelectContent>
          {filter.options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
    {sort && (
      <Select value={sort.value} onValueChange={sort.onChange}>
        <SelectTrigger className="w-full sm:w-44" aria-label={sort.label ?? "Sort"}>
          <SelectValue placeholder={sort.label ?? "Sort"} />
        </SelectTrigger>
        <SelectContent>
          {sort.options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
    {children}
  </div>
);

export default ListToolbar;

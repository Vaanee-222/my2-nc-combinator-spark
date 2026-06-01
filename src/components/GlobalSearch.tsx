import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchEntries, searchIndex, SearchEntry } from "@/lib/searchIndex";
import { trackEvent } from "@/lib/analytics";

interface Props {
  variant?: "icon" | "full";
}

const GlobalSearch = ({ variant = "icon" }: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(
    () => (query ? searchEntries(query) : searchIndex.slice(0, 12)),
    [query]
  );

  const grouped = useMemo(() => {
    const map: Record<string, SearchEntry[]> = {};
    results.forEach((r) => {
      map[r.category] = map[r.category] || [];
      map[r.category].push(r);
    });
    return map;
  }, [results]);

  const onSelect = (entry: SearchEntry) => {
    trackEvent("search_result_clicked", { query, result_path: entry.path, result_title: entry.title });
    setOpen(false);
    setQuery("");
    navigate(entry.path);
  };

  useEffect(() => {
    if (!query) return;
    const t = setTimeout(() => {
      trackEvent("search_performed", { query, results_count: results.length });
    }, 600);
    return () => clearTimeout(t);
  }, [query, results.length]);

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setOpen(true)}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4 mr-2" />
          Search the portal…
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            ⌘K
          </kbd>
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search pages, programs, keywords…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(grouped).map(([cat, items]) => (
            <CommandGroup key={cat} heading={cat}>
              {items.map((item) => (
                <CommandItem
                  key={item.path}
                  value={`${item.title} ${item.keywords.join(" ")} ${item.path}`}
                  onSelect={() => onSelect(item)}
                  className="flex flex-col items-start gap-0.5 cursor-pointer"
                >
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {item.description}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;

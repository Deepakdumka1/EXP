"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, Sparkles, MapPin, User, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, type PhotoResponse } from "@/lib/api";
import Image from "next/image";

const defaultRecentSearches = ["sunset", "birthday", "family", "vacation"];

const suggestions = [
  { text: "Photos from last trip", type: "ai" as const, icon: Sparkles },
  { text: "Beach", type: "location" as const, icon: MapPin },
  { text: "Portrait", type: "person" as const, icon: User },
  { text: "Last December", type: "date" as const, icon: Calendar },
];

const typeBadgeColors = {
  ai: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  location: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  person: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  date: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
};

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(defaultRecentSearches);
  const [searchResults, setSearchResults] = useState<PhotoResponse[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery("");
      setSearchResults([]);
      setTotalResults(0);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const doSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }
    setIsSearching(true);
    api.search.query(trimmed, { limit: 8 }).then((res) => {
      setSearchResults(res.items);
      setTotalResults(res.total);
    }).catch(() => {
      setSearchResults([]);
      setTotalResults(0);
    }).finally(() => setIsSearching(false));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length > 0) {
      debounceRef.current = setTimeout(() => doSearch(query), 300);
    } else {
      setSearchResults([]);
      setTotalResults(0);
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  const performSearch = useCallback((searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setRecentSearches((prev) => [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, 6));
    doSearch(trimmed);
  }, [doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[640px] mx-4 animate-[scaleIn_200ms_ease-out]"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 h-12 px-4 bg-[var(--card)] border border-[var(--border)] rounded-full shadow-lg">
            <Search className="w-5 h-5 text-[var(--muted-foreground)] shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search photos, people, places..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
            />
            {isSearching && <Loader2 className="w-4 h-4 animate-spin text-[var(--muted-foreground)]" />}
            {query && !isSearching && (
              <button type="button" onClick={() => setQuery("")} className="cursor-pointer">
                <X className="w-4 h-4 text-[var(--muted-foreground)]" />
              </button>
            )}
            <kbd className="text-[10px] font-mono bg-[var(--muted)] px-1.5 py-0.5 rounded border border-[var(--border)]">
              ESC
            </kbd>
          </div>
        </form>

        <div className="mt-2 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg max-h-[400px] overflow-y-auto">
          {query.trim().length > 0 ? (
            <div className="p-3">
              {isSearching ? (
                <div className="text-center py-6">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--muted-foreground)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--muted-foreground)]">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                    {totalResults} result{totalResults !== 1 ? "s" : ""}
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {searchResults.map((photo) => (
                      <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group">
                        <Image
                          src={photo.thumbnail}
                          alt={photo.title}
                          fill
                          sizes="120px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                  {totalResults > 8 && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-2 text-center">
                      +{totalResults - 8} more results
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <Search className="w-8 h-8 text-[var(--muted-foreground)] mx-auto mb-2" />
                  <p className="text-sm font-medium">No results found</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Try different keywords or filters</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="p-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                  Recent Searches
                </p>
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => performSearch(s)}
                    className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-[var(--hover)] text-sm transition-colors cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
                    {s}
                  </button>
                ))}
              </div>

              <div className="border-t border-[var(--border)]" />

              <div className="p-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                  Try searching for
                </p>
                {suggestions.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => performSearch(s.text)}
                    className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-[var(--hover)] text-sm transition-colors cursor-pointer"
                  >
                    <s.icon className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span className="flex-1 text-left">{s.text}</span>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", typeBadgeColors[s.type])}>
                      {s.type}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

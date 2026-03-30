"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Search, X, Clock, TrendingUp, Camera, MapPin, Heart, Film, Utensils, Mountain, Building2, Flower2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { formatPhoto } from "@/utils/format";
import type { Photo } from "@/data/mock";

const recentSearches = ["goa sunset", "diwali photos", "cafe pics", "rishikesh"];

const categories = [
  { icon: Camera, label: "Selfies", color: "bg-blue-500/10 text-blue-600", query: "portrait" },
  { icon: MapPin, label: "Travel", color: "bg-teal-500/10 text-teal-600", query: "travel" },
  { icon: Heart, label: "Favorites", color: "bg-rose-500/10 text-rose-600", query: "favorite" },
  { icon: Film, label: "Videos", color: "bg-purple-500/10 text-purple-600", query: "video" },
  { icon: Utensils, label: "Food", color: "bg-orange-500/10 text-orange-600", query: "food" },
  { icon: Mountain, label: "Trips", color: "bg-emerald-500/10 text-emerald-600", query: "trip" },
  { icon: Building2, label: "City", color: "bg-slate-500/10 text-slate-600", query: "outing" },
  { icon: Flower2, label: "Festival", color: "bg-pink-500/10 text-pink-600", query: "festival" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setActiveSearch(searchQuery);
    setLoading(true);
    try {
      const res = await api.search.query(searchQuery, { limit: 100 });
      setFilteredPhotos(res.items.map(formatPhoto));
    } catch (err) {
      console.error(err);
      setFilteredPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Search" showViewToggle={false} showSort={false} />
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
            placeholder="Search photos, videos, places..."
            className="w-full h-12 pl-12 pr-10 rounded-full bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setActiveSearch(""); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--hover)] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4 text-[var(--muted-foreground)]" />
            </button>
          )}
        </div>

        {activeSearch ? (
          <>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              {loading ? "Searching..." : `${filteredPhotos.length} results for "${activeSearch}"`}
            </p>
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--muted-foreground)] mb-3" />
              </div>
            ) : filteredPhotos.length > 0 ? (
              <PhotoGrid photos={filteredPhotos} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <Search className="w-12 h-12 text-[var(--muted-foreground)]/25 mb-3" />
                <p className="text-sm text-[var(--muted-foreground)]">No results for &quot;{activeSearch}&quot;</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
                <h3 className="text-sm font-semibold">Recent searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="px-3 py-1.5 rounded-full bg-[var(--muted)] text-sm hover:bg-[var(--border)] transition-colors cursor-pointer"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[var(--muted-foreground)]" />
                <h3 className="text-sm font-semibold">Browse by category</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map(({ icon: Icon, label, color, query: q }) => (
                  <button
                    key={label}
                    onClick={() => handleSearch(q)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--hover)] transition-colors cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-[var(--accent)] transition-colors">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, Mic, ArrowRight, TrendingUp, X } from "lucide-react";
import { buyerProductService } from "@/services/buyer-product.service";
import type { ProductSearchSuggestion } from "@/types/product";
import Link from "next/link";
import { useClickAway } from "@/hooks/use-click-away";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";

interface SearchSuggestionsProps {
  value: string;
  onSelect: (term: string) => void;
  className?: string;
}

const STORAGE_KEY = "shopsure_search_history";

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  value,
  onSelect,
  className = "",
}) => {
  const [suggestions, setSuggestions] = useState<ProductSearchSuggestion[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { isListening, startListening, stopListening, isSupported } = useVoiceSearch({
    onResult: (text) => {
      handleSelectTerm(text);
    },
  });

  useClickAway(ref, () => setIsOpen(false));

  // Load search history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setHistory(raw ? JSON.parse(raw) : []);
    } catch {
      setHistory([]);
    }
  }, []);

  // Fetch Suggestions
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await buyerProductService.searchSuggestions(value);
        setSuggestions(res.items || []);
        setIsOpen(true);
      } catch (err) {
        console.error("Error fetching search suggestions", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [value]);

  const handleSelectTerm = (term: string) => {
    onSelect(term);
    saveSearchHistory(term);
    setIsOpen(false);
  };

  const saveSearchHistory = (term: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let list: string[] = raw ? JSON.parse(raw) : [];
      list = [term, ...list.filter((x) => x !== term)].slice(0, 5);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setHistory(list);
    } catch {}
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch {}
  };

  // Trending search mocks for initial state empty recommendations
  const trendingSearches = ["Sneakers", "Smartwatch", "Hoodies", "Wireless Earbuds"];

  const showSuggestions = isOpen && (suggestions.length > 0 || history.length > 0 || value === "");

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      {/* Microphone Overlay trigger */}
      {isSupported && (
        <button
          onClick={isListening ? stopListening : startListening}
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
          aria-label="Voice Search"
          title={isListening ? "Listening... Click to stop" : "Voice Search"}
        >
          <Mic className="w-4 h-4" />
        </button>
      )}

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden text-sm max-h-[400px] overflow-y-auto">
          {/* Active typed suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2 border-b border-border/40 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase px-2.5 block mb-1">
                Suggested Products
              </span>
              {suggestions.map((p) => {
                const coverImage = p.images?.find((img) => img.isCover)?.url ?? p.images?.[0]?.url;
                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    onClick={() => saveSearchHistory(p.title)}
                    className="flex items-center gap-3 hover:bg-secondary p-2.5 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 rounded bg-secondary overflow-hidden shrink-0">
                      {coverImage ? (
                        <img src={coverImage} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground">
                          Img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors text-xs">
                        {p.title}
                      </p>
                      {p.brand && (
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          {p.brand}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Search History */}
          {history.length > 0 && (
            <div className="p-2 border-b border-border/40 space-y-0.5">
              <div className="flex items-center justify-between px-2.5 mb-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Recent Searches
                </span>
                <button
                  onClick={clearHistory}
                  className="text-[10px] font-bold text-red-500 hover:underline"
                >
                  Clear All
                </button>
              </div>
              {history.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelectTerm(term)}
                  className="w-full text-left hover:bg-secondary p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium text-foreground"
                >
                  <Search className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          <div className="p-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase px-1.5 block mb-2">
              Trending Searches
            </span>
            <div className="flex flex-wrap gap-2 px-1">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelectTerm(term)}
                  className="flex items-center gap-1 bg-secondary/80 hover:bg-secondary border border-border/50 text-xs px-3 py-1.5 rounded-full text-foreground transition-all hover:scale-105"
                >
                  <TrendingUp className="w-3 h-3 text-primary" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

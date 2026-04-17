"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "./use-debounce";
import { searchService, type SearchSuggestion } from "@/services/search.service";

export function useSearchSuggestions(query: string, minLength = 2) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < minLength) {
      setSuggestions([]);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setIsLoading(true);

    searchService
      .getSuggestions(debouncedQuery)
      .then((data) => setSuggestions(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));

    return () => abortRef.current?.abort();
  }, [debouncedQuery, minLength]);

  const clear = () => setSuggestions([]);

  return { suggestions, isLoading, clear };
}

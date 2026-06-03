"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, Navigation, PencilLine } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { LocationSuggestion, useLocation } from "../context/LocationContext";

interface LocationSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LocationSelector({ open, onOpenChange }: LocationSelectorProps) {
  const { location, isDetecting, detectionError, requestCurrentLocation, searchLocations, saveLocationSelection } =
    useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setSearchError(null);
      return;
    }

    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    let cancelled = false;

    const runSearch = async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const nextResults = await searchLocations(debouncedQuery);
        if (!cancelled) {
          setResults(nextResults);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setResults([]);
          setSearchError(error instanceof Error ? error.message : "Unable to search locations.");
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    };

    void runSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, open, searchLocations]);

  const handleCurrentLocation = async () => {
    const detected = await requestCurrentLocation();
    if (detected) {
      onOpenChange(false);
    }
  };

  const handleSelect = (suggestion: LocationSuggestion) => {
    saveLocationSelection(suggestion);
    onOpenChange(false);
  };

  const trimmedQuery = query.trim();
  const exactTypedLocation: LocationSuggestion | null =
    trimmedQuery.length >= 2
      ? {
          id: `manual-${trimmedQuery.toLowerCase()}`,
          label: `${trimmedQuery}, India`,
          city: trimmedQuery,
          state: "",
          country: "India",
          latitude: null,
          longitude: null,
        }
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Select your location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="rounded-2xl border border-border bg-secondary/30 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Current selection</p>
            <p className="mt-1 text-sm font-medium text-foreground">{location?.label ?? "No location selected yet"}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-3 rounded-2xl border-primary/20 bg-primary/5 py-6 text-primary hover:bg-primary/10"
            onClick={handleCurrentLocation}
            disabled={isDetecting}
          >
            {isDetecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            {isDetecting ? "Detecting your location..." : "Use my current location"}
          </Button>

          <div className="overflow-hidden rounded-2xl border border-border">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search city or state in India..."
                value={query}
                onValueChange={setQuery}
              />
              <CommandList className="max-h-64">
                {query.trim().length < 2 ? (
                  <div className="px-4 py-6 text-sm text-muted-foreground">
                    Type at least 2 letters to search for an Indian city.
                  </div>
                ) : null}
                {isSearching ? (
                  <div className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching locations...
                  </div>
                ) : null}
                {!isSearching && searchError ? <CommandEmpty>{searchError}</CommandEmpty> : null}
                {!isSearching && !searchError && query.trim().length >= 2 && results.length === 0 ? (
                  <CommandEmpty>No matching Indian cities found.</CommandEmpty>
                ) : null}
                {results.length > 0 ? (
                  <CommandGroup heading="Available locations">
                    {results.map((result) => (
                      <CommandItem
                        key={result.id}
                        value={result.label}
                        className="flex items-start justify-between gap-3 px-3 py-3"
                        onSelect={() => handleSelect(result)}
                      >
                        <div>
                          <p className="font-medium text-foreground">{result.label}</p>
                          <p className="text-xs text-muted-foreground">{result.country}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null}
                {exactTypedLocation ? (
                  <CommandGroup heading="Use exact text">
                    <CommandItem
                      value={exactTypedLocation.label}
                      className="flex items-start justify-between gap-3 px-3 py-3"
                      onSelect={() => handleSelect(exactTypedLocation)}
                    >
                      <div>
                        <p className="font-medium text-foreground">{exactTypedLocation.city}</p>
                        <p className="text-xs text-muted-foreground">
                          Save typed locality exactly as entered
                        </p>
                      </div>
                      <PencilLine className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    </CommandItem>
                  </CommandGroup>
                ) : null}
              </CommandList>
            </Command>
          </div>

          {detectionError ? <p className="text-sm text-destructive">{detectionError}</p> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

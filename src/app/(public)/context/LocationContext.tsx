"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

export interface UserLocation {
  label: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  source: "gps" | "manual";
  updatedAt: string;
}

export interface LocationSuggestion {
  id: string;
  label: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

interface LocationContextType {
  location: UserLocation | null;
  isDetecting: boolean;
  detectionError: string | null;
  requestCurrentLocation: (options?: { silent?: boolean }) => Promise<UserLocation | null>;
  searchLocations: (query: string) => Promise<LocationSuggestion[]>;
  saveLocationSelection: (location: LocationSuggestion) => void;
}

const LOCATION_KEY = "shopsure_user_location";
const LOCATION_ATTEMPT_KEY = "shopsure_user_location_attempted";

const LocationContext = createContext<LocationContextType | undefined>(undefined);

function loadStoredLocation(): UserLocation | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    return raw ? (JSON.parse(raw) as UserLocation) : null;
  } catch {
    return null;
  }
}

function persistLocation(location: UserLocation) {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
  localStorage.setItem(LOCATION_ATTEMPT_KEY, "true");
}

function normalizeErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Unable to detect your location right now.";
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const hasBootstrapped = useRef(false);

  const saveLocationSelection = useCallback((selection: LocationSuggestion) => {
    const nextLocation: UserLocation = {
      ...selection,
      source: "manual",
      updatedAt: new Date().toISOString(),
    };

    persistLocation(nextLocation);
    setLocation(nextLocation);
    setDetectionError(null);
    toast.success(`Location set to ${nextLocation.label}`);
  }, []);

  const requestCurrentLocation = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;

      if (typeof window === "undefined" || !navigator.geolocation) {
        const message = "Geolocation is not supported on this device.";
        setDetectionError(message);
        if (!silent) toast.error(message);
        return null;
      }

      setIsDetecting(true);
      setDetectionError(null);

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000,
          });
        });

        const search = new URLSearchParams({
          lat: String(position.coords.latitude),
          lon: String(position.coords.longitude),
        });

        const response = await fetch(`/api/location/reverse?${search.toString()}`);
        const data = (await response.json()) as {
          message?: string;
          label?: string;
          city?: string;
          state?: string;
          country?: string;
        };

        if (!response.ok || !data.label) {
          throw new Error(data.message || "Unable to resolve your current location.");
        }

        const nextLocation: UserLocation = {
          label: data.label,
          city: data.city ?? "",
          state: data.state ?? "",
          country: data.country ?? "",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          source: "gps",
          updatedAt: new Date().toISOString(),
        };

        persistLocation(nextLocation);
        setLocation(nextLocation);

        if (!silent) {
          toast.success(`Current location set to ${nextLocation.label}`);
        }

        return nextLocation;
      } catch (error: unknown) {
        localStorage.setItem(LOCATION_ATTEMPT_KEY, "true");

        const geolocationError = error as GeolocationPositionError;
        const message =
          geolocationError?.code === 1
            ? "Location permission was blocked. You can still choose your city manually."
            : normalizeErrorMessage(error);

        setDetectionError(message);
        if (!silent) toast.error(message);
        return null;
      } finally {
        setIsDetecting(false);
      }
    },
    [],
  );

  const searchLocations = useCallback(async (query: string) => {
    if (query.trim().length < 2) return [];

    const response = await fetch(`/api/location/search?q=${encodeURIComponent(query.trim())}`);
    const data = (await response.json()) as Array<LocationSuggestion> | { message?: string };

    if (!response.ok || !Array.isArray(data)) {
      throw new Error(!Array.isArray(data) ? data.message || "Unable to search locations." : "Unable to search locations.");
    }

    return data;
  }, []);

  useEffect(() => {
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    const storedLocation = loadStoredLocation();
    if (storedLocation) {
      setLocation(storedLocation);
      return;
    }

    const hasAttempted = localStorage.getItem(LOCATION_ATTEMPT_KEY) === "true";
    if (!hasAttempted) {
      void requestCurrentLocation({ silent: true });
    }
  }, [requestCurrentLocation]);

  return (
    <LocationContext.Provider
      value={{
        location,
        isDetecting,
        detectionError,
        requestCurrentLocation,
        searchLocations,
        saveLocationSelection,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }

  return context;
}

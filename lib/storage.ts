import type { Claim, Coverage, Trip } from "@/types";

export const storageKeys = {
  trips: "safetrip.trips",
  coverages: "safetrip.coverages",
  claims: "safetrip.claims",
  checklists: "safetrip.checklists",
  aiHistory: "safetrip.ai-history",
  demoConsent: "safetrip.demo-consent",
} as const;

export function readCollection<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(key);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function writeCollection<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

function upsertById<T extends { id: string }>(key: string, item: T) {
  const items = readCollection<T>(key);
  const index = items.findIndex((current) => current.id === item.id);
  const next = index === -1 ? [...items, item] : items.map((current) => (current.id === item.id ? item : current));
  writeCollection(key, next);
}

export function saveTrip(trip: Trip) {
  upsertById(storageKeys.trips, trip);
}

export function getTripById(id: string) {
  return readCollection<Trip>(storageKeys.trips).find((trip) => trip.id === id);
}

export function saveCoverage(coverage: Coverage) {
  upsertById(storageKeys.coverages, coverage);
}

export function saveClaim(claim: Claim) {
  upsertById(storageKeys.claims, claim);
}

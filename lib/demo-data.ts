import type { TripDraft } from "@/types";

export const demoTripDraft: TripDraft = {
  origin: "Jakarta",
  destination: "Tokyo",
  departureDate: "2026-12-10",
  returnDate: "2026-12-20",
  travelers: 2,
  tripType: "couple",
  activities: ["city", "winter_sports"],
};

export const activityOptions = [
  { id: "city", label: "City exploration" },
  { id: "beach", label: "Beach" },
  { id: "hiking", label: "Hiking" },
  { id: "adventure", label: "Adventure" },
  { id: "winter_sports", label: "Winter sports" },
] as const;

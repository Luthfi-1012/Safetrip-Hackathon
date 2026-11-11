import type { TripDraft } from "@/types";

const DAY_MS = 86_400_000;

function toUtcDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function validateTripDraft(draft: TripDraft, today = new Date().toISOString().slice(0, 10)) {
  const errors: Record<string, string> = {};

  if (!draft.origin.trim()) errors.origin = "Origin is required.";
  if (!draft.destination.trim()) errors.destination = "Destination is required.";
  if (!draft.departureDate) errors.departureDate = "Departure date is required.";
  if (!draft.returnDate) errors.returnDate = "Return date is required.";
  if (draft.travelers < 1) errors.travelers = "Add at least one traveler.";
  if (draft.activities.length === 0) errors.activities = "Choose at least one activity.";

  if (draft.departureDate && draft.departureDate < today) {
    errors.departureDate = "Departure date cannot be in the past.";
  }

  if (draft.departureDate && draft.returnDate) {
    const duration = (toUtcDate(draft.returnDate).getTime() - toUtcDate(draft.departureDate).getTime()) / DAY_MS;

    if (duration <= 0) errors.returnDate = "Return date must be after departure.";
    if (duration > 60) errors.returnDate = "Demo trips cannot exceed 60 days.";
  }

  return errors;
}

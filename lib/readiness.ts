import type { ReadinessAssessment, ReadinessLevel, Trip } from "@/types";

const indonesianDestinations = new Set([
  "jakarta",
  "bandung",
  "surabaya",
  "yogyakarta",
  "bali",
  "denpasar",
  "medan",
  "semarang",
  "makassar",
  "lombok",
  "batam",
  "balikpapan",
  "surakarta",
  "solo",
  "malang",
]);

export function getReadinessLevel(score: number): ReadinessLevel {
  if (score >= 65) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

export function calculateReadiness(trip: Trip): ReadinessAssessment {
  let score = 20;
  const factors: string[] = [];
  const duration = Math.round(
    (new Date(`${trip.returnDate}T00:00:00.000Z`).getTime() - new Date(`${trip.departureDate}T00:00:00.000Z`).getTime()) /
      86_400_000,
  );

  if (!indonesianDestinations.has(trip.destination.trim().toLowerCase())) {
    score += 20;
    factors.push("International travel");
  }
  if (duration > 7) {
    score += 10;
    factors.push("More than 7 days");
  }
  if (trip.travelers >= 3) {
    score += 8;
    factors.push("3+ travelers");
  }
  if (trip.activities.includes("hiking")) {
    score += 10;
    factors.push("Hiking");
  }
  if (trip.activities.includes("adventure")) {
    score += 15;
    factors.push("Adventure activities");
  }
  if (trip.activities.includes("winter_sports")) {
    score += 18;
    factors.push("Winter sports");
  }
  if (trip.tripType === "family") {
    score += 5;
    factors.push("Family trip");
  }

  score = Math.min(100, Math.max(0, score));
  const level = getReadinessLevel(score);
  const checklist = [
    { id: "documents", label: "Simpan paspor/KTP dan itinerary digital.", completed: false },
    { id: "emergency-share", label: "Bagikan rencana perjalanan kepada kontak darurat.", completed: false },
    { id: "bookings", label: "Simpan bukti booking dan boarding pass.", completed: false },
    { id: "activities", label: "Periksa aktivitas yang membutuhkan perlindungan khusus.", completed: false },
    { id: "local-help", label: "Siapkan nomor bantuan lokal di destinasi.", completed: false },
  ];

  if (trip.activities.includes("winter_sports")) {
    checklist.push({ id: "winter-terms", label: "Check activity-specific terms before traveling.", completed: false });
  }

  return {
    score,
    level,
    factors,
    checklist,
    recommendedPlanId: level === "high" ? "complete" : level === "moderate" ? "explorer" : "basic",
  };
}

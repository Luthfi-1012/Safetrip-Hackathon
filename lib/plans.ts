import type { ProtectionPlan } from "@/types";

export const protectionPlans: ProtectionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 29000,
    description: "Untuk perjalanan singkat dan sederhana.",
    benefits: ["Flight delay support", "Basic baggage assistance", "Accidental emergency support"],
    exclusions: ["Pre-existing conditions", "Unlisted high-risk activities", "Events outside fictional demo terms"],
    limits: ["Fictional delay support up to Rp500.000", "Fictional baggage support up to Rp1.000.000"],
    accent: "sky",
  },
  {
    id: "explorer",
    name: "Explorer",
    price: 59000,
    description: "Untuk perjalanan lebih panjang atau aktivitas beragam.",
    benefits: ["Everything in Basic", "Trip cancellation support", "Medical emergency support", "Higher fictional limits"],
    exclusions: ["Pre-existing conditions", "Excluded activities", "Missing supporting documents"],
    limits: ["Fictional cancellation support up to Rp3.000.000", "Fictional medical support up to Rp5.000.000"],
    accent: "teal",
  },
  {
    id: "complete",
    name: "Complete",
    price: 99000,
    description: "Untuk perjalanan internasional, keluarga, atau itinerary kompleks.",
    benefits: ["Everything in Explorer", "Enhanced fictional limits", "Concierge guidance", "Family trip support"],
    exclusions: ["Pre-existing conditions", "Activities not declared in this demo", "Terms outside fictional coverage"],
    limits: ["Fictional cancellation support up to Rp7.500.000", "Fictional medical support up to Rp15.000.000"],
    accent: "navy",
  },
];

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

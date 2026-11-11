import type { ClaimSummaryInput, ClaimType } from "@/types";

export const medicalEmergencyMessage = "Jika ini keadaan darurat, hubungi layanan darurat setempat atau tenaga medis sekarang.";

export const claimTypeData: Record<ClaimType, {
  label: string;
  description: string;
  documents: string[];
  quickReplies: string[];
  initialSteps: string[];
}> = {
  flight_delay: {
    label: "Flight delay",
    description: "Record the flight, delay duration, and what the carrier told you.",
    documents: ["Boarding pass", "Proof of delay", "Relevant receipts"],
    quickReplies: ["Flight GA 872 was delayed for four hours in Jakarta.", "The carrier announced a delay and I kept the notification."],
    initialSteps: ["Keep your boarding pass and delay notification.", "Ask the carrier for written confirmation.", "Keep receipts for relevant additional costs."],
  },
  lost_baggage: {
    label: "Lost baggage",
    description: "Record the carrier, baggage tag, and last known location.",
    documents: ["Baggage tag", "Boarding pass", "Carrier report", "Photo if available"],
    quickReplies: ["Baggage tag BG 123 did not arrive at Tokyo.", "I reported the missing baggage at the carrier desk."],
    initialSteps: ["Report the baggage to the carrier immediately.", "Keep the baggage tag and property irregularity report.", "List essential items without adding sensitive details."],
  },
  trip_cancellation: {
    label: "Trip cancellation",
    description: "Record the reason, date, and affected booking.",
    documents: ["Booking confirmation", "Proof of cancellation", "Supporting documents"],
    quickReplies: ["My Tokyo hotel booking was cancelled on 12 December.", "The carrier cancelled the booked flight and sent a notification."],
    initialSteps: ["Save the booking confirmation.", "Request written cancellation proof from the provider.", "Record relevant dates and any provider response."],
  },
  medical_emergency: {
    label: "Medical emergency",
    description: "Record only a brief incident note after urgent help is arranged.",
    documents: ["Emergency contact note", "Proof of service if safe", "Brief incident note"],
    quickReplies: ["Local medical assistance has been contacted.", "I am safe and recording a brief note about the incident."],
    initialSteps: ["Contact local emergency services or qualified medical help first.", "Share your location with a trusted emergency contact.", "Only collect service documents when it is safe to do so."],
  },
};

export function buildClaimSummary(input: ClaimSummaryInput) {
  const type = claimTypeData[input.type];
  const documents = input.documents.length > 0 ? input.documents.join(", ") : "Belum ada dokumen yang dipilih.";

  return `Kronologi singkat\nJenis kejadian: ${type.label}. Pada ${input.incidentDate}, ${input.details.trim()}\n\nDokumen yang dicatat\n${documents}\n\nInformasi yang mungkin masih diperlukan\nKonfirmasi dari penyedia layanan, bukti pendukung tambahan, dan detail yang diminta pada peninjauan simulasi. Ringkasan ini hanya merapikan fakta yang diberikan dan tidak menentukan hasil klaim.`;
}

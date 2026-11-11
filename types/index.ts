export type TripType = "solo" | "couple" | "family" | "business";
export type Activity = "city" | "beach" | "hiking" | "adventure" | "winter_sports";
export type ReadinessLevel = "low" | "moderate" | "high";
export type TripStatus = "planning" | "protected" | "completed";
export type ClaimType = "flight_delay" | "lost_baggage" | "trip_cancellation" | "medical_emergency";
export type ClaimStatus = "draft" | "submitted" | "needs_information" | "human_review_requested" | "closed_demo";

export interface TripDraft {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  tripType: TripType;
  activities: Activity[];
}

export interface Trip extends TripDraft {
  id: string;
  createdAt: string;
  status: TripStatus;
}

export interface ReadinessAssessment {
  score: number;
  level: ReadinessLevel;
  factors: string[];
  checklist: { id: string; label: string; completed: boolean }[];
  recommendedPlanId: ProtectionPlan["id"];
}

export interface ProtectionPlan {
  id: "basic" | "explorer" | "complete";
  name: string;
  price: number;
  description: string;
  benefits: string[];
  exclusions: string[];
  limits: string[];
  accent: string;
}

export interface Coverage {
  id: string;
  tripId: string;
  planId: ProtectionPlan["id"];
  policyId: string;
  travelerName: string;
  emergencyContact?: string;
  activatedAt: string;
  status: "active_demo";
}

export interface Claim {
  id: string;
  tripId: string;
  coverageId?: string;
  type: ClaimType;
  incidentDate: string;
  details: string;
  documents: string[];
  summary: string;
  status: ClaimStatus;
  createdAt: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

export interface PolicyExplanation {
  summary: string;
  example: string;
  checks: string[];
}

export interface ClaimSummaryInput {
  type: ClaimType;
  incidentDate: string;
  details: string;
  documents: string[];
}

import type { Metadata } from "next";
import { ClaimCompanion } from "@/components/claims/claim-companion";

export const metadata: Metadata = { title: "Claim companion" };

export default async function ClaimsPage({ searchParams }: { searchParams: Promise<{ trip?: string }> }) {
  const { trip } = await searchParams;
  return <ClaimCompanion initialTripId={trip} />;
}

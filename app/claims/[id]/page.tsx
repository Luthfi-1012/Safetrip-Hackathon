import type { Metadata } from "next";
import { ClaimDetail } from "@/components/claims/claim-detail";

export const metadata: Metadata = { title: "Demo claim status" };

export default async function ClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClaimDetail claimId={id} />;
}

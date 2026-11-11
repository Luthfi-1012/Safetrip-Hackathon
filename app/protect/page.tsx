import type { Metadata } from "next";
import { ProtectionWorkspace } from "@/components/protection/protection-workspace";

export const metadata: Metadata = { title: "Compare demo protection" };

export default async function ProtectPage({ searchParams }: { searchParams: Promise<{ trip?: string }> }) {
  const { trip } = await searchParams;
  return <ProtectionWorkspace initialTripId={trip} />;
}

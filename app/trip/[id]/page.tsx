import type { Metadata } from "next";
import { TripWorkspace } from "@/components/trip/trip-workspace";

export const metadata: Metadata = { title: "Your trip" };

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TripWorkspace tripId={id} />;
}

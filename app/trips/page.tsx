import type { Metadata } from "next";
import { MyTrips } from "@/components/trips/my-trips";

export const metadata: Metadata = { title: "My trips" };

export default function TripsPage() {
  return <MyTrips />;
}

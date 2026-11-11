import { describe, expect, it } from "vitest";
import { generateItinerary } from "./itineraries";
import type { Trip } from "@/types";

const tokyoTrip: Trip = {
  id: "tokyo-demo",
  origin: "Jakarta",
  destination: "Tokyo",
  departureDate: "2026-12-10",
  returnDate: "2026-12-20",
  travelers: 2,
  tripType: "couple",
  activities: ["city", "winter_sports"],
  createdAt: "2026-11-11T00:00:00.000Z",
  status: "planning",
};

describe("generateItinerary", () => {
  it("creates one entry for every calendar day including arrival and departure", () => {
    const result = generateItinerary(tokyoTrip);

    expect(result).toHaveLength(11);
    expect(result[0]).toMatchObject({ day: 1, date: "2026-12-10" });
    expect(result[10]).toMatchObject({ day: 11, date: "2026-12-20" });
    expect(result[10].title).toContain("Departure");
  });

  it("uses destination and activity context without external data", () => {
    const result = generateItinerary(tokyoTrip);
    const text = result.map((day) => `${day.title} ${day.description}`).join(" ");

    expect(text).toContain("Tokyo");
    expect(text).toContain("winter");
  });

  it("falls back to a useful custom-destination itinerary", () => {
    const result = generateItinerary({ ...tokyoTrip, destination: "Yogyakarta", activities: ["city"] });

    expect(result[1].description).toContain("Yogyakarta");
  });
});

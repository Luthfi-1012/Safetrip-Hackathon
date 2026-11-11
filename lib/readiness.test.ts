import { describe, expect, it } from "vitest";
import { calculateReadiness, getReadinessLevel } from "./readiness";
import type { Trip } from "@/types";

function trip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: "trip-test",
    origin: "Jakarta",
    destination: "Bandung",
    departureDate: "2026-12-10",
    returnDate: "2026-12-12",
    travelers: 1,
    tripType: "solo",
    activities: ["city"],
    createdAt: "2026-11-11T00:00:00.000Z",
    status: "planning",
    ...overrides,
  };
}

describe("calculateReadiness", () => {
  it("recommends Basic for a short simple domestic trip", () => {
    const result = calculateReadiness(trip());

    expect(result.score).toBe(20);
    expect(result.level).toBe("low");
    expect(result.recommendedPlanId).toBe("basic");
  });

  it("scores the Tokyo winter-sports demo at 68 and recommends Complete", () => {
    const result = calculateReadiness(
      trip({
        destination: "Tokyo",
        returnDate: "2026-12-20",
        travelers: 2,
        tripType: "couple",
        activities: ["city", "winter_sports"],
      }),
    );

    expect(result.score).toBe(68);
    expect(result.level).toBe("high");
    expect(result.recommendedPlanId).toBe("complete");
    expect(result.factors).toEqual(
      expect.arrayContaining(["International travel", "More than 7 days", "Winter sports"]),
    );
  });

  it("adds family, traveler, duration, hiking, and adventure factors", () => {
    const result = calculateReadiness(
      trip({
        returnDate: "2026-12-18",
        travelers: 4,
        tripType: "family",
        activities: ["hiking", "adventure"],
      }),
    );

    expect(result.score).toBe(68);
    expect(result.recommendedPlanId).toBe("complete");
  });

  it("caps the preparation score at 100", () => {
    const result = calculateReadiness(
      trip({
        destination: "Tokyo",
        returnDate: "2026-12-20",
        travelers: 5,
        tripType: "family",
        activities: ["hiking", "adventure", "winter_sports"],
      }),
    );

    expect(result.score).toBe(100);
  });

  it("uses the documented level boundaries", () => {
    expect(getReadinessLevel(39)).toBe("low");
    expect(getReadinessLevel(40)).toBe("moderate");
    expect(getReadinessLevel(64)).toBe("moderate");
    expect(getReadinessLevel(65)).toBe("high");
  });
});

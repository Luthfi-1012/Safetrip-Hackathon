import { describe, expect, it } from "vitest";
import { validateTripDraft } from "./validation";
import type { TripDraft } from "@/types";

const validDraft: TripDraft = {
  origin: "Jakarta",
  destination: "Tokyo",
  departureDate: "2026-12-10",
  returnDate: "2026-12-20",
  travelers: 2,
  tripType: "couple",
  activities: ["city", "winter_sports"],
};

describe("validateTripDraft", () => {
  it("accepts the valid Tokyo demo trip", () => {
    expect(validateTripDraft(validDraft, "2026-11-11")).toEqual({});
  });

  it("reports required text fields and activities", () => {
    const errors = validateTripDraft(
      { ...validDraft, origin: " ", destination: "", activities: [] },
      "2026-11-11",
    );

    expect(errors.origin).toBe("Origin is required.");
    expect(errors.destination).toBe("Destination is required.");
    expect(errors.activities).toBe("Choose at least one activity.");
  });

  it("reports required travel dates", () => {
    const errors = validateTripDraft(
      { ...validDraft, departureDate: "", returnDate: "" },
      "2026-11-11",
    );

    expect(errors.departureDate).toBe("Departure date is required.");
    expect(errors.returnDate).toBe("Return date is required.");
  });

  it("rejects a departure in the past", () => {
    expect(
      validateTripDraft({ ...validDraft, departureDate: "2026-11-10" }, "2026-11-11").departureDate,
    ).toBe("Departure date cannot be in the past.");
  });

  it("rejects a return on or before departure", () => {
    expect(
      validateTripDraft({ ...validDraft, returnDate: "2026-12-10" }, "2026-11-11").returnDate,
    ).toBe("Return date must be after departure.");
  });

  it("rejects trips longer than 60 days", () => {
    expect(
      validateTripDraft({ ...validDraft, returnDate: "2027-02-15" }, "2026-11-11").returnDate,
    ).toBe("Demo trips cannot exceed 60 days.");
  });

  it("rejects fewer than one traveler", () => {
    expect(
      validateTripDraft({ ...validDraft, travelers: 0 }, "2026-11-11").travelers,
    ).toBe("Add at least one traveler.");
  });
});

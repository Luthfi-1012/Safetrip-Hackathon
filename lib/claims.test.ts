import { describe, expect, it } from "vitest";
import { buildClaimSummary, claimTypeData } from "./claims";

describe("demo claim companion", () => {
  it("supports the four specified incident types with relevant dummy documents", () => {
    expect(Object.keys(claimTypeData).sort()).toEqual(["flight_delay", "lost_baggage", "medical_emergency", "trip_cancellation"]);
    expect(claimTypeData.flight_delay.documents).toContain("Boarding pass");
    expect(claimTypeData.flight_delay.documents).toContain("Proof of delay");
    expect(claimTypeData.lost_baggage.documents).toContain("Baggage tag");
    expect(claimTypeData.medical_emergency.documents).toContain("Emergency contact note");
  });

  it("builds a neutral chronology using only the supplied facts", () => {
    const result = buildClaimSummary({
      type: "flight_delay",
      incidentDate: "2026-12-12",
      details: "Flight GA 872 was delayed for four hours in Jakarta.",
      documents: ["Boarding pass", "Proof of delay"],
    });

    expect(result).toContain("Kronologi singkat");
    expect(result).toContain("Flight GA 872 was delayed for four hours in Jakarta.");
    expect(result).toContain("2026-12-12");
    expect(result).toContain("Dokumen yang dicatat");
    expect(result).toContain("Boarding pass, Proof of delay");
    expect(result).toContain("Informasi yang mungkin masih diperlukan");
    expect(result).not.toMatch(/approved|rejected|paid|disetujui|ditolak/i);
  });

  it("records when no documents were selected without inventing one", () => {
    const result = buildClaimSummary({
      type: "lost_baggage",
      incidentDate: "2026-12-14",
      details: "Baggage tag BG 123 did not arrive at Tokyo.",
      documents: [],
    });

    expect(result).toContain("Belum ada dokumen yang dipilih.");
    expect(result).toContain("Baggage tag BG 123 did not arrive at Tokyo.");
  });
});

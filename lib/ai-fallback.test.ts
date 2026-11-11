import { describe, expect, it } from "vitest";
import { demoTripDraft } from "./demo-data";
import { getTripAdvisorGuidance } from "./ai-fallback";
import { protectionPlans } from "./plans";
import { calculateReadiness } from "./readiness";
import type { Trip } from "@/types";

const trip: Trip = { ...demoTripDraft, id: "trip-ai-test", createdAt: "2026-11-11T00:00:00.000Z", status: "planning" };

describe("local AI travel advisor fallback", () => {
  it("recommends from the supplied plan and explains the real trip factors in Indonesian", () => {
    const assessment = calculateReadiness(trip);
    const plan = protectionPlans.find((item) => item.id === assessment.recommendedPlanId)!;
    const result = getTripAdvisorGuidance(trip, assessment, plan);

    expect(result).toContain("Rekomendasi");
    expect(result).toContain("Paket Complete");
    expect(result).toContain("Alasannya");
    expect(result).toContain("Tokyo");
    expect(result).toContain("11 hari");
    expect(result).toContain("winter sports");
    expect(result).toContain("Yang perlu diperiksa");
    expect(result).not.toContain("Rp99.000");
  });

  it("stays within 120 words and ends with the exact demo disclaimer", () => {
    const assessment = calculateReadiness(trip);
    const plan = protectionPlans.find((item) => item.id === assessment.recommendedPlanId)!;
    const result = getTripAdvisorGuidance(trip, assessment, plan);

    expect(result.trim().split(/\s+/).length).toBeLessThanOrEqual(120);
    expect(result.endsWith("Ini panduan AI untuk demo; perlindungan nyata mengikuti syarat polis dan verifikasi pihak terkait.")).toBe(true);
    expect(result.match(/manfaat|pengecualian/gi)).not.toBeNull();
  });
});

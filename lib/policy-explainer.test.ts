import { describe, expect, it } from "vitest";
import { explainPolicy } from "./ai-fallback";
import { protectionPlans } from "./plans";

const complete = protectionPlans.find((plan) => plan.id === "complete")!;
const guardrail = "Informasi itu tidak tersedia pada data prototype ini. Untuk perlindungan nyata, konfirmasikan wording polis dan ketentuannya kepada penyedia resmi.";

describe("local AI policy explainer", () => {
  it("returns a structured answer sourced from dummy benefits and exclusions", () => {
    const result = explainPolicy(complete, "What does this plan cover?");

    expect(result.summary).toContain("Complete");
    expect(result.summary).toContain("Concierge guidance");
    expect(result.example).toContain("hypothetical");
    expect(result.checks.length).toBeGreaterThan(0);
    expect(result.checks.length).toBeLessThanOrEqual(3);
    expect(result.checks).toContain("Pre-existing conditions");
  });

  it("resolves inherited Basic benefits without inventing new protection", () => {
    const result = explainPolicy(complete, "Does it include flight delay support?");

    expect(result.summary).toContain("Flight delay support");
    expect(result.summary).not.toContain("approved");
  });

  it("uses the exact guardrail when the dummy data cannot answer", () => {
    const result = explainPolicy(complete, "Will my claim be approved and how much will I be paid?");

    expect(result.summary).toBe(guardrail);
    expect(result.example).toBe("");
    expect(result.checks).toEqual([]);
  });

  it("does not imply winter sports are covered when the data is silent", () => {
    const result = explainPolicy(complete, "Is winter sports equipment fully covered?");

    expect(result.summary).toBe(guardrail);
  });
});

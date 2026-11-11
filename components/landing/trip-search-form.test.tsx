import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { activityOptions } from "@/lib/demo-data";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
import { TripSearchForm } from "./trip-search-form";

describe("TripSearchForm", () => {
  it("labels every trip input and renders the primary demo action", () => {
    const html = renderToStaticMarkup(<TripSearchForm />);

    for (const label of ["From", "Destination", "Departure", "Return", "Travelers", "Trip type"]) {
      expect(html).toContain(`>${label}</label>`);
    }
    expect(html).toContain("Plan my trip");
    expect(html).toContain("Jakarta");
    expect(html).toContain("Tokyo");
  });

  it("offers all five activities as checked-or-unchecked choices", () => {
    const html = renderToStaticMarkup(<TripSearchForm />);

    for (const activity of activityOptions) {
      expect(html).toContain(`value="${activity.id}"`);
      expect(html).toContain(activity.label);
    }
    expect(html.match(/type="checkbox"/g)).toHaveLength(5);
    expect(html).toMatch(/<input[^>]*checked=""[^>]*value="city"/);
    expect(html).toMatch(/<input[^>]*checked=""[^>]*value="winter_sports"/);
  });

  it("explains that no sensitive details or real payment are needed", () => {
    const html = renderToStaticMarkup(<TripSearchForm />);

    expect(html).toContain("No identity numbers, payment details, or medical records.");
    expect(html).toContain("Prototype only — no real booking or insurance purchase.");
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { getTripById, readCollection, saveClaim, saveCoverage, saveTrip, writeCollection } from "./storage";
import type { Claim, Coverage, Trip } from "@/types";

const trip: Trip = {
  id: "trip-1",
  origin: "Jakarta",
  destination: "Tokyo",
  departureDate: "2026-12-10",
  returnDate: "2026-12-20",
  travelers: 2,
  tripType: "couple",
  activities: ["city"],
  createdAt: "2026-11-11T00:00:00.000Z",
  status: "planning",
};

const coverage: Coverage = {
  id: "coverage-1",
  tripId: "trip-1",
  planId: "complete",
  policyId: "ST-DEMO-000001",
  travelerName: "Demo Traveler",
  activatedAt: "2026-11-11T00:00:00.000Z",
  status: "active_demo",
};

const claim: Claim = {
  id: "claim-1",
  tripId: "trip-1",
  coverageId: "coverage-1",
  type: "flight_delay",
  incidentDate: "2026-12-10",
  details: "Flight delayed for four hours.",
  documents: ["Boarding pass"],
  summary: "Demo summary",
  status: "submitted",
  createdAt: "2026-12-10T00:00:00.000Z",
};

class FakeStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("localStorage collections", () => {
  it("returns an empty collection on the server", () => {
    expect(readCollection("safetrip.trips")).toEqual([]);
  });

  it("recovers from malformed JSON", () => {
    const storage = new FakeStorage();
    storage.setItem("safetrip.trips", "not-json");
    vi.stubGlobal("window", { localStorage: storage });

    expect(readCollection("safetrip.trips")).toEqual([]);
  });

  it("rejects stored values that are not arrays", () => {
    const storage = new FakeStorage();
    storage.setItem("safetrip.trips", "{}");
    vi.stubGlobal("window", { localStorage: storage });

    expect(readCollection("safetrip.trips")).toEqual([]);
  });

  it("inserts and updates trips without duplicating IDs", () => {
    const storage = new FakeStorage();
    vi.stubGlobal("window", { localStorage: storage });

    saveTrip(trip);
    saveTrip({ ...trip, status: "protected" });

    expect(readCollection<Trip>("safetrip.trips")).toHaveLength(1);
    expect(getTripById("trip-1")?.status).toBe("protected");
  });

  it("persists coverage and claims in their own collections", () => {
    const storage = new FakeStorage();
    vi.stubGlobal("window", { localStorage: storage });

    saveCoverage(coverage);
    saveClaim(claim);

    expect(readCollection<Coverage>("safetrip.coverages")).toEqual([coverage]);
    expect(readCollection<Claim>("safetrip.claims")).toEqual([claim]);
  });

  it("round-trips array data", () => {
    const storage = new FakeStorage();
    vi.stubGlobal("window", { localStorage: storage });
    const trips = [{ id: "trip-1" }];

    writeCollection("safetrip.trips", trips);

    expect(readCollection("safetrip.trips")).toEqual(trips);
  });
});

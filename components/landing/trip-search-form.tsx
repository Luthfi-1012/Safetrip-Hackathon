"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, LockKeyhole } from "lucide-react";
import { activityOptions, demoTripDraft } from "@/lib/demo-data";
import { saveTrip } from "@/lib/storage";
import { validateTripDraft } from "@/lib/validation";
import type { Activity, Trip, TripDraft, TripType } from "@/types";

export function TripSearchForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<TripDraft>(demoTripDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function update<K extends keyof TripDraft>(key: K, value: TripDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function toggleActivity(activity: Activity) {
    const selected = draft.activities.includes(activity);
    update(
      "activities",
      selected
        ? draft.activities.filter((item) => item !== activity)
        : [...draft.activities, activity],
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateTripDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    window.setTimeout(() => {
      const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}`;
      const trip: Trip = {
        ...draft,
        id: `trip-${id}`,
        createdAt: new Date().toISOString(),
        status: "planning",
      };
      saveTrip(trip);
      router.push(`/trip/${trip.id}`);
    }, 650);
  }

  return (
    <form className="trip-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="origin">From</label>
          <input
            id="origin"
            name="origin"
            value={draft.origin}
            onChange={(event) => update("origin", event.target.value)}
            placeholder="Jakarta"
            autoComplete="address-level2"
            aria-describedby={errors.origin ? "origin-error" : undefined}
          />
          {errors.origin && <p className="field-error" id="origin-error" role="alert">{errors.origin}</p>}
        </div>
        <div className="field">
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            name="destination"
            value={draft.destination}
            onChange={(event) => update("destination", event.target.value)}
            placeholder="Tokyo"
            autoComplete="off"
            aria-describedby={errors.destination ? "destination-error" : undefined}
          />
          {errors.destination && <p className="field-error" id="destination-error" role="alert">{errors.destination}</p>}
        </div>
        <div className="field">
          <label htmlFor="departure">Departure</label>
          <input
            id="departure"
            name="departure"
            type="date"
            value={draft.departureDate}
            onChange={(event) => update("departureDate", event.target.value)}
            aria-describedby={errors.departureDate ? "departure-error" : undefined}
          />
          {errors.departureDate && <p className="field-error" id="departure-error" role="alert">{errors.departureDate}</p>}
        </div>
        <div className="field">
          <label htmlFor="return">Return</label>
          <input
            id="return"
            name="return"
            type="date"
            value={draft.returnDate}
            onChange={(event) => update("returnDate", event.target.value)}
            aria-describedby={errors.returnDate ? "return-error" : undefined}
          />
          {errors.returnDate && <p className="field-error" id="return-error" role="alert">{errors.returnDate}</p>}
        </div>
        <div className="field">
          <label htmlFor="travelers">Travelers</label>
          <input
            id="travelers"
            name="travelers"
            type="number"
            min="1"
            max="12"
            value={draft.travelers}
            onChange={(event) => update("travelers", Number(event.target.value))}
            aria-describedby={errors.travelers ? "travelers-error" : undefined}
          />
          {errors.travelers && <p className="field-error" id="travelers-error" role="alert">{errors.travelers}</p>}
        </div>
        <div className="field">
          <label htmlFor="trip-type">Trip type</label>
          <select
            id="trip-type"
            name="tripType"
            value={draft.tripType}
            onChange={(event) => update("tripType", event.target.value as TripType)}
          >
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
            <option value="business">Business</option>
          </select>
        </div>
      </div>

      <fieldset className="activity-field" aria-describedby={errors.activities ? "activities-error" : undefined}>
        <legend>What will you do?</legend>
        <div className="activity-options">
          {activityOptions.map((activity) => (
            <label className="activity-option" key={activity.id}>
              <input
                className="m-check"
                type="checkbox"
                name="activities"
                value={activity.id}
                checked={draft.activities.includes(activity.id)}
                onChange={() => toggleActivity(activity.id)}
              />
              <span>{activity.label}</span>
            </label>
          ))}
        </div>
        {errors.activities && <p className="field-error" id="activities-error" role="alert">{errors.activities}</p>}
      </fieldset>

      <div className="form-footer">
        <div className="privacy-note">
          <LockKeyhole size={17} aria-hidden="true" />
          <span>No identity numbers, payment details, or medical records.</span>
        </div>
        <button className="btn btn--primary btn--xl" type="submit" disabled={loading}>
          {loading ? <LoaderCircle className="spin" size={19} aria-hidden="true" /> : null}
          {loading ? "Building your trip…" : "Plan my trip"}
          {!loading && <ArrowRight size={19} aria-hidden="true" />}
        </button>
      </div>
      <p className="form-disclaimer">Prototype only — no real booking or insurance purchase.</p>
    </form>
  );
}

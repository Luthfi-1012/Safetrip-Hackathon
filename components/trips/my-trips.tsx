"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, MapPin, Plus, ShieldCheck, Users } from "lucide-react";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { protectionPlans } from "@/lib/plans";
import { readCollection, storageKeys } from "@/lib/storage";
import type { Coverage, Trip } from "@/types";

export function MyTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [coverages, setCoverages] = useState<Coverage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTrips(readCollection<Trip>(storageKeys.trips).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    setCoverages(readCollection<Coverage>(storageKeys.coverages));
    setLoaded(true);
  }, []);

  return (
    <><SiteHeader /><main id="main-content" className="trips-page wrap">
      <div className="trips-heading"><div><p className="eyebrow">YOUR LOCAL POLICY WALLET</p><h1>My trips</h1><p>Every demo journey and fictional certificate saved in this browser.</p></div><Link className="btn btn--primary btn--xl" href="/plan"><Plus size={18} />New trip</Link></div>
      {!loaded ? <div className="trips-loading"><div className="loading-mark" /><p>Loading your local trips…</p></div> : trips.length === 0 ? <div className="trips-empty"><div><MapPin size={34} /></div><p className="eyebrow">NO TRIPS YET</p><h2>Your next journey starts here.</h2><p>Create the Tokyo demo in one click, then come back to see your policy wallet.</p><Link className="btn btn--primary btn--xl" href="/plan">Plan my first trip <ArrowRight size={17} /></Link><small>No account needed. Data stays on this device.</small></div> : <div className="trip-card-grid">{trips.map((trip) => {
        const coverage = coverages.find((item) => item.tripId === trip.id);
        const plan = coverage ? protectionPlans.find((item) => item.id === coverage.planId) : null;
        return <article className="saved-trip-card" key={trip.id}>
          <Link className="saved-trip-card__image m-zoom" href={`/trip/${trip.id}`}><img src={trip.destination.toLowerCase() === "tokyo" ? "/images/tokyo.jpg" : "/images/japan-hero.jpg"} alt={`View of ${trip.destination}`} /><span className={`saved-status${coverage ? " protected" : ""}`}><i />{coverage ? "Protected · demo" : "Planning"}</span></Link>
          <div className="saved-trip-card__body"><p className="eyebrow">{trip.origin.toUpperCase()} → {trip.destination.toUpperCase()}</p><h2>{trip.destination}</h2><div className="saved-trip-meta"><span><CalendarDays size={15} />{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(`${trip.departureDate}T00:00:00Z`))} — {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${trip.returnDate}T00:00:00Z`))}</span><span><Users size={15} />{trip.travelers} travelers · {trip.tripType}</span></div>
          {coverage && plan ? <div className="wallet-plan"><ShieldCheck size={20} /><div><span>{plan.name} · Active demo</span><strong>{coverage.policyId}</strong></div></div> : <div className="wallet-plan planning"><ShieldCheck size={20} /><div><span>No demo protection activated</span><strong>Compare packages when you’re ready.</strong></div></div>}
          <div className="saved-trip-actions"><Link className="text-link" href={`/trip/${trip.id}`}>Open trip <ArrowRight size={15} /></Link><Link className="text-link" href={`/protect?trip=${trip.id}`}>{coverage ? "View certificate" : "Compare protection"}<ArrowRight size={15} /></Link>{coverage && <Link className="text-link" href={`/claims?trip=${trip.id}`}><FileText size={15} />Claim demo</Link>}</div></div>
        </article>;
      })}</div>}
      <p className="trips-storage-note"><ShieldCheck size={14} />Local prototype data only. Clearing browser storage removes these demo trips and certificates.</p>
    </main><SiteFooter /></>
  );
}

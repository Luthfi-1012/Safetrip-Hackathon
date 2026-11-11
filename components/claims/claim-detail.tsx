"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, FileText, HeartPulse, LifeBuoy, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { claimTypeData, medicalEmergencyMessage } from "@/lib/claims";
import { readCollection, saveClaim, storageKeys } from "@/lib/storage";
import type { Claim, Trip } from "@/types";

export function ClaimDetail({ claimId }: { claimId: string }) {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedClaim = readCollection<Claim>(storageKeys.claims).find((item) => item.id === claimId) ?? null;
    setClaim(savedClaim);
    setTrip(savedClaim ? readCollection<Trip>(storageKeys.trips).find((item) => item.id === savedClaim.tripId) ?? null : null);
    setLoaded(true);
  }, [claimId]);

  function requestHumanReview() {
    if (!claim) return;
    const next = { ...claim, status: "human_review_requested" as const };
    saveClaim(next);
    setClaim(next);
  }

  if (!loaded) return <><SiteHeader /><main id="main-content" className="loading-page"><div className="loading-mark" /><p>Loading demo claim…</p></main></>;
  if (!claim || !trip) return <><SiteHeader /><main id="main-content" className="empty-page wrap"><FileText size={42} /><p className="eyebrow">CLAIM NOT FOUND</p><h1>This demo claim isn’t saved here.</h1><p>Open a protected trip to start a new claim simulation.</p><Link className="btn btn--primary btn--xl" href="/trips">Open My Trips <ArrowRight size={17} /></Link></main><SiteFooter /></>;

  const reviewRequested = claim.status === "human_review_requested";

  return (
    <><SiteHeader /><main id="main-content" className="claim-detail-page wrap">
      <Link className="back-link dark" href={`/claims?trip=${trip.id}`}><ArrowLeft size={15} />Claim companion</Link>
      <div className="claim-detail-heading"><div><p className="eyebrow">DEMO CLAIM · {claim.id.slice(-8).toUpperCase()}</p><h1>{claimTypeData[claim.type].label}</h1><p>{trip.origin} → {trip.destination} · Incident {claim.incidentDate}</p></div><span className={`claim-status${reviewRequested ? " review" : ""}`}><i />{reviewRequested ? "Human review requested" : "Submitted · demo"}</span></div>
      <div className="claim-demo-warning"><ShieldCheck size={18} /><p>This is a simulation. No real claim was submitted, and no outcome has been determined.</p></div>
      {claim.type === "medical_emergency" && <div className="medical-banner" role="alert"><HeartPulse size={24} /><div><strong>Medical emergency</strong><p>{medicalEmergencyMessage}</p></div></div>}

      <div className="claim-detail-layout">
        <section className="claim-timeline-card"><p className="eyebrow">STATUS TIMELINE</p><h2>A clear, neutral demo status.</h2><div className="claim-timeline">
          <div className="complete"><CheckCircle2 size={21} /><div><strong>Demo claim created</strong><p>Your facts and selected documents were recorded locally.</p><time>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(claim.createdAt))}</time></div></div>
          <div className="complete"><CheckCircle2 size={21} /><div><strong>Submitted for simulation</strong><p>No external provider received this information.</p></div></div>
          <div className={reviewRequested ? "complete" : "active"}>{reviewRequested ? <CheckCircle2 size={21} /> : <Circle size={21} />}<div><strong>Human review simulation</strong><p>{reviewRequested ? "Requested locally. No real person has been contacted." : "Optional for urgent or complex demo scenarios."}</p></div></div>
          <div><Circle size={21} /><div><strong>Closed demo</strong><p>No automatic approval, rejection, or payment state exists.</p></div></div>
        </div><button className="btn btn--primary btn--xl" onClick={requestHumanReview} disabled={reviewRequested}><LifeBuoy size={18} />{reviewRequested ? "Human review requested" : "Request human review"}</button><p className="review-note">Simulation only — this action changes local status and does not contact a person.</p></section>
        <aside className="claim-facts-card"><p className="eyebrow">RECORDED FACTS</p><div><span>Incident type</span><strong>{claimTypeData[claim.type].label}</strong></div><div><span>Incident date</span><strong>{claim.incidentDate}</strong></div><div><span>Documents noted</span><strong>{claim.documents.length ? claim.documents.join(", ") : "None selected"}</strong></div><div><span>Original details</span><p>{claim.details}</p></div></aside>
      </div>
      <section className="submitted-summary"><p className="eyebrow">SUBMITTED DEMO SUMMARY</p><p>{claim.summary}</p><span>AI-generated guidance — demo only</span></section>
      <div className="claim-detail-actions"><Link className="btn btn--secondary" href={`/claims?trip=${trip.id}`}>Start another demo</Link><Link className="btn btn--primary" href="/trips">Back to My Trips <ArrowRight size={16} /></Link></div>
    </main><SiteFooter /></>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ArrowRight, CalendarX, Check, CheckCircle2, FileText, HeartPulse, LoaderCircle, Luggage, Plane, ShieldAlert, Sparkles } from "lucide-react";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { buildClaimSummary, claimTypeData, medicalEmergencyMessage } from "@/lib/claims";
import { readCollection, saveClaim, storageKeys } from "@/lib/storage";
import type { Claim, ClaimType, Coverage, Trip } from "@/types";

const claimIcons: Record<ClaimType, LucideIcon> = { flight_delay: Plane, lost_baggage: Luggage, trip_cancellation: CalendarX, medical_emergency: HeartPulse };

export function ClaimCompanion({ initialTripId }: { initialTripId?: string }) {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [coverage, setCoverage] = useState<Coverage | null>(null);
  const [existingClaims, setExistingClaims] = useState<Claim[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [type, setType] = useState<ClaimType>("flight_delay");
  const [incidentDate, setIncidentDate] = useState("");
  const [details, setDetails] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const trips = readCollection<Trip>(storageKeys.trips);
    const coverages = readCollection<Coverage>(storageKeys.coverages);
    const savedTrip = (initialTripId ? trips.find((item) => item.id === initialTripId) : trips.find((item) => coverages.some((coverageItem) => coverageItem.tripId === item.id))) ?? null;
    const savedCoverage = savedTrip ? coverages.find((item) => item.tripId === savedTrip.id) ?? null : null;
    setTrip(savedTrip);
    setCoverage(savedCoverage);
    setIncidentDate(savedTrip?.departureDate ?? "");
    setExistingClaims(savedTrip ? readCollection<Claim>(storageKeys.claims).filter((claim) => claim.tripId === savedTrip.id) : []);
    setLoaded(true);
  }, [initialTripId]);

  const currentType = claimTypeData[type];

  function changeType(nextType: ClaimType) {
    setType(nextType);
    setDetails("");
    setDocuments([]);
    setSummary("");
    setError("");
  }

  function toggleDocument(document: string) {
    setDocuments((current) => current.includes(document) ? current.filter((item) => item !== document) : [...current, document]);
  }

  function generateSummary() {
    if (!incidentDate || !details.trim()) {
      setError("Add the incident date and a brief factual description.");
      return;
    }
    setError("");
    setGenerating(true);
    window.setTimeout(() => {
      setSummary(buildClaimSummary({ type, incidentDate, details, documents }));
      setGenerating(false);
    }, 550);
  }

  function submitClaim() {
    if (!trip || !summary.trim()) return;
    const id = `claim-${typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Date.now()}`;
    const claim: Claim = { id, tripId: trip.id, coverageId: coverage?.id, type, incidentDate, details: details.trim(), documents, summary: summary.trim(), status: "submitted", createdAt: new Date().toISOString() };
    saveClaim(claim);
    router.push(`/claims/${id}`);
  }

  if (!loaded) return <><SiteHeader /><main id="main-content" className="loading-page"><div className="loading-mark" /><p>Opening claim companion…</p></main></>;
  if (!trip || !coverage) return <><SiteHeader /><main id="main-content" className="empty-page wrap"><FileText size={42} /><p className="eyebrow">NO DEMO COVERAGE FOUND</p><h1>Activate a fictional certificate first.</h1><p>The claim companion links each simulation to a demo trip and policy wallet on this device.</p><Link className="btn btn--primary btn--xl" href={trip ? `/protect?trip=${trip.id}` : "/trips"}>{trip ? "Activate demo protection" : "Open My Trips"}<ArrowRight size={17} /></Link></main><SiteFooter /></>;

  return (
    <><SiteHeader /><main id="main-content" className="claims-page wrap">
      <Link className="back-link dark" href={`/protect?trip=${trip.id}`}><ArrowLeft size={15} />Back to policy wallet</Link>
      <div className="claims-heading"><div><p className="eyebrow">AI CLAIM COMPANION · SIMULATION</p><h1>When something happens,<br />know what to do next.</h1><p>Organize a few facts, see initial steps, and prepare a demo claim summary for {trip.destination}.</p></div><div className="claim-policy-chip"><span>{coverage.policyId}</span><strong>Active demo · {trip.destination}</strong></div></div>
      <div className="claim-demo-warning"><ShieldAlert size={18} /><p><strong>Prototype only.</strong> Submitting this form does not create a real insurance claim.</p></div>

      {existingClaims.length > 0 && <section className="existing-claims"><p className="eyebrow">SAVED DEMO CLAIMS</p><div>{existingClaims.map((claim) => <Link key={claim.id} href={`/claims/${claim.id}`}><FileText size={16} /><span>{claimTypeData[claim.type].label}<small>{claim.status.replaceAll("_", " ")}</small></span><ArrowRight size={15} /></Link>)}</div></section>}

      <section className="claim-type-section"><p className="eyebrow">01 · WHAT HAPPENED?</p><div className="claim-type-grid">{(Object.keys(claimTypeData) as ClaimType[]).map((claimType) => {
        const Icon = claimIcons[claimType];
        return <button key={claimType} className={type === claimType ? "selected" : ""} onClick={() => changeType(claimType)} aria-pressed={type === claimType}><Icon size={23} /><span><strong>{claimTypeData[claimType].label}</strong><small>{claimTypeData[claimType].description}</small></span>{type === claimType && <CheckCircle2 size={17} />}</button>;
      })}</div></section>

      {type === "medical_emergency" && <div className="medical-banner" role="alert"><HeartPulse size={24} /><div><strong>Emergency first. This prototype cannot provide medical advice.</strong><p>{medicalEmergencyMessage}</p></div></div>}

      <div className="claim-workspace">
        <section className="claim-form-section">
          <p className="eyebrow">02 · RECORD THE FACTS</p><h2>{currentType.label}</h2><p>Only add what is needed for this demo. Do not enter identity numbers, payment details, or detailed medical information.</p>
          <div className="quick-replies"><span>Quick replies</span>{currentType.quickReplies.map((reply) => <button key={reply} onClick={() => setDetails(reply)}>{reply}</button>)}</div>
          <div className="field"><label htmlFor="incident-date">Incident date</label><input id="incident-date" type="date" value={incidentDate} onChange={(event) => setIncidentDate(event.target.value)} /></div>
          <div className="field"><label htmlFor="incident-details">Brief incident details</label><textarea id="incident-details" value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Describe only what happened, when, and any provider response…" maxLength={700} /></div>
          <fieldset className="document-checklist"><legend>Documents noted in this demo</legend><p>No file upload. Select the documents you would have available.</p>{currentType.documents.map((document) => <label key={document} className={documents.includes(document) ? "checked" : ""}><input type="checkbox" checked={documents.includes(document)} onChange={() => toggleDocument(document)} /><span>{documents.includes(document) && <Check size={14} />}</span>{document}</label>)}</fieldset>
          {error && <p className="field-error" role="alert">{error}</p>}
          <button className="btn btn--primary btn--xl" onClick={generateSummary} disabled={generating}>{generating ? <LoaderCircle className="spin" size={17} /> : <Sparkles size={17} />}{generating ? "Organizing your facts…" : "Generate claim summary"}</button>
        </section>
        <aside className="initial-steps"><p className="eyebrow">INITIAL STEPS</p><h3>Start with these actions.</h3><ol>{currentType.initialSteps.map((step, index) => <li key={step}><span>0{index + 1}</span><p>{step}</p></li>)}</ol><div className="human-note"><strong>Urgent or complex?</strong><p>You can request simulated human review after submitting the demo claim.</p></div></aside>
      </div>

      {summary && <section className="claim-summary-section"><div className="claim-summary-heading"><div><p className="eyebrow"><Sparkles size={14} />03 · REVIEW YOUR AI SUMMARY</p><h2>Edit anything before submitting.</h2><p>The local fallback reorganizes your facts. It does not add evidence or decide an outcome.</p></div><button className="text-link" onClick={generateSummary}>Regenerate</button></div>{type === "medical_emergency" && <div className="medical-banner" role="alert"><HeartPulse size={24} /><div><strong>Medical emergency</strong><p>{medicalEmergencyMessage}</p></div></div>}<label htmlFor="claim-summary">Editable claim summary</label><textarea id="claim-summary" value={summary} onChange={(event) => setSummary(event.target.value)} rows={12} /><div className="claim-submit-row"><p><strong>Submitting this form does not create a real insurance claim.</strong><br />AI-generated guidance — demo only</p><button className="btn btn--primary btn--xl" onClick={submitClaim}>Submit demo claim <ArrowRight size={17} /></button></div></section>}
    </main><SiteFooter /></>
  );
}

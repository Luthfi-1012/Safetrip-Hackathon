"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, FileText, HelpCircle, LoaderCircle, LockKeyhole, ShieldCheck, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { explainPolicy } from "@/lib/ai-fallback";
import { formatRupiah, protectionPlans } from "@/lib/plans";
import { calculateReadiness } from "@/lib/readiness";
import { getTripById, readCollection, saveCoverage, saveTrip, storageKeys, writeCollection } from "@/lib/storage";
import type { Coverage, PolicyExplanation, ProtectionPlan, Trip } from "@/types";

const quickQuestions = ["What does this plan cover?", "What are the exclusions?", "Does it include flight delay support?", "Is winter sports equipment fully covered?"];

export function ProtectionWorkspace({ initialTripId }: { initialTripId?: string }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [coverage, setCoverage] = useState<Coverage | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<ProtectionPlan["id"]>("complete");
  const [travelerName, setTravelerName] = useState("Demo Traveler");
  const [emergencyContact, setEmergencyContact] = useState("Demo emergency contact");
  const [consent, setConsent] = useState(false);
  const [activationError, setActivationError] = useState("");
  const [activating, setActivating] = useState(false);
  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState<PolicyExplanation | null>(null);
  const [explaining, setExplaining] = useState(false);

  useEffect(() => {
    const trips = readCollection<Trip>(storageKeys.trips);
    const savedTrip = (initialTripId ? getTripById(initialTripId) : trips[0]) ?? null;
    setTrip(savedTrip);
    if (savedTrip) {
      const assessment = calculateReadiness(savedTrip);
      setSelectedPlanId(assessment.recommendedPlanId);
      const savedCoverage = readCollection<Coverage>(storageKeys.coverages).find((item) => item.tripId === savedTrip.id) ?? null;
      if (savedCoverage) {
        setCoverage(savedCoverage);
        setSelectedPlanId(savedCoverage.planId);
        setTravelerName(savedCoverage.travelerName);
        setEmergencyContact(savedCoverage.emergencyContact ?? "Demo emergency contact");
      }
    }
    setLoaded(true);
  }, [initialTripId]);

  const assessment = useMemo(() => (trip ? calculateReadiness(trip) : null), [trip]);
  const selectedPlan = protectionPlans.find((plan) => plan.id === selectedPlanId)!;

  function activate(event: FormEvent) {
    event.preventDefault();
    if (!trip) return;
    if (!travelerName.trim()) {
      setActivationError("Add a display name for the demo certificate.");
      return;
    }
    if (!consent) {
      setActivationError("Confirm that you understand this is only a simulation.");
      return;
    }
    setActivationError("");
    setActivating(true);
    window.setTimeout(() => {
      const nextCoverage: Coverage = {
        id: `coverage-${typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Date.now()}`,
        tripId: trip.id,
        planId: selectedPlanId,
        policyId: `ST-DEMO-${String(Date.now()).slice(-6)}`,
        travelerName: travelerName.trim(),
        emergencyContact: emergencyContact.trim() || undefined,
        activatedAt: new Date().toISOString(),
        status: "active_demo",
      };
      saveCoverage(nextCoverage);
      saveTrip({ ...trip, status: "protected" });
      setTrip({ ...trip, status: "protected" });
      setCoverage(nextCoverage);
      const consentRecords = readCollection<{ tripId: string; acceptedAt: string }>(storageKeys.demoConsent);
      writeCollection(storageKeys.demoConsent, [...consentRecords.filter((item) => item.tripId !== trip.id), { tripId: trip.id, acceptedAt: new Date().toISOString() }]);
      setActivating(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  }

  function askPolicy(nextQuestion: string) {
    if (!nextQuestion.trim()) return;
    setQuestion(nextQuestion);
    setExplaining(true);
    window.setTimeout(() => {
      setExplanation(explainPolicy(selectedPlan, nextQuestion));
      setExplaining(false);
    }, 450);
  }

  if (!loaded) return <><SiteHeader /><main id="main-content" className="loading-page"><div className="loading-mark" /><p>Loading demo protection…</p></main></>;
  if (!trip || !assessment) return <><SiteHeader /><main id="main-content" className="empty-page wrap"><ShieldCheck size={42} /><p className="eyebrow">NO TRIP SELECTED</p><h1>Create a trip before comparing protection.</h1><p>Your readiness score helps highlight a demo package. It never determines eligibility or a real premium.</p><Link className="btn btn--primary btn--xl" href="/plan">Plan a trip <ArrowRight size={18} /></Link></main><SiteFooter /></>;

  return (
    <><SiteHeader /><main id="main-content" className="protection-page">
      <section className="protection-heading wrap">
        <Link className="back-link dark" href={`/trip/${trip.id}`}><ArrowLeft size={15} />Back to {trip.destination}</Link>
        <div className="protection-heading__row"><div><p className="eyebrow">POWERED BY IGLOO — PROTOTYPE SIMULATION</p><h1>{coverage ? "Your demo policy wallet." : "Protection, minus the fine-print fog."}</h1><p>{coverage ? "A fictional certificate saved on this device. No policy has been issued." : `Compare three fictional packages for your ${trip.destination} trip. Benefits, limits, and exclusions are all demo data.`}</p></div><div className="protection-trip-chip"><span>{trip.origin} → {trip.destination}</span><strong>Readiness {assessment.score}/100</strong></div></div>
      </section>

      {coverage ? <section className="certificate-section wrap">
        <div className="demo-certificate">
          <div className="certificate-top"><Logo inverse /><span><ShieldCheck size={16} />ACTIVE · DEMO</span></div>
          <div className="certificate-title"><p>TRIP PROTECTION CERTIFICATE</p><h2>{trip.destination}</h2><span>{trip.origin} → {trip.destination}</span></div>
          <div className="certificate-grid"><div><span>Policy ID</span><strong>{coverage.policyId}</strong></div><div><span>Demo package</span><strong>{selectedPlan.name}</strong></div><div><span>Traveler display name</span><strong>{coverage.travelerName}</strong></div><div><span>Travelers</span><strong>{trip.travelers}</strong></div><div><span>Trip dates</span><strong>{trip.departureDate} — {trip.returnDate}</strong></div><div><span>Activated</span><strong>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(coverage.activatedAt))}</strong></div></div>
          <div className="certificate-bottom"><p>This is a fictional demo certificate, not an insurance policy.</p><ShieldCheck size={34} /></div>
        </div>
        <div className="certificate-actions"><Link className="btn btn--primary btn--xl" href="/trips">Go to My Trips <ArrowRight size={17} /></Link><Link className="btn btn--secondary btn--xl" href={`/claims?trip=${trip.id}`}><FileText size={17} />Start a claim simulation</Link><p>No payment was taken. No real coverage is active.</p></div>
      </section> : <>
        <section className="plan-comparison wrap" id="package-details" aria-label="Compare fictional protection plans">
          {protectionPlans.map((plan) => {
            const recommended = assessment.recommendedPlanId === plan.id;
            const selected = selectedPlanId === plan.id;
            return <article className={`protection-plan${selected ? " selected" : ""}`} key={plan.id}>
              <div className="protection-plan__top">{recommended && <span className="recommended-badge"><Sparkles size={12} />RECOMMENDED FOR THIS DEMO</span>}<p className="plan-index">0{protectionPlans.indexOf(plan) + 1}</p><h2>{plan.name}</h2><p>{plan.description}</p><div className="plan-price"><strong>{formatRupiah(plan.price)}</strong><span>fictional / trip</span></div></div>
              <div className="plan-details"><div><h3><Check size={15} />Benefits</h3><ul>{plan.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></div><div><h3><FileText size={15} />Fictional limits</h3><ul>{plan.limits.map((limit) => <li key={limit}>{limit}</li>)}</ul></div><div className="exclusions"><h3><X size={15} />Exclusions</h3><ul>{plan.exclusions.map((exclusion) => <li key={exclusion}>{exclusion}</li>)}</ul></div></div>
              <button className={`btn ${selected ? "btn--primary" : "btn--secondary"}`} onClick={() => { setSelectedPlanId(plan.id); setExplanation(null); }} aria-pressed={selected}>{selected ? <CheckCircle2 size={17} /> : null}{selected ? `${plan.name} selected` : `Select ${plan.name}`}</button>
            </article>;
          })}
        </section>
        <section className="activation-section wrap">
          <div className="activation-intro"><p className="eyebrow">ACTIVATE THE SIMULATION</p><h2>A few demo details.<br />Nothing sensitive.</h2><p>Activation creates a fictional certificate and changes this trip to Protected in My Trips.</p><div className="activation-privacy"><LockKeyhole size={19} /><span>No identity number, payment card, medical record, or real contact details.</span></div></div>
          <form className="activation-form" onSubmit={activate}>
            <div className="selected-summary"><span>Selected package</span><strong>{selectedPlan.name}</strong><b>{formatRupiah(selectedPlan.price)} <small>fictional</small></b></div>
            <div className="field"><label htmlFor="traveler-name">Traveler display name</label><input id="traveler-name" value={travelerName} onChange={(event) => setTravelerName(event.target.value)} maxLength={60} /></div>
            <div className="field"><label htmlFor="emergency-contact">Emergency contact label <span>(dummy)</span></label><input id="emergency-contact" value={emergencyContact} onChange={(event) => setEmergencyContact(event.target.value)} maxLength={60} /></div>
            <div className="traveler-count"><span>Travelers</span><strong>{trip.travelers} · from your trip details</strong></div>
            <label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I understand this is a prototype simulation. No payment, policy issuance, eligibility decision, or real insurance coverage occurs.</span></label>
            {activationError && <p className="field-error" role="alert">{activationError}</p>}
            <button className="btn btn--primary btn--xl" type="submit" disabled={activating}>{activating ? <LoaderCircle className="spin" size={18} /> : <ShieldCheck size={18} />}{activating ? "Creating demo certificate…" : `Activate ${selectedPlan.name} demo`}</button>
            <p className="activation-legal">Powered by Igloo — prototype simulation. No real policy will be issued.</p>
          </form>
        </section>
      </>}

      <section className="policy-explainer wrap">
        <div className="policy-explainer__intro"><p className="eyebrow"><Sparkles size={14} />AI POLICY EXPLAINER</p><h2>Ask about {selectedPlan.name}.</h2><p>Answers use only this package’s fictional benefits and exclusions. Unknown details trigger an explicit guardrail.</p><div className="quick-questions">{quickQuestions.map((item) => <button key={item} onClick={() => askPolicy(item)}><HelpCircle size={14} />{item}</button>)}</div></div>
        <div className="policy-explainer__workspace">
          <form onSubmit={(event) => { event.preventDefault(); askPolicy(question); }}><label htmlFor="policy-question">Your question</label><div><input id="policy-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a benefit or exclusion…" /><button className="btn btn--primary" type="submit" disabled={explaining || !question.trim()}>{explaining ? <LoaderCircle className="spin" size={16} /> : <ArrowRight size={16} />}<span className="sr-only">Ask policy explainer</span></button></div></form>
          <div className="policy-answer" aria-live="polite">{explaining ? <div className="answer-loading"><LoaderCircle className="spin" size={23} /><p>Checking local package data…</p></div> : explanation ? <><div className="answer-section"><h3>Ringkasan</h3><p>{explanation.summary}</p></div>{explanation.example && <div className="answer-section"><h3>Contoh sederhana</h3><p>{explanation.example}</p></div>}{explanation.checks.length > 0 && <div className="answer-section"><h3>Hal yang perlu diperiksa</h3><ul>{explanation.checks.map((check) => <li key={check}>{check}</li>)}</ul></div>}</> : <div className="answer-placeholder"><Sparkles size={25} /><p>Choose a quick question or write your own.</p></div>}</div>
          <p className="ai-disclaimer">AI-generated guidance — demo only · <a href="#package-details">View package details dummy</a></p>
        </div>
      </section>
    </main><SiteFooter /></>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronUp, Circle, Clock3, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import { getTripAdvisorGuidance } from "@/lib/ai-fallback";
import { generateItinerary } from "@/lib/itineraries";
import { protectionPlans } from "@/lib/plans";
import { calculateReadiness } from "@/lib/readiness";
import { getTripById, readCollection, storageKeys, writeCollection } from "@/lib/storage";
import type { Trip } from "@/types";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

type Tab = "itinerary" | "readiness" | "advisor";
type ChecklistState = { tripId: string; completedIds: string[] };

const factorPoints: Record<string, number> = {
  "International travel": 20,
  "More than 7 days": 10,
  "3+ travelers": 8,
  Hiking: 10,
  "Adventure activities": 15,
  "Winter sports": 18,
  "Family trip": 5,
};

function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", options ?? { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00.000Z`));
}

export function TripWorkspace({ tripId }: { tripId: string }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("itinerary");
  const [showAll, setShowAll] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [advice, setAdvice] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const savedTrip = getTripById(tripId) ?? null;
    setTrip(savedTrip);
    if (savedTrip) {
      const states = readCollection<ChecklistState>(storageKeys.checklists);
      setCompletedIds(states.find((state) => state.tripId === tripId)?.completedIds ?? []);
    }
    setLoaded(true);
  }, [tripId]);

  const assessment = useMemo(() => (trip ? calculateReadiness(trip) : null), [trip]);
  const itinerary = useMemo(() => (trip ? generateItinerary(trip) : []), [trip]);
  const recommendedPlan = assessment ? protectionPlans.find((plan) => plan.id === assessment.recommendedPlanId)! : null;

  function toggleChecklist(id: string) {
    if (!trip) return;
    const nextCompleted = completedIds.includes(id) ? completedIds.filter((item) => item !== id) : [...completedIds, id];
    setCompletedIds(nextCompleted);
    const states = readCollection<ChecklistState>(storageKeys.checklists);
    const nextStates = [...states.filter((state) => state.tripId !== trip.id), { tripId: trip.id, completedIds: nextCompleted }];
    writeCollection(storageKeys.checklists, nextStates);
  }

  function generateAdvice() {
    if (!trip || !assessment || !recommendedPlan) return;
    setGenerating(true);
    window.setTimeout(() => {
      const result = getTripAdvisorGuidance(trip, assessment, recommendedPlan);
      setAdvice(result);
      setGenerating(false);
      const history = readCollection<{ id: string; tripId: string; content: string; createdAt: string }>(storageKeys.aiHistory);
      writeCollection(storageKeys.aiHistory, [
        ...history,
        { id: `advice-${Date.now()}`, tripId: trip.id, content: result, createdAt: new Date().toISOString() },
      ]);
    }, 650);
  }

  if (!loaded) {
    return <><SiteHeader /><main id="main-content" className="loading-page"><div className="loading-mark" /><p>Opening your trip…</p></main></>;
  }

  if (!trip || !assessment || !recommendedPlan) {
    return (
      <><SiteHeader /><main id="main-content" className="empty-page wrap"><ShieldCheck size={42} /><p className="eyebrow">TRIP NOT FOUND</p><h1>This trip isn’t saved on this device.</h1><p>Create a new demo trip. It will stay in this browser’s localStorage.</p><Link className="btn btn--primary btn--xl" href="/plan">Plan a trip <ArrowRight size={18} /></Link></main><SiteFooter /></>
    );
  }

  const visibleDays = showAll ? itinerary : itinerary.slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="trip-page">
        <section className="trip-hero">
          <img src={trip.destination.toLowerCase() === "tokyo" ? "/images/tokyo.jpg" : "/images/japan-hero.jpg"} alt="" aria-hidden="true" />
          <div className="trip-hero__shade" />
          <div className="wrap trip-hero__content">
            <Link className="back-link" href="/trips"><ArrowLeft size={15} /> My trips</Link>
            <div className="trip-hero__title"><div><p className="eyebrow">YOUR TRIP WORKSPACE</p><h1>{trip.destination}</h1><p>{trip.origin} <ArrowRight size={15} /> {trip.destination}</p></div><span className={`status-chip status-chip--${trip.status}`}><i />{trip.status === "protected" ? "Protected · demo" : "Planning"}</span></div>
            <div className="trip-meta">
              <span><CalendarDays size={17} />{formatDate(trip.departureDate, { day: "numeric", month: "short" })} — {formatDate(trip.returnDate)}</span>
              <span><Users size={17} />{trip.travelers} travelers · {trip.tripType}</span>
              <span><MapPin size={17} />{trip.activities.length} planned activities</span>
            </div>
          </div>
        </section>

        <div className="trip-tabs-wrap">
          <div className="trip-tabs wrap" role="tablist" aria-label="Trip workspace sections">
            <button role="tab" aria-selected={tab === "itinerary"} onClick={() => setTab("itinerary")}><CalendarDays size={17} />Itinerary</button>
            <button role="tab" aria-selected={tab === "readiness"} onClick={() => setTab("readiness")}><ShieldCheck size={17} />Readiness <span>{assessment.score}</span></button>
            <button role="tab" aria-selected={tab === "advisor"} onClick={() => setTab("advisor")}><Sparkles size={17} />AI Advisor</button>
            <Link className="btn btn--primary" href={`/protect?trip=${trip.id}`}>{trip.status === "protected" ? "View protection" : "Protect this trip"}<ArrowRight size={16} /></Link>
          </div>
        </div>

        {tab === "itinerary" && (
          <section className="trip-content wrap" role="tabpanel">
            <div className="trip-content__heading"><div><p className="eyebrow">YOUR DAY-BY-DAY PLAN</p><h2>{itinerary.length} days, thoughtfully paced.</h2><p>A deterministic demo itinerary built from your destination, dates, and selected activities.</p></div><span className="outline-chip"><Clock3 size={15} />Local time at destination</span></div>
            <div className="itinerary-layout">
              <div className="itinerary-timeline">
                {visibleDays.map((day) => (
                  <article className="itinerary-day" key={day.day}>
                    <div className="itinerary-day__rail"><span>{day.day}</span><i /></div>
                    <div className="itinerary-day__body">
                      <p className="itinerary-date">{formatDate(day.date, { weekday: "long", day: "numeric", month: "long" })}</p>
                      <div className="itinerary-day__main"><div><h3>{day.title}</h3><p>{day.description}</p>{day.title.includes("Winter") && <span className="activity-alert"><ShieldCheck size={14} />Activity-specific preparation included</span>}</div>{day.title.includes("Winter") && <div className="itinerary-thumb m-zoom"><img src={day.image} alt="Snowy ski resort prepared for a winter activity day" /></div>}</div>
                    </div>
                  </article>
                ))}
                {itinerary.length > 4 && <button className="show-days" onClick={() => setShowAll((current) => !current)}>{showAll ? <ChevronUp size={17} /> : <ChevronDown size={17} />}{showAll ? "Show fewer days" : `Show all ${itinerary.length} days`}</button>}
              </div>
              <aside className="trip-side-card">
                <p className="eyebrow">BEFORE YOU GO</p><h3>Your readiness at a glance.</h3>
                <div className="mini-score"><strong>{assessment.score}</strong><span>/100<br />{assessment.level} preparation</span></div>
                <div className="mini-score-bar"><i style={{ width: `${assessment.score}%` }} /></div>
                <p>{assessment.factors.length} factors shape this transparent demo score.</p>
                <button className="text-link" onClick={() => setTab("readiness")}>See factors & checklist <ArrowRight size={15} /></button>
              </aside>
            </div>
          </section>
        )}

        {tab === "readiness" && (
          <section className="trip-content wrap" role="tabpanel">
            <div className="trip-content__heading"><div><p className="eyebrow">TRAVEL READINESS SCORE</p><h2>Know what needs attention.</h2><p>A simple preparation signal — not a premium, eligibility, underwriting, or safety decision.</p></div></div>
            <div className="readiness-layout">
              <div className="score-card">
                <div className="score-ring" style={{ background: `conic-gradient(#0d716f ${assessment.score * 3.6}deg, #dfe8e3 0deg)` }}><div><strong>{assessment.score}</strong><span>out of 100</span></div></div>
                <h3>{assessment.level === "high" ? "High preparation" : assessment.level === "moderate" ? "Moderate preparation" : "Lower preparation"}</h3>
                <p>Your trip has a few factors worth preparing for. Start with the checklist, then compare demo protection.</p>
                <div className="recommendation-line"><Sparkles size={17} /><span>Recommended in this demo</span><strong>{recommendedPlan.name}</strong></div>
                <Link className="btn btn--primary btn--xl" href={`/protect?trip=${trip.id}`}>View protection <ArrowRight size={17} /></Link>
              </div>
              <div className="factor-card">
                <p className="eyebrow">HOW YOUR SCORE IS BUILT</p><h3>Starting at 20, each factor adds points.</h3>
                <div className="factor-list"><div><span>Base score</span><strong>+20</strong></div>{assessment.factors.map((factor) => <div key={factor}><span>{factor}</span><strong>+{factorPoints[factor]}</strong></div>)}</div>
                <p className="calculation-note">Total is capped between 0 and 100. Low: 0–39 · Moderate: 40–64 · High: 65–100.</p>
              </div>
            </div>
            <div className="checklist-card">
              <div><p className="eyebrow">YOUR PREPARATION CHECKLIST</p><h3>{completedIds.length} of {assessment.checklist.length} complete</h3></div>
              <div className="checklist-items">
                {assessment.checklist.map((item) => {
                  const checked = completedIds.includes(item.id);
                  return <label key={item.id} className={checked ? "checked" : ""}><input type="checkbox" checked={checked} onChange={() => toggleChecklist(item.id)} />{checked ? <CheckCircle2 size={20} /> : <Circle size={20} />}<span>{item.label}</span></label>;
                })}
              </div>
            </div>
          </section>
        )}

        {tab === "advisor" && (
          <section className="trip-content wrap" role="tabpanel">
            <div className="trip-content__heading"><div><p className="eyebrow">AI TRAVEL PROTECTION ADVISOR</p><h2>A clearer next step, in plain language.</h2><p>Uses only your trip details, readiness factors, and fictional local package data.</p></div></div>
            <div className="advisor-layout">
              <div className="advisor-context">
                <div className="advisor-mark"><Sparkles size={25} /></div><h3>What the advisor considers</h3>
                <ul><li><Check size={15} />{trip.destination} · {itinerary.length} days</li><li><Check size={15} />{trip.travelers} travelers · {trip.tripType}</li><li><Check size={15} />{trip.activities.map((activity) => activity.replace("_", " ")).join(", ")}</li><li><Check size={15} />Readiness {assessment.score}/100 · {recommendedPlan.name}</li></ul>
                <p>No external AI provider is called in this offline prototype.</p>
              </div>
              <div className="advisor-answer">
                {!advice ? <div className="advisor-empty"><Sparkles size={32} /><h3>Ready to explain your recommendation.</h3><p>Generate concise Bahasa Indonesia guidance with reasons and three things to check.</p><button className="btn btn--primary btn--xl" onClick={generateAdvice} disabled={generating}>{generating ? "Preparing guidance…" : "Generate trip advice"}{!generating && <ArrowRight size={17} />}</button></div> : <div className="generated-guidance"><div className="generated-guidance__top"><span><Sparkles size={15} />SAFETRIP AI</span><button onClick={generateAdvice} disabled={generating}>Regenerate</button></div><p>{advice}</p></div>}
                <p className="ai-disclaimer">AI-generated guidance — demo only</p>
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

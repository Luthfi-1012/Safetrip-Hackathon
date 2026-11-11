import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Check, Database, FileCheck2, LockKeyhole, ShieldAlert, ShieldCheck, Sparkles, X } from "lucide-react";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

export const metadata: Metadata = { title: "How AI works" };

const boundaries = [
  { title: "It organizes your trip", text: "The advisor uses your destination, dates, travelers, activities, readiness factors, and the recommended fictional package.", icon: BrainCircuit },
  { title: "It explains only known package data", text: "The policy explainer reads local benefits and exclusions. If the answer is not there, it says so instead of inventing coverage.", icon: FileCheck2 },
  { title: "It helps record an incident", text: "The claim companion structures your facts and selected document labels into an editable, neutral chronology.", icon: Sparkles },
];

export default function TransparencyPage() {
  return (
    <><SiteHeader /><main id="main-content" className="transparency-page">
      <section className="transparency-hero"><div className="wrap"><p className="eyebrow"><ShieldCheck size={15} />AI TRANSPARENCY</p><h1>Useful guidance.<br />Visible guardrails.</h1><p>SafeTrip is a front-end prototype. Its “AI” experiences are deterministic local fallbacks designed to demonstrate safe behavior without an external provider.</p><span>AI-generated guidance — demo only</span></div></section>
      <section className="transparency-section wrap"><div className="transparency-section__heading"><p className="eyebrow">WHAT THE PROTOTYPE DOES</p><h2>Three tasks. One limited source of truth.</h2><p>AI uses the trip details you enter and fictional package data in this prototype.</p></div><div className="transparency-cards">{boundaries.map((item, index) => { const Icon = item.icon; return <article key={item.title}><span>0{index + 1}</span><Icon size={25} /><h3>{item.title}</h3><p>{item.text}</p></article>; })}</div></section>
      <section className="limits-section" id="limits"><div className="wrap limits-layout"><div><p className="eyebrow"><ShieldAlert size={14} />WHAT IT NEVER DOES</p><h2>No automated decisions.<br />No invented certainty.</h2><p>AI does not issue policies, calculate real premiums, determine eligibility, or approve claims.</p><p>For urgent or complex cases, request human review.</p></div><div className="limits-list"><div><X size={18} /><span><strong>No real insurance or claims</strong><small>No underwriting, payment, policy issuance, claim decision, or provider submission.</small></span></div><div><X size={18} /><span><strong>No medical, legal, or insurance advice</strong><small>Medical emergencies always point to local emergency services first.</small></span></div><div><X size={18} /><span><strong>No fabricated benefits</strong><small>Unknown policy details return the exact out-of-data guardrail.</small></span></div><div><Check size={18} /><span><strong>A demo status you can understand</strong><small>Submitted and human review requested are neutral local states, never outcomes.</small></span></div></div></div></section>
      <section className="transparency-section wrap" id="data"><div className="data-layout"><div><p className="eyebrow"><LockKeyhole size={14} />YOUR LOCAL DATA</p><h2>Your browser is the database.</h2><p>No account, server upload, external AI request, or client-side API key is used. Do not enter identity numbers, payment cards, detailed medical records, or other sensitive data.</p><div className="data-assurance"><Database size={19} /><span>Clearing this browser’s site data removes the prototype’s trips, coverage, claims, and history.</span></div></div><div className="storage-table"><div><span>Storage key</span><span>What it holds</span></div>{[["safetrip.trips", "Demo trip details"], ["safetrip.coverages", "Fictional certificates"], ["safetrip.claims", "Demo claim summaries"], ["safetrip.checklists", "Checklist progress"], ["safetrip.ai-history", "Local advisor responses"], ["safetrip.demo-consent", "Demo acknowledgement"]].map(([key, value]) => <div key={key}><code>{key}</code><span>{value}</span></div>)}</div></div></section>
      <section className="transparency-cta wrap"><div><p className="eyebrow">SEE THE GUARDRAILS IN ACTION</p><h2>Try the Tokyo demo.</h2><p>Generate advice, ask an unknown policy question, or run a neutral claim simulation.</p></div><Link className="btn btn--primary btn--xl" href="/plan">Plan my trip <ArrowRight size={17} /></Link></section>
    </main><SiteFooter /></>
  );
}

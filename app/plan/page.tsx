import type { Metadata } from "next";
import { CalendarDays, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { TripSearchForm } from "@/components/landing/trip-search-form";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

export const metadata: Metadata = { title: "Plan your trip" };

export default function PlanPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="plan-page">
        <section className="plan-intro wrap">
          <div className="eyebrow"><Sparkles size={15} aria-hidden="true" /> AI-assisted trip preparation</div>
          <h1>One trip. A clearer way to prepare.</h1>
          <p>Tell us the shape of your journey. SafeTrip builds a practical itinerary, a readiness score, and a protection comparison — all in your browser.</p>
        </section>
        <section className="planner-layout wrap" aria-label="Trip planner">
          <div className="planner-card">
            <div className="planner-card__heading">
              <span>01</span>
              <div><h2>Your trip details</h2><p>The Tokyo demo is ready. Edit anything you like.</p></div>
            </div>
            <TripSearchForm />
          </div>
          <aside className="planner-aside">
            <div className="planner-aside__image m-zoom">
              <img src="/images/tokyo.jpg" alt="Tokyo Tower and the city skyline at night" />
              <span><MapPin size={14} aria-hidden="true" /> Demo destination · Tokyo</span>
            </div>
            <div className="planner-aside__content">
              <p className="eyebrow">What happens next</p>
              <ol className="next-steps">
                <li><CalendarDays size={20} aria-hidden="true" /><div><strong>See your days clearly</strong><span>A deterministic, editable-style itinerary for your dates.</span></div></li>
                <li><ShieldCheck size={20} aria-hidden="true" /><div><strong>Understand your readiness</strong><span>Transparent factors, not an insurance eligibility decision.</span></div></li>
                <li><Sparkles size={20} aria-hidden="true" /><div><strong>Ask a local AI advisor</strong><span>Guardrailed demo guidance with its limits in view.</span></div></li>
              </ol>
              <p className="local-note">Saved only to this browser’s localStorage. No account or external API required.</p>
            </div>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

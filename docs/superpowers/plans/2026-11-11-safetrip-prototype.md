# SafeTrip Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic, responsive SafeTrip demo that completes trip planning, readiness assessment, simulated protection activation, policy storage, and simulated claims without external services.

**Architecture:** Next.js App Router renders a small set of routes backed by browser localStorage. Pure TypeScript modules own validation, itinerary generation, readiness rules, fictional plan data, and deterministic AI fallback responses; client components own interaction and persistence.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, customized shadcn-style UI primitives, Lucide icons, Vitest for domain tests, localStorage.

**Spec:** User-approved design in this session plus `D:/Downloads/PRD.md`, `USER_FLOWS.md`, `DESIGN_SYSTEM.md`, `DATA_MODEL.md`, `AI_SPEC.md`, `TECHNICAL_PLAN.md`, `DISCLAIMER.md`, and `DEMO_SCRIPT.md`.

## Global Constraints

- All prices, benefits, policy IDs, certificates, coverage, and claim statuses are fictional demo data.
- Use `Powered by Igloo — prototype simulation`; never use an official Igloo logo or imply affiliation/integration.
- AI is educational guidance only: no underwriting, real premiums, eligibility decisions, medical advice, or claim approval/rejection.
- Never request payment details, official identity numbers, or detailed medical data.
- Every AI output shows `AI-generated guidance — demo only` and works through deterministic local fallbacks without API keys.
- Use the specified localStorage keys: `safetrip.trips`, `safetrip.coverages`, `safetrip.claims`, `safetrip.checklists`, `safetrip.ai-history`, `safetrip.demo-consent`.
- Visual direction: cinematic full-bleed Japan photography, oversized editorial typography, deep navy, ocean/aqua accents, warm sand highlights, thin rules, glass surfaces, image-led itinerary timeline.
- Responsive at 375px and 1440px; explicit labels, visible focus, accessible errors, reduced-motion support.
- No login, production backend, payment, external travel/insurance APIs, or new dependencies beyond this plan.
- This directory is not a git repository; verification steps replace commit steps.

## Review Focus

- Past dates, same-day returns, and durations over 60 days must produce accessible form errors; covered by Task 1 validation tests and Task 2 browser checks.
- Corrupt or unavailable localStorage must fall back to empty collections instead of crashing; covered by Task 1 storage tests.
- Missing trip/claim IDs and trips without active demo coverage must show useful empty/error states; covered by Tasks 3–5 browser checks.
- Medical emergency claims must show the emergency banner before and after summary generation; covered by Task 5 tests and browser checks.
- Policy questions outside fictional benefits/exclusions must return the exact guardrail response; covered by Task 4 explainer tests.

---

### Task 1: Foundation and Tested Domain Rules

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `next-env.d.ts`, `vitest.config.ts`, `.gitignore`
- Create: `app/layout.tsx`, `app/globals.css`
- Create: `types/index.ts`
- Create: `lib/validation.ts`, `lib/readiness.ts`, `lib/itineraries.ts`, `lib/plans.ts`, `lib/storage.ts`, `lib/demo-data.ts`
- Test: `lib/validation.test.ts`, `lib/readiness.test.ts`, `lib/itineraries.test.ts`, `lib/storage.test.ts`

**Interfaces:**
- Produces: `Trip`, `TripDraft`, `ReadinessAssessment`, `ProtectionPlan`, `Coverage`, `Claim`, and supporting unions from `types/index.ts`.
- Produces: `validateTripDraft(draft: TripDraft, today?: string): Record<string, string>`.
- Produces: `calculateReadiness(trip: Trip): ReadinessAssessment` using the exact score rules and plan thresholds from the spec.
- Produces: `generateItinerary(trip: Trip): ItineraryDay[]` with deterministic destination-aware demo entries.
- Produces: `readCollection<T>(key: string): T[]`, `writeCollection<T>(key: string, value: T[]): void`, and typed trip/coverage/claim helpers.

- [ ] **Step 1: Write failing domain tests** for the domestic-short Basic case, Tokyo 11-day couple winter-sports Complete case (score 68), family/traveler/activity score additions, level boundaries, invalid dates, >60-day warning, deterministic itinerary length, and malformed stored JSON.
- [ ] **Step 2: Run tests and verify failure** with `npm test`; expected failure because the domain modules do not exist.
- [ ] **Step 3: Scaffold Next.js/Tailwind/Vitest and implement the domain modules** with the exact interfaces and score values above. Storage helpers guard `window`, JSON parsing, and array shape.
- [ ] **Step 4: Run `npm test` and `npm run typecheck`**; expected all tests pass and TypeScript reports no errors.

### Task 2: Cinematic Landing Page and Trip Creation

**Files:**
- Create: `app/page.tsx`, `app/plan/page.tsx`
- Create: `components/shared/site-header.tsx`, `components/shared/site-footer.tsx`, `components/shared/prototype-disclaimer.tsx`
- Create: `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/field.tsx`, `components/ui/badge.tsx`
- Create: `components/landing/trip-search-form.tsx`, `components/landing/landing-experience.tsx`
- Test: `components/landing/trip-search-form.test.tsx` using `react-dom/server` for static render assertions.
- Create: `public/images/*` from properly sourced travel photographs.

**Interfaces:**
- Consumes: Task 1 validation, trip types, and storage helpers.
- Produces: `TripSearchForm` with controlled fields, inline errors, activity multi-selection, submit loading state, and navigation to `/trip/[id]`.

- [ ] **Step 1: Add a failing landing render/domain integration check** confirming required labels, the `Plan my trip` CTA, and the five activity options.
- [ ] **Step 2: Run the test and verify failure**, then implement the shared visual system and landing page.
- [ ] **Step 3: Implement the hero and form** with a full-screen photographic hero, large `Travel further. Worry less.` headline, glass trip planner, three-step story, AI transparency summary, and global prototype footer.
- [ ] **Step 4: Implement submit behavior** so valid input persists a Planning trip and routes to its detail; empty fields, past departure, return not after departure, and >60 days show inline errors.
- [ ] **Step 5: Run tests/typecheck and browser-check 375px/1440px**; all fields and CTAs remain usable and no horizontal overflow appears.

### Task 3: Trip Detail, Itinerary, Readiness, and AI Advisor

**Files:**
- Create: `app/trip/[id]/page.tsx`
- Create: `components/trip/trip-dashboard.tsx`, `components/trip/trip-summary.tsx`, `components/trip/itinerary-timeline.tsx`, `components/trip/readiness-card.tsx`, `components/trip/preparation-checklist.tsx`
- Create: `components/ai/ai-advisor-card.tsx`, `components/ai/ai-label.tsx`, `lib/ai-fallback.ts`
- Test: `lib/ai-fallback.test.ts`

**Interfaces:**
- Consumes: `Trip`, `calculateReadiness`, `generateItinerary`, `protectionPlans`, storage helpers.
- Produces: `buildAdvisorFallback(trip: Trip, assessment: ReadinessAssessment): string`, maximum 120 words with the exact required closing sentence.

- [ ] **Step 1: Write failing advisor tests** for recommendation sections, Indonesian destination/duration content, required closing, and the 120-word limit.
- [ ] **Step 2: Run the test and verify failure**, then implement the deterministic fallback and short loading state.
- [ ] **Step 3: Build trip detail** with route/date/traveler summary, image-led vertical itinerary, score dial, Low/Moderate/High preparation need, transparent factor chips, and persisted interactive checklist.
- [ ] **Step 4: Add the AI Advisor and `View protection` CTA**, plus a recoverable missing-trip state.
- [ ] **Step 5: Run tests/typecheck and browser-check Jakarta→Tokyo demo data**; expected score 68, High preparation need, Complete recommendation, and checklist persistence after reload.

### Task 4: Protection Comparison, Activation, Policy Wallet, and My Trips

**Files:**
- Create: `app/protect/page.tsx`, `app/trips/page.tsx`
- Create: `components/protection/plan-card.tsx`, `components/protection/plan-comparison.tsx`, `components/protection/protection-flow.tsx`, `components/protection/policy-wallet-card.tsx`
- Create: `components/ai/policy-explainer.tsx`, `components/trips/my-trips.tsx`
- Modify: `lib/ai-fallback.ts`, `lib/ai-fallback.test.ts`

**Interfaces:**
- Produces: `explainPlan(plan: ProtectionPlan, question: string): PolicyExplanation` with `Ringkasan`, `Contoh sederhana`, and `Hal yang perlu diperiksa` sections.
- Produces: activation requiring display name, demo consent, and selected plan; writes `Coverage`, changes trip status to Protected, and opens `/trips?trip=[id]&policy=[coverageId]`.

- [ ] **Step 1: Write failing explainer tests** for benefits, exclusions, document guidance, and the exact out-of-data guardrail sentence.
- [ ] **Step 2: Run tests and verify failure**, then implement the local explainer.
- [ ] **Step 3: Build protection comparison** with Basic Rp29.000, Explorer Rp59.000, Complete Rp99.000, accessible comparison details, recommendation highlight, Igloo prototype label, and disclaimers.
- [ ] **Step 4: Build simulated activation and My Trips** with simple traveler details, no sensitive fields, fictional policy ID, policy certificate disclaimer, Planning/Protected/Completed cards, useful empty state, and reload persistence.
- [ ] **Step 5: Add Policy Explainer quick questions and custom-question fallback**, then run tests/typecheck and browser-check select→activate→reload→policy visible.

### Task 5: Claim Companion, Transparency, and Full Demo QA

**Files:**
- Create: `app/claims/page.tsx`, `app/claims/[id]/page.tsx`, `app/transparency/page.tsx`
- Create: `components/claims/claim-center.tsx`, `components/claims/claim-type-card.tsx`, `components/claims/claim-form.tsx`, `components/claims/claim-timeline.tsx`, `components/claims/claim-detail.tsx`
- Modify: `lib/ai-fallback.ts`, `lib/ai-fallback.test.ts`

**Interfaces:**
- Produces: `buildClaimSummary(input: ClaimSummaryInput): string` with `Kronologi singkat`, `Dokumen yang dicatat`, and `Informasi yang mungkin masih diperlukan`.
- Produces: four claim types with the exact document checklists from `AI_SPEC.md`, editable summary, Submitted status, and simulated Human review requested transition.

- [ ] **Step 1: Write failing claim-summary tests** proving facts are preserved, no outcome is promised, all sections exist, and medical emergency guidance is present.
- [ ] **Step 2: Run tests and verify failure**, then implement claim helpers and local summary generation.
- [ ] **Step 3: Build Claim Center** for protected trips with case selection, small incident form, quick replies, initial steps, document checklist, emergency banner, editable summary, submit disclaimer, and loading/error states.
- [ ] **Step 4: Build claim detail timeline and human-review simulation**, AI transparency page, and navigation/footer links.
- [ ] **Step 5: Run `npm test`, `npm run typecheck`, and `npm run build`**; expected all pass with no TypeScript/build errors.
- [ ] **Step 6: Execute the complete browser demo at 375px and 1440px**: validate empty form; create Tokyo trip; verify score/advisor; select Complete; activate; reload policy; ask policy questions; submit flight-delay and medical-emergency claims; request human review; check keyboard focus, console errors, empty/missing-ID states, and all mandatory disclaimers.

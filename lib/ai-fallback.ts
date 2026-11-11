import type { PolicyExplanation, ProtectionPlan, ReadinessAssessment, Trip } from "@/types";
import { protectionPlans } from "./plans";

const activityLabels: Record<Trip["activities"][number], string> = {
  city: "city exploration",
  beach: "beach",
  hiking: "hiking",
  adventure: "adventure",
  winter_sports: "winter sports",
};

const factorLabels: Record<string, string> = {
  "International travel": "perjalanan internasional",
  "More than 7 days": "durasi lebih dari 7 hari",
  "3+ travelers": "jumlah pelancong",
  Hiking: "hiking",
  "Adventure activities": "aktivitas adventure",
  "Winter sports": "winter sports",
  "Family trip": "perjalanan keluarga",
};

export function getTripAdvisorGuidance(trip: Trip, assessment: ReadinessAssessment, plan: ProtectionPlan) {
  const duration = Math.round(
    (new Date(`${trip.returnDate}T00:00:00.000Z`).getTime() - new Date(`${trip.departureDate}T00:00:00.000Z`).getTime()) /
      86_400_000,
  ) + 1;
  const activities = trip.activities.map((activity) => activityLabels[activity]).join(" dan ");
  const factors = assessment.factors.map((factor) => factorLabels[factor] ?? factor.toLowerCase()).join(", ");
  const reason = factors || "kombinasi destinasi, durasi, dan aktivitas yang Anda pilih";

  return `Rekomendasi\nPaket ${plan.name} direkomendasikan dalam demo ini.\n\nAlasannya\nPerjalanan ke ${trip.destination} selama ${duration} hari dengan ${activities} memiliki level persiapan ${assessment.level}. Rekomendasi ini berdasarkan ${reason}.\n\nYang perlu diperiksa\n1. Manfaat dan limit fiktif paket.\n2. Pengecualian untuk aktivitas yang direncanakan.\n3. Dokumen perjalanan dan kontak bantuan lokal.\n\nIni panduan AI untuk demo; perlindungan nyata mengikuti syarat polis dan verifikasi pihak terkait.`;
}

const policyGuardrail = "Informasi itu tidak tersedia pada data prototype ini. Untuk perlindungan nyata, konfirmasikan wording polis dan ketentuannya kepada penyedia resmi.";

function resolveBenefits(plan: ProtectionPlan): string[] {
  const inherited = plan.benefits.flatMap((benefit) => {
    if (benefit === "Everything in Basic") return resolveBenefits(protectionPlans.find((item) => item.id === "basic")!);
    if (benefit === "Everything in Explorer") return resolveBenefits(protectionPlans.find((item) => item.id === "explorer")!);
    return [benefit];
  });
  return [...new Set(inherited)];
}

export function explainPolicy(plan: ProtectionPlan, question: string): PolicyExplanation {
  const normalized = question.toLowerCase();
  const benefits = resolveBenefits(plan);
  const checks = plan.exclusions.slice(0, 3);

  if (/exclusion|not covered|pengecualian|tidak ditanggung/.test(normalized)) {
    return {
      summary: `Paket ${plan.name} mencantumkan pengecualian dummy: ${plan.exclusions.join(", ")}.`,
      example: "Contoh hypothetical: sebuah kondisi yang tercantum dalam pengecualian perlu diperiksa terhadap wording resmi, bukan diasumsikan masuk perlindungan.",
      checks: ["Baca aktivitas yang tidak dideklarasikan.", "Periksa dokumen pendukung.", "Konfirmasikan wording kepada penyedia resmi."],
    };
  }

  const topics = [
    { pattern: /flight|delay|penerbangan|keterlambatan/, benefit: "flight delay" },
    { pattern: /baggage|bagasi/, benefit: "baggage" },
    { pattern: /cancellation|pembatalan/, benefit: "cancellation" },
    { pattern: /medical|medis/, benefit: "medical emergency" },
    { pattern: /winter|ski|snow/, benefit: "winter sports" },
    { pattern: /hiking/, benefit: "hiking" },
    { pattern: /concierge/, benefit: "concierge" },
  ];
  const topic = topics.find((item) => item.pattern.test(normalized));

  if (topic) {
    const matched = benefits.find((benefit) => benefit.toLowerCase().includes(topic.benefit));
    if (!matched) return { summary: policyGuardrail, example: "", checks: [] };
    return {
      summary: `Paket ${plan.name} mencantumkan manfaat dummy: ${matched}. Data ini tidak menjelaskan keputusan klaim atau nilai pembayaran nyata.`,
      example: `Contoh hypothetical: kejadian terkait ${matched.toLowerCase()} dapat dibandingkan dengan wording manfaat dan dokumen yang tersedia.`,
      checks: checks,
    };
  }

  if (/what.*cover|benefit|manfaat|apa saja/.test(normalized)) {
    return {
      summary: `Paket ${plan.name} memiliki manfaat dummy: ${benefits.join(", ")}.`,
      example: `Contoh hypothetical: manfaat ${benefits[0].toLowerCase()} hanya dipakai untuk memahami isi paket demo, bukan sebagai janji hasil klaim.`,
      checks: checks,
    };
  }

  return { summary: policyGuardrail, example: "", checks: [] };
}

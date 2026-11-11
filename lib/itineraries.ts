import type { ItineraryDay, Trip } from "@/types";

const destinationImages: Record<string, string> = {
  tokyo: "/images/tokyo.jpg",
  kyoto: "/images/kyoto.jpg",
  osaka: "/images/osaka.jpg",
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function generateItinerary(trip: Trip): ItineraryDay[] {
  const start = new Date(`${trip.departureDate}T00:00:00.000Z`);
  const end = new Date(`${trip.returnDate}T00:00:00.000Z`);
  const duration = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  const destination = trip.destination.trim();
  const image = destinationImages[destination.toLowerCase()] ?? "/images/japan-hero.jpg";
  const days: ItineraryDay[] = [];

  for (let index = 0; index <= duration; index += 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);

    if (index === 0) {
      days.push({
        day: 1,
        date: formatDate(date),
        title: `Arrival in ${destination}`,
        description: `Arrive from ${trip.origin}, settle in, and enjoy an easy first evening in ${destination}.`,
        image,
      });
      continue;
    }

    if (index === duration) {
      days.push({
        day: index + 1,
        date: formatDate(date),
        title: `Departure from ${destination}`,
        description: "Keep your booking proofs accessible and head home with everything organized.",
        image,
      });
      continue;
    }

    if (trip.activities.includes("winter_sports") && index === Math.min(3, duration - 1)) {
      days.push({
        day: index + 1,
        date: formatDate(date),
        title: "Winter sports, thoughtfully prepared",
        description: `A flexible winter activity day near ${destination}, with time to check equipment, weather, and activity-specific terms.`,
        image: "/images/winter.jpg",
      });
      continue;
    }

    const experiences = [
      ["City highlights", `Explore a few signature neighborhoods in ${destination}, leaving room for spontaneous stops.`],
      ["Local flavors", `Discover local food and everyday culture around ${destination} at a comfortable pace.`],
      ["A slower day", `Enjoy a flexible morning in ${destination}, then revisit a favorite place or rest.`],
    ];
    const [title, description] = experiences[(index - 1) % experiences.length];
    days.push({ day: index + 1, date: formatDate(date), title, description, image });
  }

  return days;
}

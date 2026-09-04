import Link from "next/link";

type Trip = {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
  travel_style?: string;
};

type TripCardProps = {
  trip: Trip;
};

function getDestinationFlag(destination: string) {
  const country = destination.toLowerCase();

  if (country.includes("japan") || country.includes("tokyo")) return "🇯🇵";
  if (country.includes("korea") || country.includes("seoul")) return "🇰🇷";
  if (country.includes("singapore")) return "🇸🇬";
  if (country.includes("thailand") || country.includes("bangkok")) return "🇹🇭";
  if (country.includes("indonesia") || country.includes("bali")) return "🇮🇩";
  if (country.includes("france") || country.includes("paris")) return "🇫🇷";
  if (country.includes("italy") || country.includes("rome")) return "🇮🇹";
  if (country.includes("usa") || country.includes("america")) return "🇺🇸";
  if (country.includes("uk") || country.includes("london")) return "🇬🇧";

  return "🌍";
}

function getCategoryStyle(category: string) {
  const value = category.toLowerCase();

  if (value === "backpacker") {
    return "bg-green-100 text-green-700";
  }

  if (value === "luxury") {
    return "bg-purple-100 text-purple-700";
  }

  return "bg-blue-100 text-blue-700";
}

export default function TripCard({ trip }: TripCardProps) {
  const travelStyle = trip.travel_style || "Solo";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-4xl">
              {getDestinationFlag(trip.destination)}
            </span>

            <h2 className="text-2xl font-semibold text-zinc-900">
              {trip.destination}
            </h2>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700">
              {trip.days} days
            </span>

            <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
              USD {trip.budget.toLocaleString("en-US")}
            </span>

            <span
              className={`rounded-full px-3 py-1 font-medium capitalize ${getCategoryStyle(
                trip.category
              )}`}
            >
              {trip.category}
            </span>

            <span className="rounded-full bg-orange-100 px-3 py-1 font-medium capitalize text-orange-700">
              {travelStyle}
            </span>
          </div>
        </div>

        <Link
          href={`/trips/${trip.id}`}
          className="shrink-0 rounded-lg bg-black px-5 py-3 text-center font-semibold text-white transition hover:bg-zinc-800"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
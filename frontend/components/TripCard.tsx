import Link from "next/link";

type Trip = {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
};

type TripCardProps = {
  trip: Trip;
};

export default function TripCard({ trip }: TripCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">
            {trip.destination}
          </h2>

          <div className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-600">
            <span>{trip.days} days</span>
            <span>·</span>
            <span>USD {trip.budget}</span>
            <span>·</span>
            <span className="capitalize">{trip.category}</span>
          </div>
        </div>

        <Link
          href={`/trips/${trip.id}`}
          className="rounded-lg bg-black px-5 py-3 text-center font-semibold text-white transition hover:bg-zinc-800"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTrip } from "../../../services/tripService";

type Trip = {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  travel_style: string;
  daily_budget: number;
  ai_recommendation: string | null;
};

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  useEffect(() => {
    async function loadTrip() {
      try {
        const { id } = await params;
        const data = await getTrip(Number(id));
        setTrip(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load this trip.");
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-center shadow-sm">
          Loading trip...
        </div>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <Link
              href="/trips"
              className="font-medium text-zinc-600 hover:text-zinc-900"
            >
              ← Back to Trip History
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-3 font-semibold text-zinc-900 hover:bg-zinc-100"
            >
              Logout
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-red-50 p-6 text-red-700">
            {error || "Trip not found."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/trips"
            className="font-medium text-zinc-600 hover:text-zinc-900"
          >
            ← Back to Trip History
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-zinc-300 bg-white px-5 py-3 font-semibold text-zinc-900 hover:bg-zinc-100"
          >
            Logout
          </button>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-4xl font-bold">{trip.destination}</h1>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Duration</p>
              <p className="mt-1 text-lg font-semibold">
                {trip.days} days
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Budget</p>
              <p className="mt-1 text-lg font-semibold">
                USD {trip.budget}
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Travel Style</p>
              <p className="mt-1 text-lg font-semibold capitalize">
                {trip.travel_style}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold">AI Itinerary</h2>

          {trip.ai_recommendation ? (
            <div className="mt-6 whitespace-pre-wrap leading-7 text-zinc-700">
              {trip.ai_recommendation}
            </div>
          ) : (
            <p className="mt-4 text-zinc-600">
              No AI recommendation has been generated for this trip yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
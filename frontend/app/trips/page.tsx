"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TripCard from "../../components/TripCard";
import { getTrips } from "../../services/tripService";

type Trip = {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load your trips.");
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Trip History</h1>
            <p className="mt-2 text-zinc-600">
              Your saved travel itineraries
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-black px-5 py-3 text-center font-semibold text-white hover:bg-zinc-800"
          >
            + Create New Trip
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            Loading your trips...
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold">No trips found</h2>
            <p className="mt-2 text-zinc-600">
              Create your first AI-powered itinerary.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-zinc-800"
            >
              Generate a Trip
            </Link>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <div className="space-y-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(1000);
  const [travelStyle, setTravelStyle] = useState("backpacker");

  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateTrip() {
    setLoading(true);
    setError("");
    setRecommendation("");

    try {
      const tripResponse = await fetch(
        "http://127.0.0.1:8000/api/v1/trips",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination,
            days,
            budget,
            travel_style: travelStyle,
          }),
        }
      );

      if (!tripResponse.ok) {
        throw new Error("Failed to create trip");
      }

      const trip = await tripResponse.json();

      const tripId = trip.trip_id ?? trip.id;

      const aiResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/trips/${tripId}/generate`,
        {
          method: "POST",
        }
      );

      if (!aiResponse.ok) {
        throw new Error("Failed to generate AI recommendation");
      }

      const result = await aiResponse.json();
      router.push("/trips");
    } catch (err) {
      console.error(err);
      setError(
        "Unable to generate your itinerary. Please check that the backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1800&q=80')",
          }}
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto flex h-full max-w-6xl items-center px-6">
          <div className="max-w-2xl text-white">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-sky-200">
              Explore the world
            </p>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              KelanaAI
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-100 sm:text-xl">
              Your AI-powered travel planner. Create personalized itineraries
              and discover unforgettable destinations.
            </p>
          </div>
        </div>
      </section>

      {/* Planning Form */}
      <section className="mx-auto -mt-16 max-w-5xl px-6 pb-16">
        <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Plan Your Trip
            </h2>
            <p className="mt-2 text-slate-500">
              Tell us where you want to go and let AI build your itinerary.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Destination */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Destination
              </label>

              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Tokyo, Japan"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            {/* Days */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Number of Days
              </label>

              <input
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Budget (USD)
              </label>

              <input
                type="number"
                min="1"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            {/* Travel Style */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Travel Style
              </label>

              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="backpacker">Backpacker</option>
                <option value="family">Family</option>
                <option value="business">Business</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateTrip}
            disabled={loading || !destination}
            className="mt-6 w-full rounded-xl bg-sky-600 px-5 py-4 font-semibold text-white shadow-md transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating itinerary..." : "Generate AI Trip"}
          </button>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* AI Recommendation */}
        {recommendation && (
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg sm:p-8">
            <h2 className="text-2xl font-bold">Your AI Itinerary</h2>

            <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">
              {recommendation}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 KelanaAI. All rights reserved.</p>

          <nav className="flex justify-center gap-6 sm:justify-end">
            <a href="#" className="transition hover:text-sky-600">
              Home
            </a>
            <a href="#" className="transition hover:text-sky-600">
              About
            </a>
            <a href="#" className="transition hover:text-sky-600">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
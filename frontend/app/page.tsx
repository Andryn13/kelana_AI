"use client";

import { useState } from "react";

export default function Home() {
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
      // 1. Create trip through FastAPI
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

      // 2. Ask FastAPI to generate AI recommendation
      const aiResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/trips/${trip.trip_id}/generate`,
        {
          method: "POST",
        }
      );

      if (!aiResponse.ok) {
        throw new Error("Failed to generate AI recommendation");
      }

      const result = await aiResponse.json();

      setRecommendation(result.recommendation);
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
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">KelanaAI</h1>
          <p className="mt-3 text-lg text-zinc-600">
            Your AI-powered travel planner
          </p>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold">
            Plan Your Trip
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-medium">
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Tokyo"
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium">
                  Number of Days
                </label>
                <input
                  type="number"
                  min="1"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Budget (USD)
                </label>
                <input
                  type="number"
                  min="1"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Travel Style
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3"
              >
                <option value="backpacker">Backpacker</option>
                <option value="family">Family</option>
                <option value="business">Business</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            <button
              onClick={generateTrip}
              disabled={loading || !destination}
              className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Generating itinerary..." : "Generate AI Trip"}
            </button>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}
          </div>
        </section>

        {recommendation && (
          <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold">
              Your AI Itinerary
            </h2>

            <div className="whitespace-pre-wrap leading-7 text-zinc-700">
              {recommendation}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
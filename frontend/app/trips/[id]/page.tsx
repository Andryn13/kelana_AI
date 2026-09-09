"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getTrip,
  updateTrip,
  deleteTrip,
  generateTrip,
} from "../../../services/tripService";

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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [editDestination, setEditDestination] = useState("");
  const [editDays, setEditDays] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editTravelStyle, setEditTravelStyle] = useState("");

  function startEditing() {
    if (!trip) return;

    setEditDestination(trip.destination);
    setEditDays(String(trip.days));
    setEditBudget(String(trip.budget));
    setEditTravelStyle(trip.travel_style);
    setEditing(true);
    setError("");
  }

  function cancelEditing() {
    if (!trip) return;

    setEditDestination(trip.destination);
    setEditDays(String(trip.days));
    setEditBudget(String(trip.budget));
    setEditTravelStyle(trip.travel_style);
    setEditing(false);
    setError("");
  }

  async function handleUpdate() {
    if (!trip) return;

    setSaving(true);
    setError("");

    try {
      const updatedTrip = await updateTrip(trip.id, {
        destination: editDestination,
        days: Number(editDays),
        budget: Number(editBudget),
        travel_style: editTravelStyle,
      });

      setTrip(updatedTrip);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("Unable to update this trip.");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    if (!trip) return;

    setGenerating(true);
    setError("");

    try {
      const data = await generateTrip(trip.id);

      setTrip((currentTrip) =>
        currentTrip
          ? {
              ...currentTrip,
              ai_recommendation: data.recommendation,
            }
          : currentTrip
      );
    } catch (err) {
      console.error(err);
      setError("Unable to generate AI recommendation.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete() {
    if (!trip) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await deleteTrip(trip.id);
      router.push("/trips");
    } catch (err) {
      console.error(err);
      setError("Unable to delete this trip.");
      setDeleting(false);
    }
  }

  useEffect(() => {
    async function loadTrip() {
      try {
        const { id } = await params;
        const data = await getTrip(Number(id));

        setTrip(data);
        setEditDestination(data.destination);
        setEditDays(String(data.days));
        setEditBudget(String(data.budget));
        setEditTravelStyle(data.travel_style);
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

  if (error && !trip) {
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

          </div>

          <div className="mt-6 rounded-2xl bg-red-50 p-6 text-red-700">
            {error || "Trip not found."}
          </div>
        </div>
      </main>
    );
  }

  if (!trip) {
    return null;
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
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex justify-end gap-3">
            {editing ? (
              <>
                <button
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-lg border border-zinc-300 bg-white px-5 py-3 font-semibold text-zinc-900 hover:bg-zinc-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={startEditing}
                  className="rounded-lg border border-zinc-300 bg-white px-5 py-3 font-semibold text-zinc-900 hover:bg-zinc-100"
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {editing ? (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Destination
                </label>
                <input
                  type="text"
                  value={editDestination}
                  onChange={(e) => setEditDestination(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editDays}
                    onChange={(e) => setEditDays(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Budget
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Travel Style
                </label>
                <select
                  value={editTravelStyle}
                  onChange={(e) => setEditTravelStyle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="backpacker">Backpacker</option>
                  <option value="standard">Standard</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold">AI Itinerary</h2>

          {trip.ai_recommendation ? (
            <div className="mt-6 whitespace-pre-wrap leading-7 text-zinc-700">
              {trip.ai_recommendation}
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-zinc-600">
                No AI recommendation has been generated for this trip yet.
              </p>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="mt-5 rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                {generating
                  ? "Generating AI Recommendation..."
                  : "Generate AI Recommendation"}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
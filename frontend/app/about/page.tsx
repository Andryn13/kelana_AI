import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <section className="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold text-blue-600">
            About KelanaAI
          </p>

          <h1 className="mt-2 text-4xl font-bold text-zinc-900">
            Your AI-powered travel companion
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-zinc-700">
            KelanaAI helps travelers plan trips, generate personalized
            itineraries, explore travel information, and have conversations
            with an AI travel assistant.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-zinc-50 p-5">
              <h2 className="font-semibold text-zinc-900">
                Smart Trip Planning
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Create and manage trips based on your destination, duration,
                budget, and travel style.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 p-5">
              <h2 className="font-semibold text-zinc-900">
                AI Recommendations
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Generate AI-powered itineraries tailored to your travel plans.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 p-5">
              <h2 className="font-semibold text-zinc-900">
                Knowledge-Based Assistant
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Ask travel questions and receive answers grounded in the
                application's travel knowledge base.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 p-5">
              <h2 className="font-semibold text-zinc-900">
                Persistent Conversations
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Keep your conversations and travel plans saved to your
                account for later access.
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link
              href="/trips"
              className="rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-zinc-800"
            >
              Explore My Trips
            </Link>

            <Link
              href="/chat"
              className="rounded-lg border border-zinc-300 bg-white px-5 py-3 font-semibold text-zinc-900 hover:bg-zinc-100"
            >
              Open AI Chat
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";

export default function AssistantPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setError("Unable to get an answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            KelanaAI Travel Assistant
          </h1>

          <p className="mt-2 text-zinc-600">
            Ask questions and get answers grounded in trusted travel documents.
          </p>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Ask KelanaAI
          </h2>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAsk();
                }
              }}
              placeholder="Can I bring medication into Japan?"
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-black"
            />

            <button
              onClick={handleAsk}
              disabled={loading}
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "Asking..." : "Ask"}
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {answer && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              AI Answer
            </h2>

            <p className="mt-4 whitespace-pre-wrap leading-7 text-zinc-700">
              {answer}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
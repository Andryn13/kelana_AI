"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-red-600">500</p>

        <h1 className="mt-2 text-3xl font-bold text-zinc-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-zinc-600">
          KelanaAI encountered an unexpected error.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-zinc-800"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />

        <h1 className="mt-5 text-xl font-semibold text-zinc-900">
          Loading KelanaAI...
        </h1>

        <p className="mt-2 text-sm text-zinc-600">
          Please wait a moment.
        </p>
      </div>
    </main>
  );
}
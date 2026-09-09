export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-blue-600">404</p>

        <h1 className="mt-2 text-3xl font-bold text-zinc-900">
          Page not found
        </h1>

        <p className="mt-3 text-zinc-600">
          Sorry, the page you are looking for does not exist.
        </p>

        <a
          href="/"
          className="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-zinc-800"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}
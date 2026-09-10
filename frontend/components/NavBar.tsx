"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/trips"
          className="text-xl font-bold text-zinc-900"
        >
          KelanaAI
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/trips"
            className="font-medium text-zinc-600 hover:text-zinc-900"
          >
            My Trips
          </Link>

          <Link
            href="/chat"
            className="font-medium text-zinc-600 hover:text-zinc-900"
          >
            AI Chat
          </Link>

          <Link
            href="/assistant"
            className="font-medium text-zinc-600 hover:text-zinc-900"
          >
            Assistant
          </Link>

            <Link
            href="/about"
            className="font-medium text-zinc-600 hover:text-zinc-900"
            >
            About
            </Link>
          {isLoggedIn ? (
            <button
                onClick={handleLogout}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
            >
                Logout
            </button>
            ) : (
            <div className="flex items-center gap-3">
                <Link
                href="/login"
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                >
                Login
                </Link>

                <Link
                href="/register"
                className="rounded-lg bg-zinc-900 px-4 py-2 font-semibold text-white hover:bg-zinc-700"
                >
                Register
                </Link>
            </div>
        )}
        </div>
      </div>
    </nav>
  );
}
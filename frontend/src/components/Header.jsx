"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="border-b border-gray-300 bg-white px-4 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" style={{ maxWidth: 1024, margin: "0 auto" }}>
        <Link href="/" className="font-bold text-base sm:text-lg text-gray-800 no-underline">
          Review Platform
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <Link href="/" className="text-gray-600 no-underline whitespace-nowrap">
            Home
          </Link>
          {loading ? null : user ? (
            <>
              {user.is_admin && (
                <Link href="/admin" className="text-gray-600 no-underline whitespace-nowrap">
                  Admin Panel
                </Link>
              )}
              <span className="text-gray-500 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{user.name}</span>
              <button
                onClick={logout}
                className="border border-gray-300 rounded px-2 sm:px-3 py-0.5 sm:py-1 bg-white cursor-pointer text-xs sm:text-sm whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 no-underline whitespace-nowrap">
                Login
              </Link>
              <Link href="/register" className="text-gray-600 no-underline whitespace-nowrap">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

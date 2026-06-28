"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-6 sm:mt-10 px-2 sm:px-0">
      <h1 className="text-lg sm:text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="border border-gray-200 rounded bg-white p-3 sm:p-4">
        <div className="mb-3">
          <label className="block text-xs sm:text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1.5 text-xs sm:text-sm"
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs sm:text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1.5 text-xs sm:text-sm"
          />
        </div>
        {error && <p className="text-red-500 text-xs sm:text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white rounded px-4 py-1.5 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-xs sm:text-sm text-center mt-3">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
}

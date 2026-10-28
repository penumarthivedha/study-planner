"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) router.replace("/planner");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/planner");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-bg flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="card fade-up w-full max-w-sm p-8 space-y-4">
        <div>
          <h1 className="heading text-3xl font-bold">Welcome back</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Log in to see your study plan.
          </p>
        </div>

        {error && (
          <p className="text-sm p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </p>
        )}

        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} className="field" required />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} className="field" required />

        <button type="submit" disabled={loading} className="btn w-full">
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
          No account yet?{" "}
          <Link href="/register" className="font-semibold underline" style={{ color: "var(--accent)" }}>
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
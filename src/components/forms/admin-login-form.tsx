"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

        router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 bg-onyx">
      <Reveal>
        <form
          onSubmit={handleSubmit}
          className="luxury-glow w-full max-w-sm rounded-2xl border border-mist/25 bg-charcoal/55 p-8 backdrop-blur-md"
        >
          <h1 className="text-3xl font-semibold text-cream">Babel Admin</h1>
          <p className="mt-2 text-sm text-mist">Content & Events Management</p>

          <label className="mt-6 block text-sm text-mist">
            Admin Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
              placeholder="Enter admin password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold tracking-wide text-onyx transition hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </button>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </form>
      </Reveal>
    </div>
  );
}

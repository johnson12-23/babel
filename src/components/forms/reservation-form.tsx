"use client";

import { useState } from "react";
import { trackConversion } from "@/lib/tracking";

type ReservationPayload = {
  fullName: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  note: string;
};

const initialState: ReservationPayload = {
  fullName: "",
  phone: "",
  guests: "2",
  date: "",
  time: "",
  note: "",
};

export function ReservationForm() {
  const [form, setForm] = useState<ReservationPayload>(initialState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { message: string };

      if (!response.ok) {
        void trackConversion("reservation_submit_failed", { source: "form" });
        setFeedback(data.message || "We could not submit your request right now.");
        return;
      }

      setForm(initialState);
      void trackConversion("reservation_submit_success", {
        source: "form",
        guests: Number(form.guests),
      });
      setFeedback("Reservation request sent. The Babel team will confirm shortly.");
    } catch {
      void trackConversion("reservation_submit_failed", { source: "network" });
      setFeedback("Connection issue. Please call +233 20 000 0600 for immediate support.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="luxury-glow rounded-2xl border border-mist/25 bg-charcoal/55 p-6 backdrop-blur-md"
    >
      <h2 className="text-2xl font-semibold text-cream">Request Reservation</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-mist">
          Full Name
          <input
            required
            value={form.fullName}
            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
          />
        </label>

        <label className="text-sm text-mist">
          Phone
          <input
            required
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
          />
        </label>

        <label className="text-sm text-mist">
          Guests
          <input
            required
            min={1}
            max={20}
            type="number"
            value={form.guests}
            onChange={(event) => setForm((prev) => ({ ...prev, guests: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
          />
        </label>

        <label className="text-sm text-mist">
          Date
          <input
            required
            type="date"
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
          />
        </label>

        <label className="text-sm text-mist sm:col-span-2">
          Preferred Time
          <input
            required
            type="time"
            value={form.time}
            onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
          />
        </label>

        <label className="text-sm text-mist sm:col-span-2">
          Notes
          <textarea
            rows={4}
            value={form.note}
            onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
            placeholder="Allergies, occasion, seating preference"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold tracking-wide text-onyx transition hover:scale-[1.01] disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Reservation Request"}
      </button>

      {feedback && <p className="mt-4 text-sm text-mist">{feedback}</p>}
    </form>
  );
}

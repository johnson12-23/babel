"use client";

import { useState } from "react";
import { trackConversion } from "@/lib/tracking";

type ContactPayload = {
  fullName: string;
  email: string;
  message: string;
  type: string;
};

const initialState: ContactPayload = {
  fullName: "",
  email: "",
  message: "",
  type: "Private Dining",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactPayload>(initialState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { message: string };

      if (!response.ok) {
        void trackConversion("contact_submit_failed", { source: "form" });
        setFeedback(data.message || "Unable to send your inquiry right now.");
        return;
      }

      setForm(initialState);
      void trackConversion("contact_submit_success", { source: form.type });
      setFeedback("Message sent. Our team will respond quickly.");
    } catch {
      void trackConversion("contact_submit_failed", { source: "network" });
      setFeedback("Network issue. Please try again or call +233 20 000 0600.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="luxury-glow rounded-2xl border border-mist/25 bg-charcoal/55 p-6 backdrop-blur-md"
    >
      <h2 className="text-2xl font-semibold text-cream">Contact Babel</h2>

      <div className="mt-5 grid gap-4">
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
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
          />
        </label>

        <label className="text-sm text-mist">
          Inquiry Type
          <select
            value={form.type}
            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
          >
            <option>Private Dining</option>
            <option>Event Booking</option>
            <option>Partnership</option>
            <option>General Inquiry</option>
          </select>
        </label>

        <label className="text-sm text-mist">
          Message
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
            placeholder="Tell us about your request"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold tracking-wide text-onyx transition hover:scale-[1.01] disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {feedback && <p className="mt-4 text-sm text-mist">{feedback}</p>}
    </form>
  );
}

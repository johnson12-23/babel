"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

type Event = {
  id: number;
  title: string;
  description: string;
  event_date_label: string;
  time_label: string;
  sort_order: number;
  is_active: boolean;
};

type AdminEventsPageProps = {
  initialEvents: Event[];
};

export function EventsAdminContent({ initialEvents }: AdminEventsPageProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_date_label: "",
    time_label: "",
    sort_order: events.length,
    is_active: true,
  });

  async function handleAddEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (!res.ok) {
        alert("Failed to add event");
        return;
      }

      const data = (await res.json()) as { event: Event };
      setEvents((prev) => [...prev, data.event]);
      setNewEvent({
        title: "",
        description: "",
        event_date_label: "",
        time_label: "",
        sort_order: events.length + 1,
        is_active: true,
      });
    } catch {
      alert("Error adding event");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEvent(id: number) {
    if (!confirm("Delete this event?")) return;

    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete event");
        return;
      }
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch {
      alert("Error deleting event");
    }
  }

  async function handleToggleActive(id: number, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (!res.ok) {
        alert("Failed to update event");
        return;
      }

      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, is_active: !isActive } : event
        )
      );
    } catch {
      alert("Error updating event");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold text-cream">Events Management</h1>
        <p className="mt-2 text-sm text-mist">Create and manage upcoming events.</p>
      </div>

      <form
        onSubmit={handleAddEvent}
        className="luxury-glow rounded-2xl border border-mist/25 bg-charcoal/55 p-6 backdrop-blur-md"
      >
        <h2 className="text-xl font-semibold text-gold">New Event</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-mist sm:col-span-2">
            Event Title
            <input
              required
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, title: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
              placeholder="e.g., Golden Hour Oyster Night"
            />
          </label>

          <label className="text-sm text-mist sm:col-span-2">
            Description
            <textarea
              required
              rows={3}
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, description: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
              placeholder="Describe the event experience..."
            />
          </label>

          <label className="text-sm text-mist">
            Date Label
            <input
              required
              value={newEvent.event_date_label}
              onChange={(e) =>
                setNewEvent((prev) => ({
                  ...prev,
                  event_date_label: e.target.value,
                }))
              }
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
              placeholder="e.g., Every Thursday"
            />
          </label>

          <label className="text-sm text-mist">
            Time Label
            <input
              required
              value={newEvent.time_label}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, time_label: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
              placeholder="e.g., 7:00 PM - 10:00 PM"
            />
          </label>

          <label className="text-sm text-mist">
            Sort Order
            <input
              type="number"
              min={0}
              value={newEvent.sort_order}
              onChange={(e) =>
                setNewEvent((prev) => ({
                  ...prev,
                  sort_order: Number(e.target.value),
                }))
              }
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
            />
          </label>

          <label className="text-sm text-mist">
            <input
              type="checkbox"
              checked={newEvent.is_active}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, is_active: e.target.checked }))
              }
              className="mr-2"
            />
            Active
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold tracking-wide text-onyx transition hover:scale-[1.01] disabled:opacity-60"
        >
          <Plus size={16} />
          Add Event
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mist/20 text-mist">
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-mist/10 hover:bg-charcoal/30">
                <td className="px-4 py-3 text-cream">{event.title}</td>
                <td className="px-4 py-3 text-mist">{event.event_date_label}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(event.id, event.is_active)}
                    className={`text-xs font-semibold tracking-wider ${
                      event.is_active ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {event.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-400/50 px-3 py-1 text-xs font-semibold text-red-400 transition hover:border-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

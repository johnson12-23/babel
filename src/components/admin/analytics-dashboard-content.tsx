"use client";

import { useMemo, useState } from "react";

type ConversionEvent = {
  id: number;
  event_name: string;
  metadata: Record<string, string | number>;
  created_at: string;
};

type AnalyticsDashboardContentProps = {
  events: ConversionEvent[];
  dbConfigured: boolean;
};

type RangePreset = "7d" | "30d" | "90d" | "all";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getPresetStartDate(preset: RangePreset) {
  if (preset === "all") {
    return null;
  }

  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  return start;
}

function inferSourcePage(event: ConversionEvent) {
  const hrefValue = event.metadata?.href;
  if (typeof hrefValue === "string" && hrefValue.startsWith("/")) {
    const segment = hrefValue.split("/").filter(Boolean)[0];
    return segment ? `/${segment}` : "/";
  }

  if (event.event_name.includes("reservation")) {
    return "/reservations";
  }
  if (event.event_name.includes("contact")) {
    return "/contact";
  }
  if (event.event_name.includes("faq")) {
    return "/faq";
  }
  if (event.event_name.includes("hero") || event.event_name.includes("whatsapp")) {
    return "/";
  }

  return "unknown";
}

function toChartRows(source: Record<string, number>) {
  return Object.entries(source)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
}

function escapeCsvValue(value: string | number) {
  const stringValue = String(value ?? "");
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function downloadCsvFile(fileName: string, headers: string[], rows: Array<Array<string | number>>) {
  if (rows.length === 0) {
    return;
  }

  const csv = [
    headers.map((header) => escapeCsvValue(header)).join(","),
    ...rows.map((row) => row.map((value) => escapeCsvValue(value)).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function AnalyticsDashboardContent({ events, dbConfigured }: AnalyticsDashboardContentProps) {
  const [preset, setPreset] = useState<RangePreset>("30d");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredEvents = useMemo(() => {
    const presetStart = getPresetStartDate(preset);
    const customStart = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const customEnd = endDate ? new Date(`${endDate}T23:59:59`) : null;

    return events.filter((event) => {
      const timestamp = new Date(event.created_at);

      if (presetStart && timestamp < presetStart) {
        return false;
      }
      if (customStart && timestamp < customStart) {
        return false;
      }
      if (customEnd && timestamp > customEnd) {
        return false;
      }

      return true;
    });
  }, [events, preset, startDate, endDate]);

  const eventRows = useMemo(() => {
    const grouped = filteredEvents.reduce<Record<string, number>>((acc, event) => {
      acc[event.event_name] = (acc[event.event_name] ?? 0) + 1;
      return acc;
    }, {});

    return toChartRows(grouped);
  }, [filteredEvents]);

  const pageRows = useMemo(() => {
    const grouped = filteredEvents.reduce<Record<string, number>>((acc, event) => {
      const page = inferSourcePage(event);
      acc[page] = (acc[page] ?? 0) + 1;
      return acc;
    }, {});

    return toChartRows(grouped);
  }, [filteredEvents]);

  const trendRows = useMemo(() => {
    const grouped = filteredEvents.reduce<Record<string, number>>((acc, event) => {
      const key = new Date(event.created_at).toISOString().slice(0, 10);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14);
  }, [filteredEvents]);

  const peakValue = Math.max(
    1,
    ...eventRows.map(([, count]) => count),
    ...pageRows.map(([, count]) => count),
    ...trendRows.map(([, count]) => count),
  );

  function downloadCsv() {
    downloadCsvFile(
      `babel-conversion-analytics-${new Date().toISOString().slice(0, 10)}.csv`,
      ["id", "event_name", "source_page", "created_at", "metadata_json"],
      filteredEvents.map((event) => [
        event.id,
        event.event_name,
        inferSourcePage(event),
        event.created_at,
        JSON.stringify(event.metadata ?? {}),
      ]),
    );
  }

  function downloadTopEventsCsv() {
    downloadCsvFile(
      `babel-top-events-${new Date().toISOString().slice(0, 10)}.csv`,
      ["event_name", "count"],
      eventRows.map(([name, count]) => [name, count]),
    );
  }

  function downloadPerPageCsv() {
    downloadCsvFile(
      `babel-per-page-breakdown-${new Date().toISOString().slice(0, 10)}.csv`,
      ["source_page", "count"],
      pageRows.map(([name, count]) => [name, count]),
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold text-cream">Conversion Analytics</h1>
        <p className="mt-2 text-sm text-mist">
          Track key user actions across your website including FAQ interactions, bookings, and CTA clicks.
        </p>
      </div>

      {!dbConfigured && (
        <article className="rounded-2xl border border-mist/20 bg-charcoal/45 p-6">
          <p className="text-sm text-mist">Supabase service role key is missing. Analytics cannot be loaded.</p>
        </article>
      )}

      <article className="rounded-2xl border border-mist/20 bg-charcoal/45 p-5">
        <p className="text-xs uppercase tracking-wider text-mist">Date Range</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {([
            ["7d", "Last 7 days"],
            ["30d", "Last 30 days"],
            ["90d", "Last 90 days"],
            ["all", "All time"],
          ] as Array<[RangePreset, string]>).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPreset(key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider transition ${
                preset === key
                  ? "bg-gold text-onyx"
                  : "border border-mist/30 text-mist hover:border-gold hover:text-gold"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs uppercase tracking-wider text-mist">
            Custom start
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-sm text-cream outline-none focus:border-gold"
            />
          </label>
          <label className="text-xs uppercase tracking-wider text-mist">
            Custom end
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-sm text-cream outline-none focus:border-gold"
            />
          </label>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadCsv}
              disabled={filteredEvents.length === 0}
              className="rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold tracking-wider text-gold transition hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export Filtered CSV
            </button>
            <button
              type="button"
              onClick={downloadTopEventsCsv}
              disabled={eventRows.length === 0}
              className="rounded-full border border-mist/40 px-4 py-2 text-xs font-semibold tracking-wider text-mist transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export Top Events CSV
            </button>
            <button
              type="button"
              onClick={downloadPerPageCsv}
              disabled={pageRows.length === 0}
              className="rounded-full border border-mist/40 px-4 py-2 text-xs font-semibold tracking-wider text-mist transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export Per-Page CSV
            </button>
          </div>
        </div>
      </article>

      <div className="grid gap-5 md:grid-cols-4">
        <article className="rounded-2xl border border-mist/20 bg-charcoal/45 p-5">
          <p className="text-xs uppercase tracking-wider text-mist">Filtered Events</p>
          <p className="mt-2 text-3xl font-semibold text-gold">{filteredEvents.length}</p>
        </article>

        <article className="rounded-2xl border border-mist/20 bg-charcoal/45 p-5 md:col-span-3">
          <p className="text-xs uppercase tracking-wider text-mist">Top Tracked Actions</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {eventRows.length === 0 && <span className="text-sm text-mist">No conversion events yet.</span>}
            {eventRows.map(([name, count]) => (
              <span
                key={name}
                className="rounded-full border border-gold/40 bg-onyx/60 px-3 py-1 text-xs font-semibold tracking-wider text-gold"
              >
                {name}: {count}
              </span>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-mist/20 bg-charcoal/45 p-6">
          <h2 className="text-2xl font-semibold text-gold">Event Breakdown</h2>
          <div className="mt-4 space-y-3">
            {eventRows.length === 0 && <p className="text-sm text-mist">No data for selected range.</p>}
            {eventRows.map(([name, count]) => (
              <div key={name}>
                <div className="mb-1 flex items-center justify-between text-xs text-mist">
                  <span>{name}</span>
                  <span>{count}</span>
                </div>
                <div className="h-2 rounded-full bg-onyx/70">
                  <div
                    className="h-2 rounded-full bg-gold"
                    style={{ width: `${Math.max(6, (count / peakValue) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-mist/20 bg-charcoal/45 p-6">
          <h2 className="text-2xl font-semibold text-gold">Per-Page Breakdown</h2>
          <div className="mt-4 space-y-3">
            {pageRows.length === 0 && <p className="text-sm text-mist">No data for selected range.</p>}
            {pageRows.map(([name, count]) => (
              <div key={name}>
                <div className="mb-1 flex items-center justify-between text-xs text-mist">
                  <span>{name}</span>
                  <span>{count}</span>
                </div>
                <div className="h-2 rounded-full bg-onyx/70">
                  <div
                    className="h-2 rounded-full bg-rose-smoke"
                    style={{ width: `${Math.max(6, (count / peakValue) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-mist/20 bg-charcoal/45 p-6">
        <h2 className="text-2xl font-semibold text-gold">Daily Trend (Last 14 Data Days)</h2>
        {trendRows.length === 0 ? (
          <p className="mt-4 text-sm text-mist">No trend data for selected range.</p>
        ) : (
          <>
            <div className="mt-4 overflow-x-auto rounded-xl border border-mist/20 bg-onyx/50 p-3">
              <svg viewBox="0 0 760 240" className="min-w-[760px]">
                <polyline
                  fill="none"
                  stroke="rgba(242, 202, 127, 0.35)"
                  strokeWidth="1"
                  points={`0,215 760,215`}
                />
                {trendRows.map(([day, count], index) => {
                  const x = trendRows.length === 1 ? 380 : (index / (trendRows.length - 1)) * 740 + 10;
                  const y = 205 - (count / peakValue) * 170;
                  return (
                    <g key={day}>
                      <circle cx={x} cy={y} r="4" fill="#f2ca7f" />
                    </g>
                  );
                })}
                <polyline
                  fill="none"
                  stroke="#f2ca7f"
                  strokeWidth="3"
                  points={trendRows
                    .map(([, count], index) => {
                      const x = trendRows.length === 1 ? 380 : (index / (trendRows.length - 1)) * 740 + 10;
                      const y = 205 - (count / peakValue) * 170;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              </svg>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {trendRows.map(([day, count]) => (
                <div key={day} className="rounded-lg border border-mist/20 bg-onyx/45 px-3 py-2 text-xs">
                  <p className="text-mist">{day}</p>
                  <p className="mt-1 font-semibold text-gold">{count} events</p>
                </div>
              ))}
            </div>
          </>
        )}
      </article>

      <article className="rounded-2xl border border-mist/20 bg-charcoal/45 p-6">
        <h2 className="text-2xl font-semibold text-gold">Recent Events</h2>
        {filteredEvents.length === 0 ? (
          <p className="mt-4 text-sm text-mist">No event data captured for this range.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-mist/20 text-mist">
                  <th className="px-3 py-3 text-left">Event</th>
                  <th className="px-3 py-3 text-left">Source Page</th>
                  <th className="px-3 py-3 text-left">Metadata</th>
                  <th className="px-3 py-3 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-mist/10 align-top">
                    <td className="px-3 py-3 text-cream">{event.event_name}</td>
                    <td className="px-3 py-3 text-gold">{inferSourcePage(event)}</td>
                    <td className="px-3 py-3 text-mist">
                      <pre className="max-w-lg whitespace-pre-wrap break-words text-xs text-mist">
                        {JSON.stringify(event.metadata ?? {}, null, 2)}
                      </pre>
                    </td>
                    <td className="px-3 py-3 text-mist">{formatDate(event.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}

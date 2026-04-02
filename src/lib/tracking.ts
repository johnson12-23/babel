export async function trackConversion(eventName: string, metadata?: Record<string, string | number>) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName, metadata }),
      keepalive: true,
    });
  } catch {
    // Tracking should never block user interactions.
  }
}

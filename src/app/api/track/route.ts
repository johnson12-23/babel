import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase";

const trackSchema = z.object({
  eventName: z.string().min(2).max(80),
  metadata: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = trackSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid tracking payload." }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    // Accept events even when tracking backend is not configured.
    return NextResponse.json({ message: "Tracking accepted without persistence." });
  }

  const { error } = await supabase.from("conversion_events").insert({
    event_name: parsed.data.eventName,
    metadata: parsed.data.metadata ?? {},
  });

  if (error) {
    return NextResponse.json({ message: "Failed to persist tracking event." }, { status: 500 });
  }

  return NextResponse.json({ message: "Tracking stored." });
}

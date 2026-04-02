import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  event_date_label: z.string().min(1),
  time_label: z.string().min(1),
  sort_order: z.number().min(0).optional(),
  is_active: z.boolean().optional(),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session?.admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = eventSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid event data" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ message: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        title: parsed.data.title,
        description: parsed.data.description,
        event_date_label: parsed.data.event_date_label,
        time_label: parsed.data.time_label,
        sort_order: parsed.data.sort_order ?? 0,
        is_active: parsed.data.is_active ?? true,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: "Failed to add event" }, { status: 500 });
  }

  return NextResponse.json({ event: data });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

const updateSchema = z.object({
  is_active: z.boolean().optional(),
});

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session?.admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json({ message: "Database not configured" }, { status: 503 });
  }

  const { error } = await supabase.from("events").delete().eq("id", parseInt(id));

  if (error) {
    return NextResponse.json({ message: "Failed to delete event" }, { status: 500 });
  }

  return NextResponse.json({ message: "Event deleted" });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session?.admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = await request.json();
  const parsed = updateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid update data" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ message: "Database not configured" }, { status: 503 });
  }

  const updateData: { is_active?: boolean } = {};
  if (parsed.data.is_active !== undefined) {
    updateData.is_active = parsed.data.is_active;
  }

  const { error } = await supabase.from("events").update(updateData).eq("id", parseInt(id));

  if (error) {
    return NextResponse.json({ message: "Failed to update event" }, { status: 500 });
  }

  return NextResponse.json({ message: "Event updated" });
}

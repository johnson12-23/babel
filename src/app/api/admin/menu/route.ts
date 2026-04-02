import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

const menuItemSchema = z.object({
  section_title: z.string().min(1),
  name: z.string().min(1),
  detail: z.string().min(1),
  price_ghs: z.number().min(0),
  sort_order: z.number().min(0).optional(),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session?.admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = menuItemSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid menu item data" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ message: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("menu_items")
    .insert([
      {
        section_title: parsed.data.section_title,
        name: parsed.data.name,
        detail: parsed.data.detail,
        price_ghs: parsed.data.price_ghs,
        sort_order: parsed.data.sort_order ?? 0,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: "Failed to add menu item" }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}

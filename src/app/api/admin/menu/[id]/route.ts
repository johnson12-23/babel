import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

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

  const { error } = await supabase.from("menu_items").delete().eq("id", parseInt(id));

  if (error) {
    return NextResponse.json({ message: "Failed to delete menu item" }, { status: 500 });
  }

  return NextResponse.json({ message: "Menu item deleted" });
}

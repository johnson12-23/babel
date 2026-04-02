import { getSupabaseServerPublicClient } from "@/lib/supabase";
import { MenuAdminContent } from "@/components/admin/menu-admin-content";
import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

type MenuItem = {
  id: number;
  section_title: string;
  name: string;
  detail: string;
  price_ghs: number;
  sort_order: number;
  is_active: boolean;
};

export default async function AdminMenuPage() {
  const session = await getAdminSession();
  if (!session?.admin) {
    redirect("/admin/login");
  }

  const supabase = getSupabaseServerPublicClient();

  let items: MenuItem[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true });

    items = (data ?? []) as MenuItem[];
  }

  return <MenuAdminContent initialItems={items} />;
}

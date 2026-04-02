import { fallbackEvents, menuSections } from "@/lib/site-content";
import { getSupabaseServerPublicClient } from "@/lib/supabase";

type CMSMenuItem = {
  section_title: string;
  name: string;
  detail: string;
  price_ghs: number;
  sort_order: number;
};

type CMSEvent = {
  title: string;
  description: string;
  event_date_label: string;
  time_label: string;
  sort_order: number;
};

export async function getMenuSectionsFromCMS() {
  const supabase = getSupabaseServerPublicClient();

  if (!supabase) {
    return menuSections;
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("section_title,name,detail,price_ghs,sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return menuSections;
  }

  const grouped = new Map<string, Array<{ name: string; detail: string; price: string }>>();

  for (const item of data as CMSMenuItem[]) {
    const bucket = grouped.get(item.section_title) ?? [];
    bucket.push({
      name: item.name,
      detail: item.detail,
      price: String(item.price_ghs),
    });
    grouped.set(item.section_title, bucket);
  }

  return Array.from(grouped.entries()).map(([title, items]) => ({ title, items }));
}

export async function getEventsFromCMS() {
  const supabase = getSupabaseServerPublicClient();

  if (!supabase) {
    return fallbackEvents;
  }

  const { data, error } = await supabase
    .from("events")
    .select("title,description,event_date_label,time_label,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackEvents;
  }

  return (data as CMSEvent[]).map((item) => ({
    title: item.title,
    description: item.description,
    eventDate: item.event_date_label,
    timeLabel: item.time_label,
  }));
}

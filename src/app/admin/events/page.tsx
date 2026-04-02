import { getSupabaseServerPublicClient } from "@/lib/supabase";
import { EventsAdminContent } from "@/components/admin/events-admin-content";
import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

type Event = {
  id: number;
  title: string;
  description: string;
  event_date_label: string;
  time_label: string;
  sort_order: number;
  is_active: boolean;
};

export default async function AdminEventsPage() {
  const session = await getAdminSession();
  if (!session?.admin) {
    redirect("/admin/login");
  }

  const supabase = getSupabaseServerPublicClient();

  let events: Event[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("sort_order", { ascending: true });

    events = (data ?? []) as Event[];
  }

  return <EventsAdminContent initialEvents={events} />;
}

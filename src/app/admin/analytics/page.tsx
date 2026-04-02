import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { AnalyticsDashboardContent } from "@/components/admin/analytics-dashboard-content";

type ConversionEvent = {
  id: number;
  event_name: string;
  metadata: Record<string, string | number>;
  created_at: string;
};

export default async function AdminAnalyticsPage() {
  const session = await getAdminSession();

  if (!session?.admin) {
    redirect("/admin/login");
  }

  const supabase = getSupabaseServiceClient();
  let events: ConversionEvent[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("conversion_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    events = (data ?? []) as ConversionEvent[];
  }

  return <AnalyticsDashboardContent events={events} dbConfigured={Boolean(supabase)} />;
}

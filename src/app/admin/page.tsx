import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { getSupabaseServerPublicClient } from "@/lib/supabase";
import { InboxDashboardContent } from "@/components/admin/inbox-dashboard-content";

type ContactInquiry = {
  id: number;
  full_name: string;
  email: string;
  inquiry_type: string;
  message: string;
  created_at: string;
};

type Reservation = {
  id: number;
  full_name: string;
  phone: string;
  guests: number;
  reservation_date: string;
  reservation_time: string;
  note: string;
  created_at: string;
};

export default async function AdminIndexPage() {
  const session = await getAdminSession();

  if (!session?.admin) {
    redirect("/admin/login");
  }

  const supabase = getSupabaseServerPublicClient();
  let contacts: ContactInquiry[] = [];
  let reservations: Reservation[] = [];

  if (supabase) {
    const [{ data: contactsData }, { data: reservationsData }] = await Promise.all([
      supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("reservations").select("*").order("created_at", { ascending: false }).limit(100),
    ]);

    contacts = (contactsData ?? []) as ContactInquiry[];
    reservations = (reservationsData ?? []) as Reservation[];
  }

  return (
    <InboxDashboardContent
      contacts={contacts}
      reservations={reservations}
      dbConfigured={Boolean(supabase)}
    />
  );
}

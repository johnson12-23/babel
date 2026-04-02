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

type InboxDashboardContentProps = {
  contacts: ContactInquiry[];
  reservations: Reservation[];
  dbConfigured: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function InboxDashboardContent({ contacts, reservations, dbConfigured }: InboxDashboardContentProps) {
  if (!dbConfigured) {
    return (
      <section className="luxury-glow rounded-2xl border border-mist/25 bg-charcoal/55 p-6">
        <h1 className="text-3xl font-semibold text-cream">Admin Inbox</h1>
        <p className="mt-3 text-sm text-mist">
          Supabase is not configured yet. Add environment keys to load contact and reservation data.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-semibold text-cream">Admin Inbox</h1>
        <p className="mt-2 text-sm text-mist">Latest contacts and reservation requests from the website.</p>
      </section>

      <section className="luxury-glow rounded-2xl border border-mist/25 bg-charcoal/55 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-gold">Contact Messages</h2>
          <p className="text-xs font-semibold tracking-wider text-mist">{contacts.length} total</p>
        </div>

        {contacts.length === 0 ? (
          <p className="mt-5 text-sm text-mist">No contact messages yet.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-mist/20 text-mist">
                  <th className="px-3 py-3 text-left">Name</th>
                  <th className="px-3 py-3 text-left">Email</th>
                  <th className="px-3 py-3 text-left">Type</th>
                  <th className="px-3 py-3 text-left">Message</th>
                  <th className="px-3 py-3 text-left">Received</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((item) => (
                  <tr key={item.id} className="border-b border-mist/10 align-top">
                    <td className="px-3 py-3 text-cream">{item.full_name}</td>
                    <td className="px-3 py-3 text-mist">{item.email}</td>
                    <td className="px-3 py-3 text-gold">{item.inquiry_type}</td>
                    <td className="px-3 py-3 text-mist">{item.message}</td>
                    <td className="px-3 py-3 text-mist">{formatDate(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="luxury-glow rounded-2xl border border-mist/25 bg-charcoal/55 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-gold">Reservations</h2>
          <p className="text-xs font-semibold tracking-wider text-mist">{reservations.length} total</p>
        </div>

        {reservations.length === 0 ? (
          <p className="mt-5 text-sm text-mist">No reservation requests yet.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-mist/20 text-mist">
                  <th className="px-3 py-3 text-left">Guest</th>
                  <th className="px-3 py-3 text-left">Phone</th>
                  <th className="px-3 py-3 text-left">Guests</th>
                  <th className="px-3 py-3 text-left">Date</th>
                  <th className="px-3 py-3 text-left">Time</th>
                  <th className="px-3 py-3 text-left">Notes</th>
                  <th className="px-3 py-3 text-left">Requested</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((item) => (
                  <tr key={item.id} className="border-b border-mist/10 align-top">
                    <td className="px-3 py-3 text-cream">{item.full_name}</td>
                    <td className="px-3 py-3 text-mist">{item.phone}</td>
                    <td className="px-3 py-3 text-gold">{item.guests}</td>
                    <td className="px-3 py-3 text-mist">{item.reservation_date}</td>
                    <td className="px-3 py-3 text-mist">{item.reservation_time}</td>
                    <td className="px-3 py-3 text-mist">{item.note || "-"}</td>
                    <td className="px-3 py-3 text-mist">{formatDate(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

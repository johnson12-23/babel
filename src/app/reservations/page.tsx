import { ReservationForm } from "@/components/forms/reservation-form";
import { Reveal } from "@/components/ui/reveal";
import { TrackLink } from "@/components/ui/track-link";

export default function ReservationsPage() {
  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.3em] text-mist">Reservations</p>
          <h1 className="mt-3 text-5xl font-semibold text-cream sm:text-6xl">Secure Your Table</h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-mist">
            Book dinner, birthdays, business nights, or intimate date experiences. Our team confirms quickly and can tailor seating preferences where available.
          </p>
          <div className="mt-8 rounded-2xl border border-mist/20 bg-charcoal/40 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-mist">Direct Line</p>
            <p className="mt-2 text-2xl font-semibold text-gold">+233 20 000 0600</p>
            <p className="mt-3 text-sm text-mist">Open daily. Last service window closes around midnight.</p>
            <TrackLink
              href="https://wa.me/233200000600?text=Hello%20Babel%2C%20I%20want%20to%20reserve%20a%20table."
              eventName="reservation_whatsapp_click"
              target="_blank"
              className="mt-4 inline-flex rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold tracking-wider text-gold transition hover:border-gold hover:bg-gold/10"
            >
              Or Book On WhatsApp
            </TrackLink>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ReservationForm />
        </Reveal>
      </div>
    </section>
  );
}

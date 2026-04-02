import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-mist/15 bg-charcoal/75 px-5 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <p className="text-2xl font-semibold tracking-[0.2em] text-gold">BABEL</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">
            Elevated Mediterranean and seafood dining in Accra, crafted for memorable evenings.
          </p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cream">Visit</p>
          <p className="mt-3 text-sm text-mist">HR9J+95, Accra</p>
          <p className="text-sm text-mist">+233 20 000 0600</p>
          <p className="text-sm text-mist">Open daily, closes 12:00 AM</p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cream">Book</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-mist">
            <Link href="/reservations" className="transition hover:text-gold">
              Reserve a table
            </Link>
            <Link href="/menu" className="transition hover:text-gold">
              Browse menu
            </Link>
            <Link href="/events" className="transition hover:text-gold">
              See upcoming events
            </Link>
            <Link href="/faq" className="transition hover:text-gold">
              Read FAQs
            </Link>
            <Link href="/contact" className="transition hover:text-gold">
              Private dining inquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
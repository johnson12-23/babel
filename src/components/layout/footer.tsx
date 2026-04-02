import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mist/15 bg-charcoal/75 px-4 py-7 sm:px-8 sm:py-8 lg:px-12 lg:py-9">
      <div className="mx-auto grid max-w-7xl gap-6 sm:gap-7 md:grid-cols-3 md:gap-8">
        <div>
          <p className="text-xl font-semibold tracking-[0.2em] text-gold sm:text-2xl">BABEL</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-mist">
            Elevated Mediterranean and seafood dining in Accra, crafted for memorable evenings.
          </p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cream">Visit</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-mist">HR9J+95, Accra</p>
            <p className="text-sm text-mist">+233 20 000 0600</p>
            <p className="text-sm text-mist">Open daily, closes 12:00 AM</p>
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cream">Book</p>
          <div className="mt-2 flex flex-col gap-1.5 text-sm text-mist">
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

      <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-2 border-t border-mist/15 pt-4 text-xs text-mist sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p>
          Copyright © {year} Babel Restaurant Ghana. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="transition hover:text-gold">
            Privacy Policy
          </Link>
          <Link href="/" className="transition hover:text-gold">
            Terms of Service
          </Link>
          <Link href="/" className="transition hover:text-gold">
            Cookie Notice
          </Link>
        </div>
      </div>
    </footer>
  );
}
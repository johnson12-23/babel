import { PhotoShowcase } from "@/components/sections/photo-showcase";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { TrackLink } from "@/components/ui/track-link";
import { getEventsFromCMS } from "@/lib/cms";
import { featuredDishes, quickStats, reviewHighlights } from "@/lib/site-content";

export default async function Home() {
  const events = await getEventsFromCMS();

  return (
    <div className="noise-overlay">
      <section className="hero-backdrop relative overflow-hidden px-4 pt-14 pb-16 sm:px-8 sm:pt-16 sm:pb-20 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <Reveal>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-mist">Accra | Since 2018</p>
            <h1 className="max-w-2xl text-5xl leading-[0.95] font-semibold text-cream sm:text-7xl">
              Babel Restaurant Ghana
              <span className="block text-gold">A luxury dining pulse in the city.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
              Elevated Mediterranean and seafood plates, immersive atmosphere, and attentive service that keeps Accra returning again and again.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <TrackLink
                href="/reservations"
                eventName="hero_reserve_click"
                className="rounded-full bg-gold px-6 py-3 text-sm font-semibold tracking-wide text-onyx transition hover:scale-[1.02]"
              >
                Reserve A Table
              </TrackLink>
              <TrackLink
                href="/menu"
                eventName="hero_menu_click"
                className="rounded-full border border-mist/45 px-6 py-3 text-sm font-semibold tracking-wide text-cream transition hover:border-gold hover:text-gold"
              >
                Explore Menu
              </TrackLink>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <GlassCard className="floating">
              <p className="text-xs uppercase tracking-[0.25em] text-mist">Tonight&apos;s Signature</p>
              <h2 className="mt-2 text-3xl font-semibold text-cream">Paella Seafood</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Saffron rice, charred prawns, mussels, citrus aioli, and smoked pepper oil.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl border border-mist/20 bg-charcoal/35 p-3">
                  <p className="text-mist">Rating</p>
                  <p className="text-xl font-semibold text-gold">4.4 / 5</p>
                </div>
                <div className="rounded-xl border border-mist/20 bg-charcoal/35 p-3">
                  <p className="text-mist">Reviews</p>
                  <p className="text-xl font-semibold text-gold">424+</p>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
          {quickStats.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.08}>
              <GlassCard>
                <p className="text-sm uppercase tracking-wider text-mist">{item.label}</p>
                <p className="mt-2 text-4xl font-semibold text-gold">{item.value}</p>
                <p className="mt-3 text-sm text-mist">{item.caption}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-4xl font-semibold text-cream sm:text-5xl">Featured Dishes</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredDishes.map((dish, idx) => (
              <Reveal key={dish.name} delay={idx * 0.08}>
                <GlassCard className="h-full">
                  <p className="text-xs uppercase tracking-[0.25em] text-mist">{dish.category}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-cream">{dish.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{dish.description}</p>
                  <p className="mt-5 text-sm font-semibold tracking-wide text-gold">{dish.price}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PhotoShowcase />

      <section className="px-4 pt-4 pb-16 sm:px-8 sm:pb-20 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-gold/30 bg-charcoal/65 p-6 backdrop-blur-sm sm:p-10">
          <Reveal>
            <h2 className="text-3xl font-semibold text-cream sm:text-4xl">What Guests Love</h2>
          </Reveal>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {reviewHighlights.map((review, idx) => (
              <Reveal key={review.author} delay={idx * 0.08}>
                <blockquote className="rounded-2xl border border-mist/25 bg-onyx/80 p-5">
                  <p className="text-sm leading-relaxed text-mist">&ldquo;{review.quote}&rdquo;</p>
                  <footer className="mt-4 text-sm font-semibold text-cream">{review.author}</footer>
                </blockquote>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.24} className="mt-9">
            <h3 className="text-2xl font-semibold text-cream">Upcoming Moments</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {events.map((event) => (
                <div key={event.title} className="rounded-xl border border-mist/25 bg-onyx/80 p-4">
                  <p className="text-lg font-semibold text-gold">{event.title}</p>
                  <p className="mt-2 text-sm text-mist">{event.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-cream">{event.eventDate}</p>
                  <p className="text-xs uppercase tracking-wider text-mist">{event.timeLabel}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

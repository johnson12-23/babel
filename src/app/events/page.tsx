import { Reveal } from "@/components/ui/reveal";
import { getEventsFromCMS } from "@/lib/cms";

export default async function EventsPage() {
  const events = await getEventsFromCMS();

  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.3em] text-mist">Events</p>
          <h1 className="mt-3 text-5xl font-semibold text-cream sm:text-6xl">Nights Worth Dressing Up For</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist">
            From curated tasting dinners to elegant private celebrations, Babel events blend flavor, sound, and atmosphere into unforgettable nights.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {events.map((event, idx) => (
            <Reveal key={event.title} delay={idx * 0.08}>
              <article className="luxury-glow rounded-2xl border border-mist/25 bg-charcoal/55 p-6 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.25em] text-mist">{event.eventDate}</p>
                <h2 className="mt-2 text-2xl font-semibold text-gold">{event.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">{event.description}</p>
                <p className="mt-5 text-sm font-semibold tracking-wide text-cream">{event.timeLabel}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

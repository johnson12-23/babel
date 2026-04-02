import { Reveal } from "@/components/ui/reveal";

const gallery = [
  {
    title: "Chef's Counter",
    subtitle: "Heat, steel, and saffron in perfect rhythm",
    gradient: "from-rose-smoke/50 via-charcoal/40 to-onyx",
  },
  {
    title: "Terrace Glow",
    subtitle: "Golden lights and candlelit conversations",
    gradient: "from-gold/30 via-onyx to-charcoal",
  },
  {
    title: "Signature Pour",
    subtitle: "House-crafted blends and slow evenings",
    gradient: "from-sand/35 via-charcoal/40 to-onyx",
  },
];

export function PhotoShowcase() {
  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.3em] text-mist">Atmosphere</p>
          <h2 className="mt-3 text-4xl font-semibold text-cream sm:text-5xl">A Cinematic Dining Mood</h2>
        </Reveal>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {gallery.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.08}>
              <article className={`relative min-h-64 overflow-hidden rounded-2xl border border-mist/25 bg-gradient-to-br ${item.gradient} p-6`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.22),transparent_44%)]" />
                <div className="relative flex h-full flex-col justify-end">
                  <p className="text-2xl font-semibold text-cream">{item.title}</p>
                  <p className="mt-2 text-sm text-mist">{item.subtitle}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { getMenuSectionsFromCMS } from "@/lib/cms";

export default async function MenuPage() {
  const menuSections = await getMenuSectionsFromCMS();

  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.3em] text-mist">Babel Menu</p>
          <h1 className="mt-3 text-5xl font-semibold text-cream sm:text-6xl">Crafted For Indulgence</h1>
        </Reveal>

        <div className="mt-10 space-y-8">
          {menuSections.map((section, idx) => (
            <Reveal key={section.title} delay={idx * 0.08}>
              <GlassCard>
                <h2 className="text-3xl font-semibold text-gold">{section.title}</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {section.items.map((item) => (
                    <div key={item.name} className="rounded-xl border border-mist/20 bg-onyx/40 p-4">
                      <p className="text-lg font-semibold text-cream">{item.name}</p>
                      <p className="mt-2 text-sm text-mist">{item.detail}</p>
                      <p className="mt-3 text-sm font-semibold text-gold">GHS {item.price}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

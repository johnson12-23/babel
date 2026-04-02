import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";

export default function AboutPage() {
  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.3em] text-mist">Our Story</p>
          <h1 className="mt-3 text-5xl font-semibold text-cream sm:text-6xl">The Babel Experience</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mist">
            Babel Restaurant Ghana is built around flavor precision, warm hospitality, and immersive ambiance. Guests repeatedly praise attentive service, memorable seafood, and an atmosphere made for celebrations and date nights.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-mist">
            We also listen deeply. Feedback around service speed and overstimulation has helped us design smoother table flow and calmer service pacing, while preserving the vibrant energy that makes Babel iconic in Accra.
          </p>
        </Reveal>

        <div className="space-y-5">
          <Reveal delay={0.08}>
            <GlassCard>
              <p className="text-sm uppercase tracking-[0.25em] text-mist">Strength</p>
              <h2 className="mt-2 text-2xl font-semibold text-gold">Hospitality That Stands Out</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Personalized staff interactions and owner-level care make guests feel known, not processed.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.16}>
            <GlassCard>
              <p className="text-sm uppercase tracking-[0.25em] text-mist">Strength</p>
              <h2 className="mt-2 text-2xl font-semibold text-gold">Food Worth Returning For</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Signature dishes like Paella Seafood and Frakeh Fish lead a menu where bold flavor meets polished presentation.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.24}>
            <GlassCard>
              <p className="text-sm uppercase tracking-[0.25em] text-mist">Promise</p>
              <h2 className="mt-2 text-2xl font-semibold text-gold">Always Evolving</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Every review informs training, pacing, and spatial comfort to keep the experience aligned with luxury expectations.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

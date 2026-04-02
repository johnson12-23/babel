import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/ui/reveal";

export default function ContactPage() {
  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.3em] text-mist">Contact</p>
          <h1 className="mt-3 text-5xl font-semibold text-cream sm:text-6xl">Let&apos;s Plan Your Occasion</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mist">
            Reach out for private dining, group celebrations, partnership requests, or concierge support.
          </p>
          <div className="mt-8 space-y-3 text-sm text-mist">
            <p>Phone: +233 20 000 0600</p>
            <p>Address: HR9J+95, Accra</p>
            <p>Service: Dine-in, takeaway, delivery</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

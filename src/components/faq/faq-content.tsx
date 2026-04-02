"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { trackConversion } from "@/lib/tracking";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSection = {
  title: string;
  items: FaqItem[];
};

type FaqContentProps = {
  sections: FaqSection[];
};

export function FaqContent({ sections }: FaqContentProps) {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("All");

  const sectionNames = useMemo(() => ["All", ...sections.map((section) => section.title)], [sections]);

  const filteredSections = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return sections
      .filter((section) => activeSection === "All" || section.title === activeSection)
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!normalized) {
            return true;
          }

          return (
            item.question.toLowerCase().includes(normalized) ||
            item.answer.toLowerCase().includes(normalized)
          );
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [sections, activeSection, query]);

  function handleSearchChange(value: string) {
    setQuery(value);
    void trackConversion("faq_search_used", { queryLength: value.length });
  }

  return (
    <section className="px-5 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.3em] text-mist">FAQ</p>
          <h1 className="mt-3 text-5xl font-semibold text-cream sm:text-6xl">Everything Guests Ask Most</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist">
            Quick answers about reservations, menu choices, private events, and service details so you can plan your perfect Babel experience.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 rounded-2xl border border-mist/20 bg-charcoal/45 p-5">
            <label className="text-xs uppercase tracking-[0.2em] text-mist">Search questions</label>
            <input
              value={query}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by reservation, allergy, events, delivery..."
              className="mt-2 w-full rounded-xl border border-mist/30 bg-onyx/70 px-4 py-3 text-sm text-cream outline-none focus:border-gold"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {sectionNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setActiveSection(name)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider transition ${
                    activeSection === name
                      ? "bg-gold text-onyx"
                      : "border border-mist/30 text-mist hover:border-gold hover:text-gold"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 space-y-8">
          {filteredSections.length === 0 && (
            <Reveal>
              <article className="rounded-2xl border border-mist/20 bg-charcoal/45 p-6">
                <p className="text-sm text-mist">No FAQ results matched your search. Try a different keyword.</p>
              </article>
            </Reveal>
          )}

          {filteredSections.map((section, sectionIndex) => (
            <Reveal key={section.title} delay={sectionIndex * 0.08}>
              <article className="luxury-glow rounded-2xl border border-mist/25 bg-charcoal/55 p-6 backdrop-blur-md">
                <h2 className="text-2xl font-semibold text-gold">{section.title}</h2>
                <div className="mt-5 space-y-3">
                  {section.items.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-xl border border-mist/20 bg-onyx/45 px-4 py-3 open:border-gold/45"
                      onToggle={(event) => {
                        const target = event.currentTarget;
                        if (target.open) {
                          void trackConversion("faq_question_opened", {
                            question: item.question,
                            section: section.title,
                          });
                        }
                      }}
                    >
                      <summary className="cursor-pointer list-none pr-6 text-base font-semibold text-cream marker:hidden">
                        {item.question}
                        <span className="float-right text-gold transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-mist">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.18}>
          <div className="mt-12 rounded-2xl border border-gold/30 bg-gradient-to-r from-charcoal/80 to-onyx/70 p-6">
            <h3 className="text-2xl font-semibold text-cream">Need Personal Help?</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
              If your request is specific, reach out and we will tailor your dining plan.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/reservations"
                className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-onyx transition hover:scale-[1.02]"
              >
                Reserve A Table
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-mist/40 px-5 py-2 text-sm font-semibold text-cream transition hover:border-gold hover:text-gold"
              >
                Contact Team
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

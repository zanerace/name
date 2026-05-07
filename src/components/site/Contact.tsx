const links = [
  { label: "Behance", href: "https://www.behance.net/racekipping" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/race-kipping-2008a0299/" },
  { label: "YouTube", href: "https://www.youtube.com/@racekipping" },
];

export function Contact() {
  return (
    <section id="contact" className="py-32 md:py-48 border-t border-[var(--rule)]">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 grid grid-cols-12 gap-x-10 gap-y-16">
        <header className="col-span-12 md:col-span-5 reveal">
          <p className="font-ui text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
            § 04
          </p>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight leading-[0.95]">
            Currently
            <br />
            taking on
            <br />
            <span className="font-serif-i text-accent">new work.</span>
          </h2>
        </header>

        <div className="col-span-12 md:col-start-7 md:col-span-6 reveal" style={{ transitionDelay: "120ms" }}>
          <dl className="space-y-10">
            <div>
              <dt className="font-ui text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Email
              </dt>
              <dd>
                <a
                  href="mailto:info@racekipping.com"
                  className="font-display text-2xl md:text-3xl link-underline"
                >
                  info@racekipping.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-ui text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Phone
              </dt>
              <dd>
                <a href="tel:+16187998495" className="font-display text-2xl md:text-3xl link-underline">
                  +1 (618) 799 8495
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-ui text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Elsewhere
              </dt>
              <dd className="flex flex-wrap gap-x-8 gap-y-3">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-xl link-underline"
                  >
                    {l.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

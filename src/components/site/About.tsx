const capabilities = [
  "Graphic Design",
  "Motion Graphics",
  "Video Editing",
  "Audio Engineering",
  "Generative AI Workflows",
  "Photography",
  "Web Design",
];

export function About() {
  return (
    <section id="about" className="py-32 md:py-48 border-t border-[var(--rule)]">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <header className="reveal mb-20 md:mb-28">
          <p className="font-ui text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
            § 03
          </p>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight">About</h2>
        </header>

        <div className="grid grid-cols-12 gap-x-10 gap-y-16">
          <div className="col-span-12 md:col-span-7 reveal">
            <p className="font-serif text-xl md:text-2xl leading-[1.55] text-foreground/95">
              Race Kipping is a media designer working across identity, motion, and sound. The practice
              draws from a decade in professional kitchens and recording studios — disciplines built on
              tempo, restraint, and the seriousness of small choices.
            </p>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground mt-8 max-w-2xl">
              He holds an AFA in Graphic Communications from St. Louis Community College, May 2026.
              Current work centers on type, broadcast graphics, and AI-augmented production systems for
              independent studios and cultural clients.
            </p>
          </div>

          <div className="col-span-12 md:col-start-9 md:col-span-4 reveal" style={{ transitionDelay: "120ms" }}>
            <p className="font-ui text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-6">
              Capabilities
            </p>
            <ul className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
              {capabilities.map((c, i) => (
                <li key={c} className="flex items-baseline justify-between py-4 group">
                  <span className="font-display text-lg group-hover:text-accent transition-colors">
                    {c}
                  </span>
                  <span className="font-ui text-[11px] tracking-[0.2em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

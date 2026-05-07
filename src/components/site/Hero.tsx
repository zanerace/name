export function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex flex-col">
      <div className="flex-1 mx-auto w-full max-w-[1440px] px-6 md:px-12 pt-40 md:pt-48 pb-24 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-10">
          <h1 className="font-display text-[14vw] md:text-[10.5vw] leading-[0.92] tracking-[-0.04em]">
            Race
            <br />
            Kipping
          </h1>
          <p className="font-serif-i text-2xl md:text-3xl text-muted-foreground mt-8 md:mt-10">
            Media Designer
          </p>
        </div>
        <div className="col-span-12 md:col-start-7 md:col-span-6 mt-16 md:mt-24">
          <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90 max-w-xl">
            I design at the intersection of identity, motion, and sound. Background in cooking and music
            shapes how I approach the work — simple ingredients, deliberate process, considered outcome.
          </p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 pb-10 flex items-end justify-between font-ui text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
        <span>St. Louis · 2026</span>
        <a href="#work" className="group inline-flex items-center gap-3 hover:text-foreground transition-colors">
          <span>Scroll</span>
          <span className="block h-px w-12 bg-current group-hover:w-20 transition-all duration-500" />
        </a>
        <span className="hidden md:inline">Index 01 / 05</span>
      </div>
    </section>
  );
}

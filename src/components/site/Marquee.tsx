const MARQUEE_TOKENS = [
  "Identity",
  "Motion",
  "Type Design",
  "Audio Engineering",
  "AI Pipelines",
  "Video Editing",
] as const;

const MARQUEE_REPEAT = 4;

const Separator = () => (
  <span className="font-sans not-italic mx-3 align-middle" aria-hidden="true">
    ·
  </span>
);

const MarqueeRun = () => (
  <>
    {Array.from({ length: MARQUEE_REPEAT }).map((_, runIdx) =>
      MARQUEE_TOKENS.map((token, tokenIdx) => (
        <span key={`${runIdx}-${tokenIdx}`} className="inline-block">
          {token}
          <Separator />
        </span>
      )),
    )}
  </>
);

/**
 * Slow horizontal scrolling type strip between Hero and Selected Work.
 * Two identical runs sit inside .marquee-track; CSS keyframes translate
 * the track 0% → -50%, so the loop is seamless.
 *
 * No scroll-driven entrance — the strip simply exists, looping at 90s.
 * Honors prefers-reduced-motion via the global media query in styles.css.
 */
export function Marquee() {
  return (
    <section
      aria-hidden="true"
      className="work-wash py-[54px] md:py-[92px] border-t border-[color:var(--border)] w-full max-w-full overflow-x-hidden marquee-shell"
    >
      <div className="marquee hidden md:block">
        <div className="marquee-track marquee-text font-serif-i text-muted-foreground leading-none whitespace-nowrap">
          <span className="inline-block">
            <MarqueeRun />
          </span>
          <span className="inline-block" aria-hidden="true">
            <MarqueeRun />
          </span>
        </div>
      </div>
      <div className="md:hidden px-6">
        <p className="font-serif-i text-[19px] leading-[1.55] text-[color:var(--text-soft)] whitespace-normal break-words">
          {MARQUEE_TOKENS.join(" · ")}
        </p>
      </div>
    </section>
  );
}

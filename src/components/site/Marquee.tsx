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
      ))
    )}
  </>
);

/**
 * Slow horizontal scrolling type strip between Hero and Selected Work.
 * Two identical runs sit inside .marquee-track; CSS keyframes translate
 * the track 0% → -50%, so the loop is seamless.
 *
 * No scroll-driven entrance — the strip simply exists, looping at 60s.
 * Honors prefers-reduced-motion via the global media query in styles.css.
 */
export function Marquee() {
  return (
    <section
      aria-hidden="true"
      className="py-14 md:py-24 border-y border-border w-full max-w-full overflow-x-hidden"
    >
      <div className="marquee">
        <div className="marquee-track marquee-text font-serif-i text-muted-foreground leading-none whitespace-nowrap">
          <span className="inline-block">
            <MarqueeRun />
          </span>
          <span className="inline-block" aria-hidden="true">
            <MarqueeRun />
          </span>
        </div>
      </div>
    </section>
  );
}

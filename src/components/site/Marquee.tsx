const MARQUEE_TOKENS = [
  "Identity",
  "Motion",
  "Type Design",
  "Audio Engineering",
  "AI Pipelines",
  "Video Editing",
] as const;

const SEPARATOR = " \u00B7 ";

const buildLoop = () =>
  MARQUEE_TOKENS.join(SEPARATOR) + SEPARATOR;

/**
 * Slow horizontal scrolling type strip. Sits between Hero and Selected Work.
 * Two copies of the same text live inside .marquee-track; CSS keyframes
 * translate the track from 0 to -50%, so the loop is seamless.
 *
 * Honors prefers-reduced-motion via the global media query in styles.css.
 */
export function Marquee() {
  const loop = buildLoop();
  return (
    <section
      aria-hidden="true"
      className="py-20 md:py-24 border-y border-border"
    >
      <div className="marquee">
        <div className="marquee-track font-serif-i text-muted-foreground leading-none whitespace-nowrap">
          <span
            className="inline-block pr-12"
            style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
          >
            {loop.repeat(4)}
          </span>
          <span
            className="inline-block pr-12"
            style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
            aria-hidden="true"
          >
            {loop.repeat(4)}
          </span>
        </div>
      </div>
    </section>
  );
}

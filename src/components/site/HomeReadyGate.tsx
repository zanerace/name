import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

type Props = {
  progress: number;
  onExited: () => void;
};

/**
 * Full-screen preload gate. Exits with a GSAP animation once progress reaches 1.
 */
export function HomeReadyGate({ progress, onExited }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const exitingRef = useRef(false);

  useEffect(() => {
    if (progress < 1 || exitingRef.current) return;
    exitingRef.current = true;

    const el = rootRef.current;
    if (!el || prefersReducedMotion()) {
      onExited();
      return;
    }

    gsap.to(el, {
      opacity: 0,
      y: -6,
      duration: 0.5,
      ease: "power2.inOut",
      delay: 0.1,
      onComplete: onExited,
    });
  }, [progress, onExited]);

  const pct = Math.round(progress * 100);

  return (
    <div
      ref={rootRef}
      className="gate-root fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-busy={progress < 1}
      aria-label={`Loading: ${pct}%`}
    >
      {/* Editorial wordmark */}
      <div className="gate-wordmark mb-14 md:mb-16">
        <p className="font-display gate-name leading-none select-none">Race Kipping</p>
      </div>

      {/* Progress track */}
      <div className="gate-track-wrap w-full max-w-[260px] md:max-w-[320px]">
        <div
          ref={barRef}
          className="gate-track h-px w-full bg-[color:var(--border-strong)] relative overflow-hidden"
        >
          <div
            className="gate-fill absolute inset-y-0 left-0 bg-accent transition-none"
            style={{
              width: `${pct}%`,
              transition: "width 120ms linear",
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="font-ui text-[9px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
            Loading
          </p>
          <p className="font-ui text-[9px] uppercase tracking-[0.16em] text-[color:var(--muted-foreground)] tabular-nums">
            {pct}%
          </p>
        </div>
      </div>
    </div>
  );
}

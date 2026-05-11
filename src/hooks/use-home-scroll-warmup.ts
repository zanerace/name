import { useEffect, useState } from "react";
import { warmHomeScrollAssets } from "@/lib/home-readiness";

/** Minimum time the loading gate stays up so navigation feels intentional (~1–2s). */
const MIN_GATE_MS = 1400;
/** Safety cap if decode or fonts hang on slow networks. */
const MAX_GATE_MS = 12000;

export type HomeWarmupState = {
  ready: boolean;
  progress: number;
  /** Full-screen preload overlay; true until warmup + minimum dwell complete. */
  showGate: boolean;
};

/**
 * Homepage-only: full-screen gate on every visit while fonts + images decode and
 * ScrollTrigger refreshes in the background. Dismisses after `MIN_GATE_MS` and when
 * `warmHomeScrollAssets` has finished (whichever is later), or `MAX_GATE_MS` at latest.
 */
export function useHomeScrollWarmup(): HomeWarmupState {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    let minTimer = 0;
    const minDelay = new Promise<void>((resolve) => {
      minTimer = window.setTimeout(resolve, MIN_GATE_MS);
    });

    const maxTimer = window.setTimeout(() => {
      if (!cancelled) {
        setProgress(1);
        setReady(true);
      }
    }, MAX_GATE_MS);

    const run = () => {
      void Promise.all([
        warmHomeScrollAssets((t) => {
          if (!cancelled) setProgress(t);
        }),
        minDelay,
      ])
        .then(() => {
          if (cancelled) return;
          window.clearTimeout(maxTimer);
          setProgress(1);
          setReady(true);
        })
        .catch(() => {
          if (cancelled) return;
          window.clearTimeout(maxTimer);
          setProgress(1);
          setReady(true);
        });
    };

    // One frame so the gate paints before decode / font work runs.
    const raf = requestAnimationFrame(run);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
    };
  }, []);

  return { ready, progress, showGate: !ready };
}

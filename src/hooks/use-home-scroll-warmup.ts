import { useCallback, useEffect, useState } from "react";
import { warmHomeScrollAssets } from "@/lib/home-readiness";

/** Minimum time the loading gate stays up so it feels intentional. */
const MIN_GATE_MS = 800;
/** Safety cap if decode hangs on a slow network. */
const MAX_GATE_MS = 12000;

export type HomeWarmupState = {
  ready: boolean;
  progress: number;
  showGate: boolean;
  dismissGate: () => void;
};

export function useHomeScrollWarmup(): HomeWarmupState {
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
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

    const raf = requestAnimationFrame(run);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
    };
  }, []);

  const dismissGate = useCallback(() => setDismissed(true), []);

  return { ready, progress, showGate: !dismissed, dismissGate };
}

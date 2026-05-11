import { useEffect } from "react";
import { initLenis, destroyLenis } from "@/lib/lenis";
import { scheduleScrollTriggerRefresh } from "@/lib/scroll-trigger-schedule";

/**
 * Mount once near the top of the tree. Delegates Lenis lifecycle to the
 * canonical singleton in `@/lib/lenis`. Lenis runs unconditionally on every
 * device — `syncTouch: false` defers to native momentum on phones, and
 * reduced-motion is honored via CSS only.
 */
export function SmoothScroll() {
  useEffect(() => {
    initLenis();

    // Refresh ScrollTrigger after the next frame so any triggers registered
    // by sibling components on the same paint pass have correct positions.
    const raf = requestAnimationFrame(() => scheduleScrollTriggerRefresh());

    return () => {
      cancelAnimationFrame(raf);
      destroyLenis();
    };
  }, []);

  return null;
}

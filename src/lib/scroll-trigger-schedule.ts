import { ScrollTrigger } from "gsap/ScrollTrigger";

let refreshRaf = 0;

/**
 * Coalesce multiple `ScrollTrigger.refresh()` calls (fonts, images, warmup)
 * into a single rAF — avoids refresh storms during layout churn.
 */
export function scheduleScrollTriggerRefresh(): void {
  if (typeof window === "undefined") return;
  if (refreshRaf) return;
  refreshRaf = requestAnimationFrame(() => {
    refreshRaf = 0;
    ScrollTrigger.refresh();
  });
}

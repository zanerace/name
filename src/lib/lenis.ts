import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollTriggerRefresh } from "@/lib/scroll-trigger-schedule";

/**
 * Canonical Lenis lifecycle. All Lenis state lives here:
 *   - `initLenis()` constructs the singleton (idempotent — second call warns + returns existing).
 *   - `destroyLenis()` tears it down and removes the GSAP ticker handle.
 *   - `getLenisInstance()` is the only read API for the rest of the app.
 *
 * Init must run **inside a browser context** (call from a useEffect, not module
 * scope). TanStack Start renders on the server first; calling `new Lenis(...)`
 * during SSR would throw.
 */

type LenisWindow = typeof window & { __lenis?: Lenis };

let lenisInstance: Lenis | null = null;
let tickerHandle: ((time: number) => void) | null = null;
let registered = false;
let scrollTriggerRafId = 0;

export const lenisDefaultEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function createLenisOptions(): NonNullable<ConstructorParameters<typeof Lenis>[0]> {
  return {
    /* Premium decel: 1.1 feels cinematic without being sluggish (Netflix/HBO range). */
    duration: 1.1,
    easing: lenisDefaultEasing,
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    /* Slightly less aggressive wheel = more controlled, intentional feel. */
    wheelMultiplier: 0.92,
    touchMultiplier: 2,
    syncTouch: false,
    infinite: false,
    autoRaf: false,
  };
}

export function initLenis(): Lenis {
  if (typeof window === "undefined") {
    throw new Error("[Lenis] initLenis called outside the browser.");
  }
  if (lenisInstance) {
    return lenisInstance;
  }

  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    /* Avoid promoting every tween target to its own layer — big RAM win on Chrome during scroll. */
    gsap.config({ force3D: false });
    registered = true;
  }

  const lenis = new Lenis(createLenisOptions());
  /* Coalesce with rAF: Lenis can emit scroll more than once per frame; ScrollTrigger only needs one update per paint. */
  lenis.on("scroll", () => {
    if (scrollTriggerRafId) return;
    scrollTriggerRafId = requestAnimationFrame(() => {
      scrollTriggerRafId = 0;
      ScrollTrigger.update();
    });
  });

  tickerHandle = (time) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerHandle);
  gsap.ticker.lagSmoothing(0);

  lenis.start();

  lenisInstance = lenis;
  (window as LenisWindow).__lenis = lenis;

  return lenis;
}

export function destroyLenis() {
  if (scrollTriggerRafId) {
    cancelAnimationFrame(scrollTriggerRafId);
    scrollTriggerRafId = 0;
  }
  if (tickerHandle) {
    gsap.ticker.remove(tickerHandle);
    tickerHandle = null;
  }
  if (lenisInstance) {
    if (typeof window !== "undefined") {
      (window as LenisWindow).__lenis = undefined;
    }
    lenisInstance.destroy();
    lenisInstance = null;
  }
  scheduleScrollTriggerRefresh();
}

export function getLenisInstance(): Lenis | null {
  return lenisInstance;
}

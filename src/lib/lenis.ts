import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export const lenisDefaultEasing = (t: number) =>
  Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function createLenisOptions(): NonNullable<
  ConstructorParameters<typeof Lenis>[0]
> {
  return {
    duration: 1.2,
    easing: lenisDefaultEasing,
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
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
    console.warn(
      "[Lenis] initLenis called more than once — returning existing instance."
    );
    return lenisInstance;
  }

  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    registered = true;
  }

  const lenis = new Lenis(createLenisOptions());
  lenis.on("scroll", ScrollTrigger.update);

  tickerHandle = (time) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerHandle);
  gsap.ticker.lagSmoothing(0);

  lenis.start();

  lenisInstance = lenis;
  (window as LenisWindow).__lenis = lenis;

  console.log(
    "[Lenis] initialized — isSmooth:",
    lenis.isSmooth,
    "smoothWheel:",
    lenis.options.smoothWheel
  );

  return lenis;
}

export function destroyLenis() {
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
  ScrollTrigger.refresh();
}

export function getLenisInstance(): Lenis | null {
  return lenisInstance;
}

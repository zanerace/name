import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: false });
    registered = true;
  }
  return !prefersReducedMotion();
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Touch / coarse-pointer device detection. Currently used only via the CSS
 * media queries, but kept here for any consumer that needs the JS view.
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

/**
 * Lenis read proxy — the canonical source is `@/lib/lenis`. Existing call
 * sites (scroll-lock, overlays) keep using `getLenis()` without changing
 * their import paths.
 */
export { getLenisInstance as getLenis } from "./lenis";

export { gsap, ScrollTrigger };

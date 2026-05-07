import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerMotion, prefersReducedMotion } from "@/lib/motion";

/**
 * Mount once near the top of the tree. Initializes Lenis smooth scroll
 * and bridges its raf loop with GSAP ScrollTrigger so triggers fire in
 * lock-step with the smoothed scroll position.
 *
 * Disabled entirely when the user prefers reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}

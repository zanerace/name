import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Thin oxblood progress bar pinned to the top of the viewport.
 * Animates in on navigation start, completes and fades on resolve.
 * Works in every browser regardless of View Transitions API support.
 */
export function NavigationProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Tween | null>(null);
  const status = useRouterState({ select: (s) => s.status });

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || prefersReducedMotion()) return;

    if (status === "pending") {
      tlRef.current?.kill();
      gsap.set(bar, { scaleX: 0, opacity: 1, transformOrigin: "left center" });
      tlRef.current = gsap.to(bar, {
        scaleX: 0.82,
        duration: 2.4,
        ease: "power1.out",
      });
    } else {
      tlRef.current?.kill();
      gsap.to(bar, {
        scaleX: 1,
        duration: 0.18,
        ease: "power2.in",
        transformOrigin: "left center",
        onComplete: () => {
          gsap.to(bar, { opacity: 0, duration: 0.28, delay: 0.08 });
        },
      });
    }
  }, [status]);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[500] h-[1.5px] bg-accent pointer-events-none opacity-0"
      style={{ transformOrigin: "left center" }}
    />
  );
}

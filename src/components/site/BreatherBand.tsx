import { useEffect, useRef } from "react";
import { gsap, registerMotion, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";

export function BreatherBand() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const head = el.querySelector<HTMLElement>("[data-breather-head]");
      const sub = el.querySelector<HTMLElement>("[data-breather-sub]");
      if (!head || !sub) return;

      gsap.set([head, sub], { opacity: 0, y: 16, force3D: true });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        })
        .to(head, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .to(sub, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.35");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-hidden="true"
      className="py-[72px] md:py-[96px] w-full max-w-full overflow-x-hidden frame-panel"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 box-border">
        <div className="max-w-[760px]">
          <div aria-hidden className="ink-rule-heavy mb-6" />
          <p data-breather-head className="font-ui text-[10px] uppercase text-accent mb-4">
            Case Studies
          </p>
          <p
            data-breather-sub
            className="font-serif text-[18px] md:text-[20px] leading-[1.6] text-muted-foreground"
          >
            Identity systems, motion grammar, and sound-aware pacing—composed as one craft.
          </p>
        </div>
      </div>
    </section>
  );
}

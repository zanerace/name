import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";

const capabilities = [
  "Graphic Design",
  "Motion Graphics",
  "Video Editing",
  "Audio Engineering",
  "Generative AI Workflows",
  "Photography",
  "Web Design",
];

export function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;

    const lead = el.querySelector<HTMLElement>(".about-lead");
    const split = lead ? new SplitType(lead, { types: "lines" }) : null;

    const ctx = gsap.context(() => {
      const ruleEl = el.querySelector<HTMLElement>(".section-rule");
      const headerEls = el.querySelectorAll<HTMLElement>(".section-header .gsap-fade-up");
      const sideEls = el.querySelectorAll<HTMLElement>(".about-side > *");
      const tail = el.querySelector<HTMLElement>(".about-tail");
      const lines = split?.lines ?? [];

      gsap.set(lines, { y: 18, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
      if (ruleEl) {
        tl.to(ruleEl, { scaleX: 1, duration: 0.5, ease: "power2.inOut" });
      }
      tl.to(
        headerEls,
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.06 },
        "-=0.25"
      );
      if (lines.length) {
        tl.to(
          lines,
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" },
          "-=0.2"
        );
      }
      if (tail) {
        tl.to(tail, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
      }
      tl.to(
        sideEls,
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" },
        "-=0.25"
      );
    }, el);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={root} id="about" className="py-32 md:py-[240px]">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div aria-hidden className="rule-draw section-rule mb-32 md:mb-44" />

        <div className="grid grid-cols-12 gap-x-10 md:gap-x-20 gap-y-12 md:gap-y-16">
          <header className="section-header col-span-12 md:col-span-7 md:row-start-1">
            <p className="gsap-fade-up font-ui text-[10px] uppercase text-accent mb-4">§ 03</p>
            <h2 className="gsap-fade-up font-display h-section">About</h2>
          </header>

          <div className="col-span-12 md:col-span-7 md:row-start-2">
            <p className="about-lead font-serif text-xl md:text-2xl leading-[1.45] text-foreground">
              Race Kipping is a media designer working across identity, motion, and sound. The practice
              draws from a decade in professional kitchens and recording studios — disciplines built on
              tempo, restraint, and{" "}
              <span className="font-serif-i">the seriousness of small choices.</span>
            </p>
            <p className="about-tail gsap-fade-up-sm font-serif text-base md:text-lg leading-[1.55] text-muted-foreground mt-8 max-w-2xl">
              He holds an AFA in Graphic Communications from St. Louis Community College, May 2026.
              Current work centers on type, broadcast graphics, and AI-augmented production systems for
              independent studios and cultural clients.
            </p>
          </div>

          <aside className="about-side col-span-12 md:col-start-8 md:col-span-5 md:row-start-2">
            <p className="gsap-fade-up-sm font-ui text-[10px] uppercase text-muted-foreground mb-6">
              Capabilities
            </p>
            <ul className="gsap-fade-up-sm">
              {capabilities.map((c, i) => (
                <li key={c} className="flex items-baseline justify-between py-3 group">
                  <span className="font-display text-lg text-foreground transition-colors duration-200 ease-out group-hover:text-accent">
                    {c}
                  </span>
                  <span className="font-ui text-[10px] uppercase text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

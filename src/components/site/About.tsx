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
  const root = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;
    const el = root.current;
    const sectionEl = sectionRef.current;
    if (!el || !sectionEl) return;

    const lead = el.querySelector<HTMLElement>(".about-lead");
    const split = lead ? new SplitType(lead, { types: "lines" }) : null;

    const ctx = gsap.context(() => {
      const ruleEl = el.querySelector<HTMLElement>(".section-rule");
      const headerEls = Array.from(
        el.querySelectorAll<HTMLElement>(".section-header .gsap-fade-up")
      );
      const sideEls = Array.from(
        el.querySelectorAll<HTMLElement>(".about-side > *")
      );
      const tail = el.querySelector<HTMLElement>(".about-tail");
      const lines = (split?.lines ?? []) as HTMLElement[];

      gsap.set(lines, { y: 18, opacity: 0, force3D: true });

      const clearWill = () => {
        [...headerEls, ...sideEls, ...lines, ...(tail ? [tail] : [])].forEach(
          (node) => {
            node.style.willChange = "auto";
          }
        );
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 90%",
          once: true,
        },
        onComplete: clearWill,
      });
      if (ruleEl) {
        tl.to(ruleEl, { scaleX: 1, duration: 0.5, ease: "power2.inOut" });
      }
      if (headerEls.length) {
        tl.to(
          headerEls,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
            stagger: 0.06,
            force3D: true,
          },
          "-=0.25"
        );
      }
      if (lines.length) {
        tl.to(
          lines,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.out",
            force3D: true,
          },
          "-=0.2"
        );
      }
      if (tail) {
        tl.to(
          tail,
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", force3D: true },
          "-=0.2"
        );
      }
      if (sideEls.length) {
        tl.to(
          sideEls,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.out",
            force3D: true,
          },
          "-=0.25"
        );
      }
    }, el);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <div ref={root} className="w-full max-w-full overflow-x-hidden">
      {/* 80px cream + cream rule + 80px cream — boundary between MR (dark) and About (cream) */}
      <div className="bg-background pt-20 md:pt-[80px] pb-20 md:pb-[80px]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div aria-hidden className="section-rule rule-draw" />
        </div>
      </div>

      <section
        ref={sectionRef}
        id="about"
        className="pt-20 md:pt-[120px] pb-20 md:pb-[80px]"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <header className="section-header mb-16 md:mb-[80px]">
            <div className="flex items-center gap-4 mb-4">
              <span className="gsap-fade-up font-ui text-[10px] uppercase text-accent">
                § 03
              </span>
              <span className="gsap-fade-up font-ui text-[10px] uppercase text-accent">
                About
              </span>
            </div>
            <h2 className="gsap-fade-up font-display h-section">About</h2>
          </header>

          <div className="grid grid-cols-12 gap-x-10 md:gap-x-20">
            <div className="col-span-12 md:col-span-7">
              <p className="about-lead font-serif text-lg md:text-2xl leading-[1.45] text-foreground">
                Race Kipping is a media designer working across identity, motion, and sound. The practice
                draws from a decade in professional kitchens and recording studios — disciplines built on
                tempo, restraint, and{" "}
                <span className="font-serif-i">the seriousness of small choices.</span>
              </p>
              <p className="about-tail gsap-fade-up-sm font-serif text-base md:text-lg leading-[1.55] text-muted-foreground mt-6 md:mt-8 max-w-2xl">
                He holds an AFA in Graphic Communications from St. Louis Community College, May 2026.
                Current work centers on type, broadcast graphics, and AI-augmented production systems for
                independent studios and cultural clients.
              </p>
            </div>

            <aside className="about-side col-span-12 md:col-start-8 md:col-span-5 mt-12 md:mt-0">
              <p className="gsap-fade-up-sm font-ui text-[10px] uppercase text-muted-foreground mb-6">
                Capabilities
              </p>
              <ul className="gsap-fade-up-sm">
                {capabilities.map((c, i) => (
                  <li
                    key={c}
                    className="flex items-baseline justify-between py-3 group"
                  >
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
    </div>
  );
}

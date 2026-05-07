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
        tl.to(ruleEl, { scaleX: 1, duration: 0.65, ease: "power2.inOut" });
      }
      if (headerEls.length) {
        tl.to(
          headerEls,
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
            stagger: 0.06,
            force3D: true,
          },
          "-=0.32"
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
          "-=0.25"
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
        className="pt-20 md:pt-[136px] pb-20 md:pb-[104px]"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <header className="section-header mb-[56px] md:mb-[88px]">
            <h2 className="gsap-fade-up font-display h-section">About</h2>
            <p className="gsap-fade-up font-serif text-[15px] md:text-[17px] leading-[1.55] text-muted-foreground mt-4 max-w-[60ch]">
              A practice built on restraint: identities that age well, motion that clarifies, and sound-aware pacing.
            </p>
          </header>

          <div className="grid grid-cols-12 gap-x-10 md:gap-x-20">
            <div className="col-span-12 md:col-span-7">
              <p className="about-lead font-serif text-xl md:text-[2.05rem] leading-[1.38] text-foreground">
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

            <aside className="about-side col-span-12 md:col-start-8 md:col-span-5 mt-12 md:mt-0 frame-panel p-6 md:p-8 about-panel">
              <p className="gsap-fade-up-sm font-ui text-[10px] uppercase text-muted-foreground mb-6">
                Capabilities
              </p>
              <ul className="gsap-fade-up-sm grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {capabilities.map((c) => (
                  <li key={c} className="flex items-start gap-2.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--secondary)] mt-[0.58em]" />
                    <span className="font-ui text-[1.03rem] leading-[1.45] text-foreground">{c}</span>
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

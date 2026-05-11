import { useEffect, useRef, useState } from "react";
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
  const [portraitFailed, setPortraitFailed] = useState(false);

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
        el.querySelectorAll<HTMLElement>(".section-header .gsap-fade-up"),
      );
      const sideEls = Array.from(el.querySelectorAll<HTMLElement>(".about-side > *"));
      const tail = el.querySelector<HTMLElement>(".about-tail");
      const lines = (split?.lines ?? []) as HTMLElement[];

      gsap.set(lines, { y: 18, opacity: 0 });

      const clearWill = () => {
        [...headerEls, ...sideEls, ...lines, ...(tail ? [tail] : [])].forEach((node) => {
          node.style.willChange = "auto";
        });
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
            duration: 0.7,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            stagger: 0.06,
          },
          "-=0.32",
        );
      }
      if (lines.length) {
        tl.to(
          lines,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.06,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          },
          "-=0.25",
        );
      }
      if (tail) {
        tl.to(
          tail,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          },
          "-=0.2",
        );
      }
      if (sideEls.length) {
        tl.to(
          sideEls,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.06,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          },
          "-=0.25",
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
      {/* Quiet rule between Featured Motion and About — composition, not container. */}
      <div className="bg-background pt-16 md:pt-20 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
          <div aria-hidden className="section-rule rule-draw" />
        </div>
      </div>

      <section
        ref={sectionRef}
        id="about"
        className="cv-auto pt-[var(--section-space-y-mobile)] md:pt-[var(--section-space-y-desktop)] pb-[var(--section-space-y-mobile)] md:pb-[var(--section-space-y-desktop)] w-full max-w-full overflow-x-hidden"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
          <header className="section-header mb-10 md:mb-12">
            <h2 className="gsap-fade-up font-display h-section">About</h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-0 lg:gap-x-16 xl:gap-x-20 gap-y-12 lg:gap-y-0 min-w-0">
            <div className="lg:col-span-7 min-w-0 lg:order-1">
              <p className="about-lead font-serif text-[24px] md:text-[2.25rem] leading-[1.32] text-foreground break-words">
                Race Kipping is a media designer working across identity, motion, and sound. The
                practice draws from a decade in professional kitchens and recording studios —
                disciplines built on tempo, restraint, and{" "}
                <span className="font-serif-i">the seriousness of small choices.</span>
              </p>
              <p className="about-tail gsap-fade-up-sm section-body mt-6 md:mt-8 max-w-[60ch] break-words text-[color:var(--text-soft)]">
                He holds an AFA in Graphic Communications from St. Louis Community College, May
                2026. Current work centers on type, broadcast graphics, and AI-augmented production
                systems for independent studios and cultural clients.
              </p>
            </div>

            <aside className="about-side lg:col-span-5 about-panel min-w-0 lg:order-2">
              <div className="gsap-fade-up-sm">
                <div className="about-portrait-frame overflow-hidden border aspect-[4/5] md:aspect-[5/6] max-w-[460px] md:ml-auto relative">
                  {portraitFailed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[color:var(--surface-warm)]">
                      <span
                        className="font-display text-[80px] md:text-[96px] leading-none select-none"
                        style={{ color: "var(--ink-hard)" }}
                      >
                        RK
                      </span>
                      <span className="font-ui text-[9px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                        Portrait forthcoming
                      </span>
                    </div>
                  ) : (
                    <img
                      src="/about-portrait.png"
                      alt="Portrait of Race Kipping"
                      width={820}
                      height={1024}
                      loading="lazy"
                      decoding="async"
                      className="block w-full h-full object-cover object-[center_22%]"
                      onError={() => setPortraitFailed(true)}
                    />
                  )}
                </div>
                <p className="meta-inline mt-4 md:text-right text-[color:var(--text-soft)]">
                  Race Kipping, 2026
                </p>
              </div>
              <div className="gsap-fade-up-sm mt-10 md:mt-12">
                <p className="meta-inline mb-5 text-[color:var(--text-soft)]">Capabilities</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {capabilities.map((c) => (
                    <li key={c} className="flex items-baseline gap-3 min-w-0">
                      <span
                        aria-hidden="true"
                        className="font-ui text-[12px] text-[color:var(--accent)] tracking-[0.2em]"
                      >
                        —
                      </span>
                      <span className="font-ui text-[1.02rem] leading-[1.5] text-foreground break-words">
                        {c}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

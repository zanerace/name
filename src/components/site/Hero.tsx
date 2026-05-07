import { useEffect, useRef, type MouseEvent } from "react";
import SplitType from "split-type";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;

    const headline = headlineRef.current;
    const sub = subRef.current;
    const bio = bioRef.current;
    if (!headline || !sub || !bio) return;

    const lines = headline.querySelectorAll<HTMLElement>(".hero-line");
    const headlineSplit = new SplitType(Array.from(lines), { types: "chars" });
    const bioSplit = new SplitType(bio, { types: "lines" });

    const chars = headlineSplit.chars ?? [];
    const bioLines = bioSplit.lines ?? [];

    gsap.set(chars, { y: 32, opacity: 0, force3D: true });
    gsap.set(sub, { y: 20, opacity: 0, force3D: true });
    gsap.set(bioLines, { y: 18, opacity: 0, force3D: true });

    const clearWillChange = () => {
      [...chars, sub, ...bioLines].forEach((node) => {
        if (node instanceof HTMLElement) node.style.willChange = "auto";
      });
    };

    const tl = gsap.timeline({ onComplete: clearWillChange });
    tl.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.04,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      force3D: true,
    });
    tl.to(
      sub,
      { y: 0, opacity: 1, duration: 0.7, ease: "cubic-bezier(0.22, 1, 0.36, 1)", force3D: true },
      0.8
    );
    tl.to(
      bioLines,
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
        force3D: true,
      },
      1.2
    );

    return () => {
      tl.kill();
      bioSplit.revert();
      headlineSplit.revert();
    };
  }, []);

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={root}
      id="top"
      className="hero-wash relative flex flex-col min-h-[60vh] md:min-h-[76vh] w-full max-w-full overflow-x-hidden"
    >
      <div className="flex-1 mx-auto w-full max-w-[1440px] px-6 md:px-12 pt-20 md:pt-[168px] pb-16 md:pb-[104px] box-border">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-12 gap-y-8 md:gap-y-12 items-start w-full min-w-0">
          <div className="col-span-12 md:col-span-7 min-w-0">
            <h1
              ref={headlineRef}
              className="font-display h-hero max-w-full leading-none md:pr-8"
              aria-label="Race Kipping"
            >
              <span className="hero-line block hero-kipping">Race</span>
              <span className="hero-line block hero-kipping">Kipping</span>
            </h1>
            <p
              ref={subRef}
              className="meta-inline mt-8 md:mt-14"
            >
              Media Designer
            </p>
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-3">
              <a href="#work" onClick={(e) => scrollToSection(e, "work")} className="hero-cta" data-cursor="active">
                View Work
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "contact")}
                className="hero-cta hero-cta-ghost"
                data-cursor="active"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="col-span-12 md:col-start-8 md:col-span-5 min-w-0 md:pt-4">
            <p
              ref={bioRef}
              className="section-body text-foreground max-w-[38ch] text-left hero-bio-panel frame-panel p-5 md:p-7"
            >
              I design at the intersection of identity, motion, and sound. Background in cooking and music
              shapes how I approach the work — simple ingredients, deliberate process,{" "}
              <span className="font-serif-i">considered outcome.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

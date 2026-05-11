import { useEffect, useRef, type MouseEvent } from "react";
import SplitType from "split-type";
import { Link } from "@tanstack/react-router";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";
import { getWorkProjectById } from "./work-data";

export function Hero() {
  const lunaCast = getWorkProjectById("lunacast");
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

    let cancelled = false;
    let headlineSplit: InstanceType<typeof SplitType> | null = null;
    let bioSplit: InstanceType<typeof SplitType> | null = null;
    let tl: gsap.core.Timeline | null = null;

    const schedule =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback.bind(window)
        : (cb: () => void) => window.setTimeout(cb, 1);
    const cancelSchedule =
      typeof window !== "undefined" && "cancelIdleCallback" in window
        ? window.cancelIdleCallback.bind(window)
        : (id: number) => clearTimeout(id);

    const idleId = schedule(() => {
      if (cancelled) return;

      const lines = headline.querySelectorAll<HTMLElement>(".hero-line");
      /* Words (not chars) = far fewer DOM nodes + less layout work during scroll. */
      headlineSplit = new SplitType(Array.from(lines), { types: "words" });
      bioSplit = new SplitType(bio, { types: "lines" });

      const words = headlineSplit.words ?? [];
      const bioLines = bioSplit.lines ?? [];

      gsap.set(words, { y: 22, opacity: 0 });
      gsap.set(sub, { y: 20, opacity: 0 });
      gsap.set(bioLines, { y: 18, opacity: 0 });

      const clearWillChange = () => {
        [...words, sub, ...bioLines].forEach((node) => {
          if (node instanceof HTMLElement) node.style.willChange = "auto";
        });
      };

      tl = gsap.timeline({ onComplete: clearWillChange });
      tl.to(words, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.07,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      tl.to(
        sub,
        { y: 0, opacity: 1, duration: 0.7, ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
        0.72,
      );
      tl.to(
        bioLines,
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
        1.05,
      );
    });

    return () => {
      cancelled = true;
      cancelSchedule(idleId as number);
      tl?.kill();
      headlineSplit?.revert();
      bioSplit?.revert();
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
      className="hero-wash relative flex flex-col min-h-[56vh] md:min-h-[74vh] xl:min-h-[78vh] w-full max-w-full overflow-x-hidden"
    >
      <div className="flex-1 mx-auto w-full max-w-[1440px] px-5 sm:px-6 md:px-12 pt-20 md:pt-[162px] pb-[var(--section-space-y-mobile)] md:pb-[var(--section-space-y-desktop)] box-border">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-12 gap-y-8 md:gap-y-10 items-start w-full min-w-0">
          <div className="col-span-12 md:col-span-7 min-w-0">
            <h1
              ref={headlineRef}
              className="font-display h-hero max-w-full leading-none md:pr-8"
              aria-label="Race Kipping"
            >
              <span className="hero-line block hero-kipping">Race</span>
              <span className="hero-line block hero-kipping">Kipping</span>
            </h1>
            <p ref={subRef} className="meta-inline mt-8 md:mt-14">
              Media Designer
            </p>
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                onClick={(e) => scrollToSection(e, "work")}
                className="hero-cta"
                data-cursor="active"
              >
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
            {lunaCast && (
              <Link
                to="/work/$projectId"
                params={{ projectId: lunaCast.id }}
                className="hero-feature-card group block mb-7 md:mb-8 focus-visible:outline-none"
              >
                <p className="meta-inline mb-3 text-accent">Featured Motion</p>
                <div className="overflow-hidden mb-4 aspect-[16/10] md:aspect-[16/9]">
                  <img
                    src={lunaCast.coverImage}
                    alt={lunaCast.alt}
                    width={1280}
                    height={800}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="block w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                </div>
                <p className="hero-feature-title font-display text-[30px] md:text-[34px] text-foreground">
                  {lunaCast.title}
                </p>
              </Link>
            )}
            <p
              ref={bioRef}
              className="section-body text-[color:var(--text-soft)] max-w-[38ch] text-left hero-bio-panel"
            >
              I design at the intersection of identity, motion, and sound. Background in cooking and
              music shapes how I approach the work — simple ingredients, deliberate process,{" "}
              <span className="font-serif-i text-foreground">considered outcome.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

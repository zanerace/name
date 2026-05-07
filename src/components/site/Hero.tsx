import { useEffect, useRef } from "react";
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

    gsap.set(chars, { y: 32, opacity: 0 });
    gsap.set(sub, { y: 20, opacity: 0 });
    gsap.set(bioLines, { y: 18, opacity: 0 });

    const tl = gsap.timeline();
    tl.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.04,
      ease: "power3.out",
    });
    tl.to(
      sub,
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      0.8
    );
    tl.to(
      bioLines,
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      },
      1.2
    );

    return () => {
      tl.kill();
      bioSplit.revert();
      headlineSplit.revert();
    };
  }, []);

  return (
    <section ref={root} id="top" className="relative min-h-screen flex flex-col">
      <div className="flex-1 mx-auto w-full max-w-[1440px] px-6 md:px-12 pt-40 md:pt-56 pb-32 md:pb-40 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-10">
          <h1
            ref={headlineRef}
            className="font-display h-hero"
            aria-label="Race Kipping"
          >
            <span className="hero-line block">Race</span>
            <span className="hero-line block">Kipping</span>
          </h1>
          <p
            ref={subRef}
            className="font-ui text-[10px] uppercase text-muted-foreground mt-12 md:mt-16"
          >
            Media Designer
          </p>
        </div>
        <div className="col-span-12 md:col-start-6 md:col-span-7 mt-20 md:mt-28">
          <p
            ref={bioRef}
            className="font-serif text-lg md:text-xl text-foreground max-w-[42ch] leading-[1.55]"
          >
            I design at the intersection of identity, motion, and sound. Background in cooking and music
            shapes how I approach the work — simple ingredients, deliberate process,{" "}
            <span className="font-serif-i">considered outcome.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

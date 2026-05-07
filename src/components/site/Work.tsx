import { useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";
import { workProjects } from "./work-data";

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const root = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const headerEls = Array.from(
        el.querySelectorAll<HTMLElement>(".section-header .gsap-fade-up")
      );

      if (headerEls.length) {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        }).to(headerEls, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.06,
          force3D: true,
          onComplete: () =>
            headerEls.forEach((node) => {
              node.style.willChange = "auto";
            }),
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(cardsRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (!cards.length) return;

      gsap.set(cards, { opacity: 0, y: 24, force3D: true });
      cards.forEach((card) => {
        card.style.willChange = "opacity, transform";
      });

      const seen = new WeakSet<HTMLDivElement>();
      const queue: HTMLDivElement[] = [];
      let isRevealing = false;

      const runNext = () => {
        const next = queue.shift();
        if (!next) {
          isRevealing = false;
          return;
        }
        isRevealing = true;
        gsap.delayedCall(0.22, runNext);
        gsap.to(next, {
          opacity: 1,
          y: 0,
          duration: 1.25,
          ease: "power1.out",
          force3D: true,
          overwrite: true,
          onComplete: () => {
            next.style.willChange = "auto";
          },
        });
      };

      const enqueueReveal = (card: HTMLDivElement) => {
        if (seen.has(card)) return;
        seen.add(card);
        queue.push(card);
        if (!isRevealing) runNext();
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const card = entry.target as HTMLDivElement;
            enqueueReveal(card);
            observer.unobserve(card);
          });
        },
        {
          root: null,
          threshold: 0.08,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      cards.forEach((card) => {
        observer.observe(card);
      });

      return () => {
        observer.disconnect();
      };
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      id="work"
      className="work-wash pt-24 md:pt-[136px] pb-24 md:pb-[104px] w-full max-w-full overflow-x-hidden"
    >
      <div className="mx-auto max-w-[1440px] w-full max-w-full px-6 md:px-12 box-border">
        <header className="section-header flex items-end justify-between mb-[72px] md:mb-24">
          <div>
              <h2 className="gsap-fade-up font-display h-section">Selected Work</h2>
              <p className="gsap-fade-up font-ui text-[10px] uppercase text-muted-foreground mt-4">2024 — 2026</p>
          </div>
            <p className="gsap-fade-up font-serif-i text-accent hidden md:block">Projects</p>
        </header>

        <div
          ref={gridRef}
          className="work-grid grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-[72px] md:gap-y-[92px] w-full min-w-0"
        >
          {workProjects.map((p, index) => (
            <article key={p.id} className="work-card min-w-0">
              <div
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="work-card-surface frame-panel p-4 md:p-5"
              >
                <Link
                  to="/work/$projectId"
                  params={{ projectId: p.id }}
                  aria-label={`Open ${p.title} project page`}
                  className="work-image-link block w-full p-0 m-0 border-0 bg-transparent text-left max-w-full"
                >
                  <div className="aspect-[16/10] overflow-hidden border border-border max-w-full">
                    <img
                      src={p.coverImage}
                      alt={p.alt}
                      width={1280}
                      height={800}
                      loading="lazy"
                      className="work-image block w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                  <span className="font-ui text-[10px] uppercase text-accent meta-chip">{p.num}</span>
                  <span className="font-ui text-[10px] uppercase text-muted-foreground whitespace-nowrap meta-chip">
                    {p.tag} <span className="text-accent">—</span> {p.year}
                  </span>
                </div>
                <h3 className="work-title work-title-optic font-display text-[21px] md:text-[24px] mt-3 text-foreground max-w-[24ch]">
                  {p.titleLines ? (
                    <>
                      <span className="block">{p.titleLines[0]}</span>
                      <span className="block">{p.titleLines[1]}</span>
                    </>
                  ) : (
                    p.title
                  )}
                </h3>
                <p className="font-serif text-sm md:text-lg text-muted-foreground mt-3 max-w-md leading-[1.5] md:leading-[1.55]">
                  {p.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

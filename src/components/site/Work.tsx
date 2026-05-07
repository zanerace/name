import { useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";
import { workProjects } from "./work-data";

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const root = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const headerEls = Array.from(
        el.querySelectorAll<HTMLElement>(".section-header .gsap-fade-up"),
      );

      if (headerEls.length) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          })
          .to(headerEls, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
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
        gsap.delayedCall(0.08, runNext);
        gsap.to(next, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
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
        },
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
      className="work-wash pt-[var(--section-space-y-mobile)] md:pt-[var(--section-space-y-desktop)] pb-[var(--section-space-y-mobile)] md:pb-[var(--section-space-y-desktop)] w-full max-w-full overflow-x-hidden"
    >
      <div className="mx-auto max-w-[1440px] w-full max-w-full px-6 md:px-12 box-border">
        <header className="section-header flex items-start justify-between mb-12 md:mb-20">
          <div>
            <h2 className="gsap-fade-up font-display h-section">Selected Work</h2>
            <p className="gsap-fade-up meta-inline mt-4">2024 — 2026</p>
            <p className="gsap-fade-up section-body mt-5 max-w-[52ch]">
              A curated selection across identity, motion, and sound—built for real production
              contexts.
            </p>
          </div>
        </header>

        <div className="work-grid grid grid-cols-1 lg:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-24 w-full min-w-0">
          {workProjects.map((p, index) => (
            <article
              key={p.id}
              className={`work-card min-w-0 ${index === 0 ? "lg:col-span-2" : ""}`}
            >
              <div
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="work-card-surface"
              >
                <Link
                  to="/work/$projectId"
                  params={{ projectId: p.id }}
                  aria-label={`Open ${p.title} project page`}
                  className="work-image-link block w-full p-0 m-0 border-0 bg-transparent text-left max-w-full"
                >
                  <div className="overflow-hidden max-w-full aspect-[16/10] md:aspect-[16/9.2]">
                    <img
                      src={p.coverImage}
                      alt={p.alt}
                      width={1280}
                      height={800}
                      loading="lazy"
                      className="work-image block w-full h-full object-cover"
                      style={{
                        objectPosition:
                          p.id === "lunacast"
                            ? "center 15%"
                            : p.id === "rwanda"
                              ? "right center"
                              : "center center",
                      }}
                    />
                  </div>
                </Link>

                <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                  <span className="font-ui text-[12px] md:text-[13px] uppercase tracking-[0.18em] text-accent">
                    {p.num}
                  </span>
                  <span className="font-ui text-[12px] md:text-[13px] uppercase tracking-[0.16em] md:tracking-[0.18em] text-muted-foreground break-words md:whitespace-nowrap">
                    {p.tag} <span className="text-[color:var(--ink-hard)]">/</span> {p.year}
                  </span>
                  {p.id === "lunacast" && (
                    <span className="font-ui text-[12px] md:text-[13px] uppercase tracking-[0.16em] md:tracking-[0.18em] text-[color:var(--text-soft)] break-words md:whitespace-nowrap">
                      <span className="text-[color:var(--ink-hard)]">/</span> Featured Motion
                    </span>
                  )}
                </div>
                <h3 className="work-title work-title-optic font-display text-[32px] md:text-[40px] mt-3 text-foreground max-w-[24ch]">
                  <Link
                    to="/work/$projectId"
                    params={{ projectId: p.id }}
                    className="link-underline text-foreground hover:text-accent focus-visible:text-accent"
                  >
                    {p.titleLines ? (
                      <>
                        <span className="block">{p.titleLines[0]}</span>
                        <span className="block">{p.titleLines[1]}</span>
                      </>
                    ) : (
                      p.title
                    )}
                  </Link>
                </h3>
                <p className="section-body text-[18px] md:text-[19px] mt-3 max-w-[52ch] text-[color:var(--text-soft)]">
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

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";
import { Lightbox, type LightboxImage } from "./Lightbox";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  id: string;
  num: string;
  title: string;
  desc: string;
  tag: string;
  year: string;
  coverImage: string;
  alt: string;
  images: LightboxImage[];
};

const projects: Project[] = [
  {
    id: "gradual-sans",
    num: "01",
    title: "Gradual Sans",
    desc: "A variable display family exploring optical scaling between text and headline.",
    tag: "Type Design",
    year: "2025",
    coverImage: "/work/01.jpg",
    alt: "Type specimen for Gradual Sans",
    images: [{ src: "/work/01.jpg", alt: "Type specimen for Gradual Sans" }],
  },
  {
    id: "climate-change",
    num: "02",
    title: "Climate Change Exhibition",
    desc: "Identity and campaign for a touring museum exhibition on environmental loss.",
    tag: "Identity / Campaign",
    year: "2025",
    coverImage: "/work/02.png",
    alt: "Climate Change exhibition poster",
    images: [{ src: "/work/02.png", alt: "Climate Change exhibition poster" }],
  },
  {
    id: "lunacast",
    num: "03",
    title: "LunaCast",
    desc: "Product identity, interface, and motion system for a lunar-cycle podcast app.",
    tag: "UX / Motion",
    year: "2024",
    coverImage: "/work/03.png",
    alt: "LunaCast app screens",
    images: [{ src: "/work/03.png", alt: "LunaCast app screens" }],
  },
  {
    id: "rwanda",
    num: "04",
    title: "Rwanda",
    desc: "Visual identity rooted in Imigongo geometry for a hospitality brand.",
    tag: "Identity",
    year: "2024",
    coverImage: "/work/04.jpg",
    alt: "Rwanda brand stationery",
    images: [{ src: "/work/04.jpg", alt: "Rwanda brand stationery" }],
  },
];

type LightboxState = { project: Project; startIndex: number } | null;

export function Work() {
  const root = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [lightbox, setLightbox] = useState<LightboxState>(null);

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

  const openProject = useCallback((p: Project) => {
    setLightbox({ project: p, startIndex: 0 });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  return (
    <>
      <section
        ref={root}
        id="work"
        className="pt-20 md:pt-[120px] pb-20 md:pb-[80px] w-full max-w-full overflow-x-hidden"
      >
        <div className="mx-auto max-w-[1440px] w-full max-w-full px-6 md:px-12 box-border">
          <header className="section-header flex items-end justify-between mb-16 md:mb-28">
            <div>
              <p className="gsap-fade-up font-ui text-[10px] uppercase text-accent mb-4">
                § 01
              </p>
              <h2 className="gsap-fade-up font-display h-section">Selected Work</h2>
            </div>
            <p className="gsap-fade-up font-serif-i text-accent hidden md:block">
              2024 — 2026
            </p>
          </header>

          <div
            ref={gridRef}
            className="work-grid grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 md:gap-y-20 w-full min-w-0"
          >
            {projects.map((p, index) => (
              <article key={p.id} className="work-card min-w-0">
                <div
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el;
                  }}
                  className="work-card-surface"
                >
                  <button
                    type="button"
                    onClick={() => openProject(p)}
                    aria-label={`Open ${p.title} gallery`}
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
                  </button>

                  <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                    <span className="font-ui text-[10px] uppercase text-accent">
                      {p.num}
                    </span>
                    <span className="font-ui text-[10px] uppercase text-muted-foreground whitespace-nowrap">
                      {p.tag} <span className="text-accent">—</span> {p.year}
                    </span>
                  </div>
                  <h3 className="work-title font-display text-[20px] md:text-[22px] mt-3 text-foreground leading-[1.2] max-w-[26ch]">
                    {p.title}
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

      {lightbox && (
        <Lightbox
          images={lightbox.project.images}
          startIndex={lightbox.startIndex}
          title={lightbox.project.title}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}

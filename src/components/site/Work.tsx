import { useEffect, useRef } from "react";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";

type Project = {
  num: string;
  title: string;
  desc: string;
  tag: string;
  year: string;
  imageSrc: string;
  alt: string;
};

const projects: Project[] = [
  {
    num: "01",
    title: "Gradual Sans",
    desc: "A variable display family exploring optical scaling between text and headline.",
    tag: "Type Design",
    year: "2025",
    imageSrc: "/work/01.jpg",
    alt: "Type specimen for Gradual Sans",
  },
  {
    num: "02",
    title: "Climate Change Exhibition",
    desc: "Identity and campaign for a touring museum exhibition on environmental loss.",
    tag: "Identity / Campaign",
    year: "2025",
    imageSrc: "/work/02.png",
    alt: "Climate Change exhibition poster",
  },
  {
    num: "03",
    title: "LunaCast",
    desc: "Product identity, interface, and motion system for a lunar-cycle podcast app.",
    tag: "UX / Motion",
    year: "2024",
    imageSrc: "/work/03.png",
    alt: "LunaCast app screens",
  },
  {
    num: "04",
    title: "Rwanda",
    desc: "Visual identity rooted in Imigongo geometry for a hospitality brand.",
    tag: "Identity",
    year: "2024",
    imageSrc: "/work/04.jpg",
    alt: "Rwanda brand stationery",
  },
  {
    num: "05",
    title: "Motion & Sound Reel",
    desc: "A short collection of broadcast, title sequence, and original score work.",
    tag: "Motion / Audio",
    year: "2026",
    imageSrc: "/work/05.jpg",
    alt: "Motion reel still frame",
  },
];

export function Work() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const headerEls = el.querySelectorAll<HTMLElement>(".section-header .gsap-fade-up");
      const cards = el.querySelectorAll<HTMLElement>(".work-card");

      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }).to(headerEls, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
        stagger: 0.06,
      });

      cards.forEach((card, i) => {
        const image = card.querySelector(".work-image");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          delay: (i % 2) * 0.05,
        });
        tl.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: "power3.out",
        });
        if (image) {
          tl.fromTo(
            image,
            { scale: 1.05 },
            { scale: 1, duration: 0.6, ease: "power2.out" },
            "<"
          );
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="py-32 md:py-[240px]">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <header className="section-header flex items-end justify-between mb-20 md:mb-28">
          <div>
            <p className="gsap-fade-up font-ui text-[10px] uppercase text-accent mb-4">§ 01</p>
            <h2 className="gsap-fade-up font-display h-section">Selected Work</h2>
          </div>
          <p className="gsap-fade-up font-serif-i text-accent hidden md:block">2024 — 2026</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20">
          {projects.map((p) => (
            <article key={p.num} className="work-card gsap-fade-up group">
              <a href="#" className="block">
                <div className="aspect-[16/10] overflow-hidden border border-border">
                  <img
                    src={p.imageSrc}
                    alt={p.alt}
                    width={1280}
                    height={800}
                    loading="lazy"
                    className="work-image block w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-6">
                  <div className="flex items-baseline gap-5 min-w-0">
                    <span className="font-ui text-[10px] uppercase text-accent">{p.num}</span>
                    <h3 className="work-title font-display text-[22px] md:text-2xl truncate text-foreground">
                      {p.title}
                    </h3>
                  </div>
                  <span className="font-ui text-[10px] uppercase text-muted-foreground whitespace-nowrap">
                    {p.tag} <span className="text-accent">—</span> {p.year}
                  </span>
                </div>
                <p className="font-serif text-base md:text-lg text-muted-foreground mt-4 max-w-md leading-[1.55]">
                  {p.desc}
                </p>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

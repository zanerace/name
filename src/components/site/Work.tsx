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
  return (
    <section id="work" className="py-32 md:py-48 border-t border-[var(--rule)]">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <header className="reveal flex items-end justify-between mb-20 md:mb-28">
          <div>
            <p className="font-ui text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
              § 01
            </p>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight">Selected Work</h2>
          </div>
          <p className="font-serif-i text-muted-foreground hidden md:block">2024 — 2026</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-24">
          {projects.map((p, i) => (
            <article
              key={p.num}
              className={`reveal group ${i % 2 === 1 ? "md:mt-32" : ""}`}
              style={{ transitionDelay: `${(i % 2) * 120}ms` }}
            >
              <a href="#" className="block">
                <div className="overflow-hidden bg-muted/20">
                  <img
                    src={p.imageSrc}
                    alt={p.alt}
                    width={1280}
                    height={960}
                    loading="lazy"
                    className="block w-full h-auto transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-6 border-t border-[var(--rule)] pt-5">
                  <div className="flex items-baseline gap-5 min-w-0">
                    <span className="font-ui text-[11px] tracking-[0.25em] text-muted-foreground">
                      {p.num}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl truncate group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                  </div>
                  <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-muted-foreground whitespace-nowrap">
                    {p.tag} — {p.year}
                  </span>
                </div>
                <p className="font-serif text-base md:text-lg text-muted-foreground mt-4 max-w-md leading-relaxed">
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

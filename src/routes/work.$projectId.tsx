import { useLayoutEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { getWorkProjectById } from "@/components/site/work-data";
import { gsap, prefersReducedMotion, registerMotion } from "@/lib/motion";

const VIDEO_SOURCES: readonly { src: string; type: string }[] = [
  { src: "/reel/reel.webm", type: 'video/webm; codecs="av01.0.08M.08"' },
  { src: "/reel/motion-reel.webm", type: 'video/webm; codecs="av01.0.08M.08"' },
  { src: "/reel/reel.mp4", type: 'video/mp4; codecs="av01.0.08M.08, mp4a.40.2"' },
  { src: "/reel/motion-reel.mp4", type: 'video/mp4; codecs="av01.0.08M.08, mp4a.40.2"' },
  { src: "/reel/poster.mp4", type: "video/mp4" },
  { src: "/reel/reel-h264.mp4", type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' },
  { src: "/reel/motion-reel-h264.mp4", type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' },
  { src: "/reel/motion-reel.mov", type: "video/quicktime" },
];

const GRADUAL_SANS_VIDEO_SOURCES: readonly { src: string; type: string }[] = [
  { src: "/work/gradual-sans.mp4", type: "video/mp4" },
  { src: "/work/gradual-sans.mp4.mp4", type: "video/mp4" },
];

export const Route = createFileRoute("/work/$projectId")({
  component: WorkProjectPage,
});

function ProjectInlineVideo({
  sources,
  poster,
}: {
  sources: readonly { src: string; type: string }[];
  poster: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <img
        src={poster}
        alt=""
        width={1600}
        height={900}
        className="block h-full w-full object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <video
      className="block h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      onError={() => setFailed(true)}
    >
      {sources.map(({ src, type }) => (
        <source key={src} src={src} type={type} />
      ))}
    </video>
  );
}

function WorkProjectPage() {
  const { projectId } = Route.useParams();
  const project = getWorkProjectById(projectId);
  const rootRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    if (!project) return;
    registerMotion();
    if (prefersReducedMotion()) return;
    const scope = rootRef.current;
    if (!scope || !titleRef.current) return;

    const ctx = gsap.context(() => {
      const root = scope;
      const title = titleRef.current;
      const hero = root.querySelector<HTMLElement>("[data-work-hero]");
      const text = root.querySelector<HTMLElement>("[data-work-body]");

      gsap.set([title, hero, text].filter(Boolean) as HTMLElement[], {
        opacity: 0,
        y: 18,
        force3D: true,
      });

      gsap
        .timeline()
        .to(title, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", force3D: true })
        .to(hero, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", force3D: true }, "-=0.35")
        .to(
          text,
          { opacity: 1, y: 0, duration: 0.75, ease: "power2.out", force3D: true },
          "-=0.45",
        );
    }, scope);

    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <main className="min-h-screen bg-background px-6 md:px-12 py-24 md:py-28">
        <div className="mx-auto max-w-[900px]">
          <p className="font-ui text-[10px] uppercase text-muted-foreground mb-4">Project</p>
          <h1 className="font-display h-section mb-6">Not Found</h1>
          <Link to="/" className="meta-chip font-ui text-[10px] uppercase">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main ref={rootRef} className="min-h-screen bg-background px-6 md:px-12 py-24 md:py-28">
      <article className="mx-auto max-w-[1200px]">
        <div className="mb-8 md:mb-10">
          <Link to="/" className="meta-chip font-ui text-[10px] uppercase">
            Back to home
          </Link>
        </div>

        <header className="mb-12 md:mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="meta-chip font-ui text-[10px] uppercase text-accent">
              {project.num}
            </span>
            <span className="meta-chip font-ui text-[10px] uppercase text-muted-foreground">
              {project.tag} — {project.year}
            </span>
          </div>
          <h1 ref={titleRef} className="font-display h-section mb-4">
            {project.title}
          </h1>
          <p className="font-serif text-lg md:text-2xl leading-[1.42] text-foreground max-w-[38ch]">
            {project.desc}
          </p>
        </header>

        <section className="frame-panel p-4 md:p-6 mb-8 md:mb-10">
          <div className="aspect-[16/9] overflow-hidden border border-border">
            <img
              src={project.coverImage}
              alt={project.alt}
              className="block w-full h-full object-cover"
              width={1600}
              height={900}
              data-work-hero
            />
          </div>
        </section>

        {project.id === "lunacast" && (
          <section className="frame-panel p-4 md:p-6 mb-8 md:mb-10">
            <div className="aspect-[16/9] overflow-hidden border border-border bg-foreground">
              <ProjectInlineVideo sources={VIDEO_SOURCES} poster="/reel/poster.png" />
            </div>
          </section>
        )}

        {project.id === "gradual-sans" && (
          <section className="frame-panel p-4 md:p-6 mb-8 md:mb-10">
            <div className="aspect-[16/9] overflow-hidden border border-border bg-foreground">
              <ProjectInlineVideo
                sources={GRADUAL_SANS_VIDEO_SOURCES}
                poster={project.coverImage}
              />
            </div>
          </section>
        )}

        <section className="grid grid-cols-12 gap-8 mb-10">
          <div className="col-span-12 md:col-span-7">
            <p
              data-work-body
              className="font-serif text-base md:text-xl leading-[1.56] text-foreground"
            >
              {project.body}
            </p>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="frame-panel p-4 md:p-6">
              <p className="font-ui text-[10px] uppercase text-muted-foreground mb-4">
                Case metadata
              </p>
              <dl className="space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-ui text-[10px] uppercase text-muted-foreground">Role</dt>
                  <dd className="font-display text-[16px] text-foreground">Media Designer</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-ui text-[10px] uppercase text-muted-foreground">Year</dt>
                  <dd className="font-display text-[16px] text-foreground">{project.year}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-ui text-[10px] uppercase text-muted-foreground">Client</dt>
                  <dd className="font-display text-[16px] text-foreground">Selected work</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-ui text-[10px] uppercase text-muted-foreground">
                    Discipline
                  </dt>
                  <dd className="font-display text-[16px] text-foreground">{project.tag}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-ui text-[10px] uppercase text-muted-foreground">
                    Deliverables
                  </dt>
                  <dd className="font-display text-[16px] text-foreground">
                    Identity + motion assets
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-6 md:gap-8 mb-14">
          <div className="col-span-12 md:col-span-7 frame-panel p-0 overflow-hidden border border-border">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.alt}
                className="block w-full h-full object-cover"
                style={{ objectPosition: "left center" }}
                width={1400}
                height={1050}
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 frame-panel p-0 overflow-hidden border border-border">
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.alt}
                className="block w-full h-full object-cover"
                style={{ objectPosition: "right top" }}
                width={1200}
                height={675}
              />
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}

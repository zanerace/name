import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";
import { getWorkProjectById } from "./work-data";

const POSTER = "/reel/poster.png";

const VIDEO_SOURCES: readonly { src: string; type: string }[] = [
  // Prefer AV1 where supported.
  { src: "/reel/reel.webm", type: 'video/webm; codecs="av01.0.08M.08"' },
  { src: "/reel/motion-reel.webm", type: 'video/webm; codecs="av01.0.08M.08"' },
  { src: "/reel/reel.mp4", type: 'video/mp4; codecs="av01.0.08M.08, mp4a.40.2"' },
  { src: "/reel/motion-reel.mp4", type: 'video/mp4; codecs="av01.0.08M.08, mp4a.40.2"' },
  { src: "/reel/poster.mp4", type: "video/mp4" },
  // Fallback for devices/browsers without AV1 decode support.
  { src: "/reel/reel-h264.mp4", type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' },
  { src: "/reel/motion-reel-h264.mp4", type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' },
  // Last-resort legacy source.
  { src: "/reel/motion-reel.mov", type: "video/quicktime" },
];

const GRADUAL_SANS_VIDEO_SOURCES: readonly { src: string; type: string }[] = [
  { src: "/work/gradual-sans.mp4", type: "video/mp4" },
  { src: "/work/gradual-sans.mp4.mp4", type: "video/mp4" },
];

function ReelVideoTile({
  projectId,
  title,
  desc,
  sources,
  poster,
}: {
  projectId: string;
  title: string;
  desc: string;
  sources: readonly { src: string; type: string }[];
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const el = v as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitEnterFullscreen) {
      el.webkitEnterFullscreen();
    }
  };

  return (
    <div className="reel-video reel-intro-reveal">
      <div className="reel-stage relative w-full aspect-video bg-foreground overflow-hidden">
        <video
          ref={videoRef}
          className="reel-video-el absolute inset-0 w-full h-full object-cover"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onClick={onVideoClick}
        >
          {sources.map(({ src, type }) => (
            <source key={src} src={src} type={type} />
          ))}
          Your browser does not support embedded video.
        </video>
      </div>
      <div className="mt-5">
        <Link
          to="/work/$projectId"
          params={{ projectId }}
          className="font-display text-[29px] md:text-[34px] link-underline text-foreground hover:text-accent focus-visible:text-accent"
        >
          {title}
        </Link>
        <p className="reel-caption mt-2 text-[17px] md:text-[19px]">{desc}</p>
      </div>
    </div>
  );
}

export function MotionReel() {
  const lunaCast = getWorkProjectById("lunacast");
  const gradualSans = getWorkProjectById("gradual-sans");
  const root = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;
    const el = root.current;
    const sectionEl = sectionRef.current;
    if (!el || !sectionEl) return;

    const ctx = gsap.context(() => {
      const ruleEl = el.querySelector<HTMLElement>(".section-rule");
      const headerEls = Array.from(
        el.querySelectorAll<HTMLElement>(".section-header .gsap-fade-up")
      );
      const videos = Array.from(el.querySelectorAll<HTMLElement>(".reel-intro-reveal"));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 90%",
          once: true,
        },
        onComplete: () => {
          headerEls.forEach((node) => (node.style.willChange = "auto"));
          videos.forEach((video) => (video.style.willChange = "auto"));
        },
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
            force3D: true,
          },
          "-=0.34"
        );
      }
      if (videos.length) {
        tl.to(
          videos,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            force3D: true,
          },
          "-=0.28"
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="w-full max-w-full overflow-x-hidden">
      <div className="bg-background pb-20 md:pb-[80px] w-full max-w-full overflow-x-hidden">
        <div className="mx-auto max-w-[1440px] w-full px-6 md:px-12 box-border">
          <div aria-hidden className="section-rule rule-draw" />
        </div>
      </div>

      <section
        ref={sectionRef}
        id="motion"
        className="section-dark pt-[var(--section-space-y-mobile)] md:pt-[128px] pb-[var(--section-space-y-mobile)] md:pb-[122px] w-full max-w-full overflow-x-hidden"
      >
        <div className="mx-auto max-w-[1440px] w-full px-6 md:px-12 box-border min-w-0">
          <header className="section-header flex items-start justify-between mb-10 md:mb-14">
            <div>
              <h2 className="gsap-fade-up font-display h-section">Selected Video Work</h2>
              <p className="gsap-fade-up section-body mt-3 max-w-[52ch]">
                Selected video work across product motion and typographic systems.
              </p>
            </div>
            <p className="gsap-fade-up meta-inline hidden md:block">
              Featured Motion — 2024 to 2025
            </p>
          </header>
        </div>

        <div className="mx-auto w-full max-w-full px-6 md:px-12 box-border min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {lunaCast && (
              <ReelVideoTile
                projectId={lunaCast.id}
                title={lunaCast.title}
                desc={lunaCast.desc}
                sources={VIDEO_SOURCES}
                poster={POSTER}
              />
            )}
            {gradualSans && (
              <ReelVideoTile
                projectId={gradualSans.id}
                title={gradualSans.title}
                desc={gradualSans.desc}
                sources={GRADUAL_SANS_VIDEO_SOURCES}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

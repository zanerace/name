import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";
import { getMotionVideoBySlug } from "./motion-data";
import { getWorkProjectById } from "./work-data";

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
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  /** Inline preview stays muted (autoplay policy); fullscreen turns sound on, exit turns it off. */
  const [muted, setMuted] = useState(true);
  /** Avoid `preload="auto"` until the tile is near the viewport — major RAM savings while scrolling. */
  const [mediaNear, setMediaNear] = useState(false);

  useEffect(() => {
    if (videoFailed) return;
    const v = videoRef.current;
    if (!v || !mediaNear) return;
    v.load();
  }, [mediaNear, videoFailed]);

  useEffect(() => {
    if (videoFailed) return;
    const stage = stageRef.current;
    const v = videoRef.current;
    if (!stage || !v) return;

    let playRaf = 0;
    const schedulePlay = () => {
      cancelAnimationFrame(playRaf);
      playRaf = requestAnimationFrame(() => {
        void v.play().catch(() => {});
      });
    };

    const onReady = () => schedulePlay();
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.isIntersecting) setMediaNear(true);
        const hit = e.isIntersecting && e.intersectionRatio >= 0.12;
        if (hit) schedulePlay();
        else if (!e.isIntersecting) v.pause();
      },
      { root: null, rootMargin: "200px 0px 200px 0px", threshold: [0, 0.12, 0.22] },
    );
    io.observe(stage);

    return () => {
      cancelAnimationFrame(playRaf);
      io.disconnect();
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
    };
  }, [videoFailed, projectId, sources]);

  useEffect(() => {
    if (videoFailed) return;
    const v = videoRef.current;
    if (!v) return;

    const isThisVideoFullscreen = () => {
      const fs = document.fullscreenElement;
      const wk = (document as Document & { webkitFullscreenElement?: Element | null })
        .webkitFullscreenElement;
      return fs === v || wk === v;
    };

    const syncMuteToFullscreen = () => {
      if (isThisVideoFullscreen()) {
        setMuted(false);
        v.volume = 1;
        void v.play().catch(() => {});
      } else {
        setMuted(true);
      }
    };

    document.addEventListener("fullscreenchange", syncMuteToFullscreen);
    document.addEventListener("webkitfullscreenchange", syncMuteToFullscreen);
    /* iOS Safari: native fullscreen does not use Fullscreen API on `<video>`. */
    const onWebkitEnd = () => {
      setMuted(true);
    };
    v.addEventListener("webkitendfullscreen", onWebkitEnd);

    return () => {
      document.removeEventListener("fullscreenchange", syncMuteToFullscreen);
      document.removeEventListener("webkitfullscreenchange", syncMuteToFullscreen);
      v.removeEventListener("webkitendfullscreen", onWebkitEnd);
    };
  }, [videoFailed]);

  const onVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const el = v as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
      webkitRequestFullscreen?: () => void;
    };
    if (el.requestFullscreen) {
      void el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.webkitEnterFullscreen) {
      /* Same user gesture — unmute for native iOS fullscreen (no `fullscreenchange`). */
      setMuted(false);
      v.volume = 1;
      el.webkitEnterFullscreen();
      void v.play().catch(() => {});
    }
  };

  return (
    <div className="reel-video reel-intro-reveal">
      <div ref={stageRef} className="reel-stage relative w-full aspect-video bg-foreground overflow-hidden">
        {videoFailed ? (
          <Link
            to="/work/$projectId"
            params={{ projectId }}
            aria-label={`Open ${title} project`}
            className="absolute inset-0 block"
          >
            <img
              src={poster ?? ""}
              alt=""
              width={1280}
              height={720}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </Link>
        ) : (
          <video
            ref={videoRef}
            className="reel-video-el absolute inset-0 w-full h-full object-cover"
            poster={poster}
            autoPlay
            muted={muted}
            loop
            playsInline
            preload={mediaNear ? "metadata" : "none"}
            onClick={onVideoClick}
            onError={() => setVideoFailed(true)}
          >
            {sources.map(({ src, type }) => (
              <source key={src} src={src} type={type} />
            ))}
          </video>
        )}
      </div>
      <div className="mt-5">
        <Link
          to="/work/$projectId"
          params={{ projectId }}
          className="font-display text-[24px] md:text-[34px] link-underline text-foreground hover:text-accent focus-visible:text-accent"
        >
          {title}
        </Link>
        <p className="reel-caption mt-2 text-[15px] md:text-[19px]">{desc}</p>
      </div>
    </div>
  );
}

export function MotionReel() {
  const lunaCast = getWorkProjectById("lunacast");
  const gradualSans = getWorkProjectById("gradual-sans");
  const lunaCatalogEntry = getMotionVideoBySlug("lunacast-channel-reel");
  const gradualCatalogEntry = getMotionVideoBySlug("gradual-sans-motion-study");
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
        el.querySelectorAll<HTMLElement>(".section-header .gsap-fade-up"),
      );
      const videos = Array.from(el.querySelectorAll<HTMLElement>(".reel-intro-reveal"));

      /* Set initial hidden state — CSS does this via .js-scroll-reveal but GSAP
         also needs it here so the timeline actually animates from hidden → visible. */
      if (videos.length) {
        gsap.set(videos, { y: 24, opacity: 0, willChange: "opacity, transform" });
      }

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
          },
          "-=0.34",
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
          },
          "-=0.28",
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="w-full max-w-full overflow-x-hidden">
      <div className="bg-background pb-20 md:pb-[80px] w-full max-w-full overflow-x-hidden">
        <div className="mx-auto max-w-[1440px] w-full px-5 sm:px-6 md:px-12 box-border">
          <div aria-hidden className="section-rule rule-draw" />
        </div>
      </div>

      <section
        ref={sectionRef}
        id="motion"
        className="section-dark cv-auto pt-[var(--section-space-y-mobile)] md:pt-[128px] pb-[var(--section-space-y-mobile)] md:pb-[122px] w-full max-w-full overflow-x-hidden"
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

        <div className="mx-auto w-full max-w-full px-5 sm:px-6 md:px-12 box-border min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            {lunaCast && (
              <ReelVideoTile
                projectId={lunaCast.id}
                title={lunaCast.title}
                desc={lunaCast.desc}
                sources={lunaCatalogEntry?.sources ?? []}
                poster={lunaCatalogEntry?.poster ?? "/reel/poster.png"}
              />
            )}
            {gradualSans && (
              <ReelVideoTile
                projectId={gradualSans.id}
                title={gradualSans.title}
                desc={gradualSans.desc}
                sources={gradualCatalogEntry?.sources ?? []}
                poster={gradualSans.coverImage}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
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

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="miter" aria-hidden="true">
    <path d="M3.5 2 L11 7 L3.5 12 Z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    <line x1="5" y1="3" x2="5" y2="11" />
    <line x1="9" y1="3" x2="9" y2="11" />
  </svg>
);

const VolumeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="miter" aria-hidden="true">
    <path d="M2 5 H4.5 L8 2.5 V11.5 L4.5 9 H2 Z" />
    <path d="M10.5 5 Q11.6 7 10.5 9" strokeLinecap="round" />
  </svg>
);

const MuteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="miter" aria-hidden="true">
    <path d="M2 5 H4.5 L8 2.5 V11.5 L4.5 9 H2 Z" />
    <line x1="10" y1="5" x2="13" y2="9" />
    <line x1="13" y1="5" x2="10" y2="9" />
  </svg>
);

export function MotionReel() {
  const lunaCast = getWorkProjectById("lunacast");
  const root = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => {
      setIsPlaying(!v.paused);
      setIsMuted(v.muted);
    };
    sync();
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    v.addEventListener("volumechange", sync);
    return () => {
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
      v.removeEventListener("volumechange", sync);
    };
  }, []);

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
      const video = el.querySelector<HTMLElement>(".reel-video");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 90%",
          once: true,
        },
        onComplete: () => {
          headerEls.forEach((node) => (node.style.willChange = "auto"));
          if (video) video.style.willChange = "auto";
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
      if (video) {
        tl.to(
          video,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            force3D: true,
          },
          "-=0.28"
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  };

  return (
    <div ref={root} className="w-full max-w-full overflow-x-hidden">
      {/* Cream-side hairline rule + 80px cream cushion below the rule, before dark begins.
          80px above the rule is provided by Selected Work's pb-[80px]. */}
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
              <h2 className="gsap-fade-up font-display h-section">Featured Motion</h2>
              <p className="gsap-fade-up section-body mt-3 max-w-[52ch]">
                {lunaCast?.desc}
              </p>
            </div>
            <p className="gsap-fade-up meta-inline hidden md:block">
              Motion Showcase — LunaCast, 2024
            </p>
          </header>
        </div>

        <div className="reel-video mx-auto w-full max-w-full px-6 md:px-12 box-border min-w-0">
          <div className="reel-stage relative w-full aspect-video bg-foreground overflow-hidden">
            <div className="pointer-events-none absolute top-5 left-5 z-10">
              <p className="font-ui text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-foreground [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
                Featured Motion / LunaCast
              </p>
            </div>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              {VIDEO_SOURCES.map(({ src, type }) => (
                <source key={src} src={src} type={type} />
              ))}
              Your browser does not support embedded video. Try Chrome or Firefox, or export an H.264 MP4 fallback.
            </video>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="reel-control bottom-4 left-4 md:bottom-6 md:left-6"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="reel-control bottom-4 right-4 md:bottom-6 md:right-6"
            >
              {isMuted ? <MuteIcon /> : <VolumeIcon />}
            </button>
          </div>
          <p className="reel-caption font-serif-i text-[18px] md:text-[20px] mt-6 md:mt-8">
            LunaCast application prototype, 2024.
          </p>
        </div>
      </section>
    </div>
  );
}

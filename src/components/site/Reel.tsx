/**
 * Put your reel in public/reel/. Browser tries sources in order (first playable wins).
 * For reliable mobile playback, include an H.264 MP4 named `reel-h264.mp4`.
 */
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

export function Reel() {
  return (
    <section id="motion" className="py-32 md:py-48 border-t border-[var(--rule)]">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <header className="reveal mb-12 md:mb-16 flex items-end justify-between">
          <div>
            <p className="font-ui text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
              § 02
            </p>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight">Motion Reel</h2>
          </div>
          <p className="font-serif-i text-muted-foreground hidden md:block">00:00 — Loop</p>
        </header>
      </div>

      <div className="reveal mx-auto w-full max-w-[1720px] px-2 md:px-6">
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls
          >
            {VIDEO_SOURCES.map(({ src, type }) => (
              <source key={src} src={src} type={type} />
            ))}
            Your browser does not support embedded video. Try Chrome or Firefox, or export an H.264 MP4 fallback.
          </video>
        </div>
        <p className="font-serif-i text-muted-foreground mt-6 px-4 md:px-6">
          Selected motion work, 2024–2026.
        </p>
      </div>
    </section>
  );
}

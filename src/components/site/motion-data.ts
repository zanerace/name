export type MotionVideoSource = {
  src: string;
  type: string;
};

export type MotionComment = {
  author: string;
  body: string;
  postedAt: string;
};

export type MotionVideo = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  poster: string;
  sources: readonly MotionVideoSource[];
  tags: readonly string[];
  linkedProjectId?: string;
  comments: readonly MotionComment[];
};

export const motionVideos: readonly MotionVideo[] = [
  {
    slug: "lunacast-channel-reel",
    title: "LunaCast Channel Reel",
    description:
      "Product identity, interface, and motion system for a lunar-cycle podcast app.",
    publishedAt: "2024-11-18",
    duration: "01:42",
    poster: "/reel/poster.png",
    sources: [
      { src: "/reel/reel-h264.mp4", type: "video/mp4" },
      { src: "/reel/motion-reel-h264.mp4", type: "video/mp4" },
      { src: "/reel/reel.mp4", type: "video/mp4" },
      { src: "/reel/motion-reel.mp4", type: "video/mp4" },
      { src: "/reel/reel.webm", type: "video/webm" },
      { src: "/reel/motion-reel.webm", type: "video/webm" },
      { src: "/reel/poster.mp4", type: "video/mp4" },
      { src: "/reel/motion-reel.mov", type: "video/quicktime" },
    ],
    tags: ["Motion", "Product Identity", "UX Motion"],
    linkedProjectId: "lunacast",
    comments: [
      {
        author: "viewer_31",
        body: "The pacing on the transitions feels super intentional.",
        postedAt: "2026-02-08",
      },
      {
        author: "anonymous",
        body: "Love the moon-phase motif carried through every state.",
        postedAt: "2026-03-12",
      },
    ],
  },
  {
    slug: "gradual-sans-motion-study",
    title: "Gradual Sans Motion Study",
    description:
      "A variable display family exploring optical scaling between text and headline.",
    publishedAt: "2025-04-22",
    duration: "01:17",
    poster: "/work/01.jpg",
    sources: [
      { src: "/work/gradual-sans.mp4.mp4", type: "video/mp4" },
      { src: "/work/gradual-sans.mp4", type: "video/mp4" },
    ],
    tags: ["Type Design", "Kinetic Type"],
    linkedProjectId: "gradual-sans",
    comments: [
      {
        author: "mtn_graphics",
        body: "Great contrast between text and display states.",
        postedAt: "2026-01-17",
      },
    ],
  },
];

export function getMotionVideoBySlug(slug: string) {
  return motionVideos.find((video) => video.slug === slug);
}

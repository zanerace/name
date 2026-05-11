import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { motionVideos } from "@/components/site/motion-data";

type SortMode = "newest" | "oldest";

export const Route = createFileRoute("/motion/")({
  component: MotionCatalogPage,
});

function MotionCatalogPage() {
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const videos = useMemo(() => {
    const list = [...motionVideos];
    list.sort((a, b) => {
      const aTime = new Date(a.publishedAt).getTime();
      const bTime = new Date(b.publishedAt).getTime();
      return sortMode === "newest" ? bTime - aTime : aTime - bTime;
    });
    return list;
  }, [sortMode]);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background px-5 sm:px-6 md:px-12 pt-28 md:pt-32 pb-18 md:pb-24">
        <section className="mx-auto max-w-[1440px]">
          <header className="mb-10 md:mb-12 border-b border-[color:var(--rule)] pb-8">
            <p className="meta-inline mb-4">Motion Channel</p>
            <h1 className="font-display h-section mb-4">Video Catalog</h1>
            <p className="section-body max-w-[62ch]">
              A channel-style archive of motion work with timeline sorting and per-video pages.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="meta-chip font-ui text-[10px] uppercase text-muted-foreground">
                {videos.length} videos
              </span>
              <label className="font-ui text-[10px] uppercase text-muted-foreground">Sort</label>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="meta-chip bg-background text-foreground font-ui text-[10px] uppercase min-h-[38px]"
                aria-label="Sort videos"
              >
                <option value="newest">Newest to oldest</option>
                <option value="oldest">Oldest to newest</option>
              </select>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
            {videos.map((video) => (
              <article key={video.slug} className="min-w-0">
                <Link
                  to="/motion/$videoSlug"
                  params={{ videoSlug: video.slug }}
                  className="block group rounded-[2px] transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:-translate-y-[2px]"
                  aria-label={`Open ${video.title}`}
                >
                  <div className="aspect-video overflow-hidden border border-[color:var(--border)] bg-foreground">
                    <img
                      src={video.poster}
                      alt={`${video.title} poster`}
                      width={1280}
                      height={720}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-4">
                    <h2 className="font-display text-[24px] md:text-[29px] leading-[1.12] text-foreground group-hover:text-accent transition-colors">
                      {video.title}
                    </h2>
                    <p className="mt-2 section-body text-[15px] md:text-[17px] max-w-none">
                      {video.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="meta-chip font-ui text-[10px] uppercase text-muted-foreground">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="meta-chip font-ui text-[10px] uppercase text-muted-foreground">
                        {video.duration}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

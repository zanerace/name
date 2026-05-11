import { Link, createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { getMotionVideoBySlug } from "@/components/site/motion-data";

export const Route = createFileRoute("/motion/$videoSlug")({
  component: MotionVideoDetailPage,
});

function MotionVideoDetailPage() {
  const { videoSlug } = Route.useParams();
  const video = getMotionVideoBySlug(videoSlug);

  if (!video) {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-background px-5 sm:px-6 md:px-12 pt-28 md:pt-32 pb-20 md:pb-24">
          <div className="mx-auto max-w-[960px]">
            <p className="font-ui text-[10px] uppercase text-muted-foreground mb-4">Motion</p>
            <h1 className="font-display h-section mb-6">Video not found</h1>
            <Link to="/motion" className="meta-chip font-ui text-[10px] uppercase">
              Back to catalog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background px-5 sm:px-6 md:px-12 pt-28 md:pt-32 pb-20 md:pb-24">
        <article className="mx-auto max-w-[1200px]">
          <div className="mb-7 md:mb-9 flex flex-wrap gap-3">
            <Link to="/motion" className="meta-chip font-ui text-[10px] uppercase">
              Back to catalog
            </Link>
            {video.linkedProjectId ? (
              <Link
                to="/work/$projectId"
                params={{ projectId: video.linkedProjectId }}
                className="meta-chip font-ui text-[10px] uppercase"
              >
                Open project page
              </Link>
            ) : null}
          </div>

          <header className="mb-8 md:mb-10">
            <h1 className="font-display h-section mb-4">{video.title}</h1>
            <p className="section-body max-w-[64ch]">{video.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="meta-chip font-ui text-[10px] uppercase text-muted-foreground">
                {new Date(video.publishedAt).toLocaleDateString()}
              </span>
              <span className="meta-chip font-ui text-[10px] uppercase text-muted-foreground">
                {video.duration}
              </span>
              {video.tags.map((tag) => (
                <span key={tag} className="meta-chip font-ui text-[10px] uppercase text-accent">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <section className="frame-panel p-4 md:p-6 mb-10 md:mb-12">
            <div className="aspect-video overflow-hidden border border-[color:var(--border)] bg-foreground">
              <video
                controls
                playsInline
                preload="metadata"
                poster={video.poster}
                className="block h-full w-full object-cover"
              >
                {video.sources.map((source) => (
                  <source key={source.src} src={source.src} type={source.type} />
                ))}
              </video>
            </div>
          </section>

          <section className="frame-panel p-4 md:p-6">
            <h2 className="font-display text-[28px] md:text-[34px] mb-3">Comments</h2>
            <p className="section-body text-[15px] md:text-[17px] mb-6 max-w-[68ch]">
              Comments are read-only in v1. Posting and moderation are planned for a future update.
            </p>
            <ul className="space-y-4">
              {video.comments.map((comment, idx) => (
                <li key={`${comment.author}-${idx}`} className="border border-[color:var(--border)] p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-ui text-[10px] uppercase text-foreground">{comment.author}</span>
                    <span className="font-ui text-[10px] uppercase text-muted-foreground">
                      {new Date(comment.postedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="section-body text-[15px] md:text-[16px] max-w-none">{comment.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

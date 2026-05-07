import { Link, createFileRoute } from "@tanstack/react-router";
import { getWorkProjectById } from "@/components/site/work-data";

export const Route = createFileRoute("/work/$projectId")({
  component: WorkProjectPage,
});

function WorkProjectPage() {
  const { projectId } = Route.useParams();
  const project = getWorkProjectById(projectId);

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
    <main className="min-h-screen bg-background px-6 md:px-12 py-24 md:py-28">
      <article className="mx-auto max-w-[1200px]">
        <div className="mb-8 md:mb-10">
          <Link to="/" className="meta-chip font-ui text-[10px] uppercase">
            Back to home
          </Link>
        </div>

        <header className="mb-12 md:mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="meta-chip font-ui text-[10px] uppercase text-accent">{project.num}</span>
            <span className="meta-chip font-ui text-[10px] uppercase text-muted-foreground">
              {project.tag} — {project.year}
            </span>
          </div>
          <h1 className="font-display h-section mb-4">{project.title}</h1>
          <p className="font-serif text-lg md:text-2xl leading-[1.42] text-foreground max-w-[38ch]">{project.desc}</p>
        </header>

        <section className="frame-panel p-4 md:p-6 mb-10 md:mb-12">
          <div className="aspect-[16/9] overflow-hidden border border-border">
            <img
              src={project.coverImage}
              alt={project.alt}
              className="block w-full h-full object-cover"
              width={1600}
              height={900}
            />
          </div>
        </section>

        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-8">
            <p className="font-serif text-base md:text-xl leading-[1.56] text-foreground">{project.body}</p>
          </div>
        </section>
      </article>
    </main>
  );
}

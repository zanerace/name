import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Work } from "@/components/site/Work";
import { MotionReel } from "@/components/site/MotionReel";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Race Kipping — Media Designer" },
      {
        name: "description",
        content:
          "Race Kipping is a media designer working across identity, motion, and sound. Selected work, 2024–2026.",
      },
      { property: "og:title", content: "Race Kipping — Media Designer" },
      {
        property: "og:description",
        content: "Identity, motion, and sound. Selected work, 2024–2026.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <Work />
      <MotionReel />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}

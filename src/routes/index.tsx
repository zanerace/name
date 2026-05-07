import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Work } from "@/components/site/Work";
import { Reel } from "@/components/site/Reel";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";

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
  useReveal();
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Work />
      <Reel />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}

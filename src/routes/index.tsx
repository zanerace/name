import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HomeReadyGate } from "@/components/site/HomeReadyGate";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Work } from "@/components/site/Work";
import { MotionReel } from "@/components/site/MotionReel";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { useHomeScrollWarmup } from "@/hooks/use-home-scroll-warmup";
import { getLenisInstance } from "@/lib/lenis";

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
  const { ready, progress, showGate } = useHomeScrollWarmup();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!ready) root.classList.add("home-warm-pending");
    else root.classList.remove("home-warm-pending");
    return () => root.classList.remove("home-warm-pending");
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    getLenisInstance()?.scrollTo(0, { immediate: true });
  }, [ready]);

  return (
    <main
      className="min-h-screen w-full max-w-full overflow-x-hidden"
      inert={showGate ? true : undefined}
    >
      {showGate ? <HomeReadyGate progress={progress} /> : null}
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

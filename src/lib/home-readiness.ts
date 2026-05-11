import { getWorkProjectById, workProjects } from "@/components/site/work-data";
import { getLenisInstance } from "@/lib/lenis";
import { scheduleScrollTriggerRefresh } from "@/lib/scroll-trigger-schedule";

const EXTRA_IMAGE_URLS = ["/about-portrait.png", "/reel/poster.png"] as const;

function decodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if ("decode" in img) {
        void img.decode().then(resolve).catch(() => resolve());
      } else {
        resolve();
      }
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

function collectHomeImageUrls(): string[] {
  const urls = new Set<string>();
  for (const p of workProjects) {
    urls.add(p.coverImage);
  }
  const lunar = getWorkProjectById("lunacast");
  if (lunar) urls.add(lunar.coverImage);
  for (const u of EXTRA_IMAGE_URLS) {
    urls.add(u);
  }
  return [...urls];
}

/**
 * Warm fonts + decode homepage imagery off the critical path, then refresh ScrollTrigger / Lenis
 * so first scroll through Work / Motion / About hits fewer decode/layout spikes.
 */
export async function warmHomeScrollAssets(onProgress?: (t: number) => void): Promise<void> {
  const report = (t: number) => onProgress?.(Math.min(1, Math.max(0, t)));

  report(0.05);
  try {
    await Promise.race([document.fonts.ready, new Promise<void>((r) => setTimeout(r, 2000))]);
  } catch {
    /* ignore */
  }
  report(0.22);

  const list = collectHomeImageUrls();
  let done = 0;
  await Promise.all(
    list.map(async (src) => {
      await decodeImage(src);
      done += 1;
      report(0.22 + (0.58 * done) / list.length);
    }),
  );

  report(0.82);
  scheduleScrollTriggerRefresh();
  getLenisInstance()?.resize();

  report(1);
}

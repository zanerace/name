import { useEffect, useRef } from "react";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";

const links = [
  { label: "Behance", href: "https://www.behance.net/racekipping" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/race-kipping-2008a0299/" },
  { label: "YouTube", href: "https://www.youtube.com/@racekipping" },
];

export function Contact() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const ruleEl = el.querySelector<HTMLElement>(".section-rule");
      const headerEls = el.querySelectorAll<HTMLElement>(".section-header > *");
      const detailEls = el.querySelectorAll<HTMLElement>(".contact-detail");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      if (ruleEl) {
        tl.to(ruleEl, { scaleX: 1, duration: 1.15, ease: "power2.inOut" });
      }
      tl.to(
        headerEls,
        { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.08 },
        "-=0.6"
      );
      tl.to(
        detailEls,
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: "power2.out" },
        "-=0.45"
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="contact" className="py-32 md:py-[220px]">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div aria-hidden className="rule-draw section-rule mb-32 md:mb-44" />
        <div className="grid grid-cols-12 gap-x-10 gap-y-16">
          <header className="section-header col-span-12 md:col-span-5">
            <h2 className="gsap-fade-up font-display h-section">
              Currently taking on{" "}
              <span className="font-serif-i text-accent">new work.</span>
            </h2>
          </header>

          <div className="col-span-12 md:col-start-7 md:col-span-6 frame-panel p-6 md:p-8">
            <dl className="space-y-10">
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="font-ui text-[10px] uppercase text-muted-foreground mb-3">Email</dt>
                <dd>
                  <a
                    href="mailto:info@racekipping.com"
                    className="font-display text-2xl md:text-3xl link-underline"
                  >
                    info@racekipping.com
                  </a>
                </dd>
              </div>
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="font-ui text-[10px] uppercase text-muted-foreground mb-3">Phone</dt>
                <dd>
                  <a
                    href="tel:+16187998495"
                    className="font-display text-2xl md:text-3xl link-underline"
                  >
                    +1 (618) 799 8495
                  </a>
                </dd>
              </div>
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="font-ui text-[10px] uppercase text-muted-foreground mb-3">Elsewhere</dt>
                <dd className="flex flex-wrap gap-x-8 gap-y-3">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-xl link-underline inline-flex items-center gap-2"
                    >
                      {l.label}
                      <span aria-hidden="true" className="text-accent">
                        ↗
                      </span>
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

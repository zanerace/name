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
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          stagger: 0.08,
        },
        "-=0.6",
      );
      tl.to(
        detailEls,
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
        "-=0.45",
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="contact"
      className="cv-auto py-[var(--section-space-y-mobile)] md:py-[var(--section-space-y-desktop)] w-full max-w-full overflow-x-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
        <div aria-hidden className="rule-draw section-rule mb-14 md:mb-20" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-0 lg:gap-x-10 gap-y-10 lg:gap-y-14 min-w-0">
          <header className="section-header lg:col-span-5 min-w-0">
            <p className="gsap-fade-up section-kicker">§ 04</p>
            <h2 className="gsap-fade-up font-display text-[clamp(38px,12vw,88px)] leading-[0.95] tracking-[-0.025em]">
              Currently taking on <span className="font-serif-i text-accent">new work.</span>
            </h2>
          </header>

          <div className="lg:col-start-7 lg:col-span-6 min-w-0 lg:border-l lg:border-[color:var(--border)] lg:pl-10 xl:pl-12 lg:self-start">
            <dl className="space-y-8">
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="font-ui text-[9px] uppercase text-muted-foreground mb-3">Email</dt>
                <dd className="min-w-0">
                  <a
                    href="mailto:info@racekipping.com"
                    className="font-display text-[18px] leading-[1.35] link-underline break-all md:break-normal transition-colors duration-200 ease-out hover:text-accent focus-visible:text-accent"
                  >
                    info@racekipping.com
                  </a>
                </dd>
              </div>
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="font-ui text-[9px] uppercase text-muted-foreground mb-3">Phone</dt>
                <dd className="min-w-0">
                  <a
                    href="tel:+16187998495"
                    className="font-display text-[18px] leading-[1.35] link-underline break-words transition-colors duration-200 ease-out hover:text-accent focus-visible:text-accent"
                  >
                    +1 (618) 799 8495
                  </a>
                </dd>
              </div>
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="font-ui text-[9px] uppercase text-muted-foreground mb-3">Elsewhere</dt>
                <dd className="flex flex-wrap items-center gap-y-2 min-w-0">
                  {links.map((l, i) => (
                    <span key={l.label} className="inline-flex items-center">
                      {i > 0 && <span className="mx-2 text-muted-foreground">/</span>}
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display text-[18px] leading-[1.35] transition-colors duration-200 ease-out hover:text-accent focus-visible:text-accent"
                      >
                        {l.label}
                      </a>
                    </span>
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

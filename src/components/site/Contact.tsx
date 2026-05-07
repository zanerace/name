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
        "-=0.6"
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
        "-=0.45"
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="contact" className="py-20 md:py-[132px] w-full max-w-full overflow-x-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div aria-hidden className="rule-draw section-rule mb-16 md:mb-24" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-0 md:gap-x-10 gap-y-10 md:gap-y-14 min-w-0">
          <header className="section-header md:col-span-5 min-w-0">
            <div className="section-kicker gsap-fade-up">
              <span className="section-num">04</span>
              <span className="section-line" />
            </div>
            <h2 className="gsap-fade-up font-display h-section">
              Currently taking on{" "}
              <span className="font-serif-i text-accent">new work.</span>
            </h2>
          </header>

          <div className="md:col-start-7 md:col-span-6 frame-panel p-7 md:p-9 min-w-0">
            <dl className="space-y-8">
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="meta-inline mb-3">Email</dt>
                <dd className="min-w-0">
                  <a
                    href="mailto:info@racekipping.com"
                    className="font-display text-[34px] md:text-[38px] link-underline break-all md:break-normal"
                  >
                    info@racekipping.com
                  </a>
                </dd>
              </div>
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="meta-inline mb-3">Phone</dt>
                <dd className="min-w-0">
                  <a
                    href="tel:+16187998495"
                    className="font-display text-[34px] md:text-[38px] link-underline break-words"
                  >
                    +1 (618) 799 8495
                  </a>
                </dd>
              </div>
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="meta-inline mb-3">Elsewhere</dt>
                <dd className="flex flex-wrap gap-x-8 gap-y-3 min-w-0">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    className="font-display text-[28px] md:text-[30px] link-underline inline-flex items-center gap-2 break-words"
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

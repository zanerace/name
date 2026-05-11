import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";

/* ── Plug in your Formspree form ID for server-side delivery (formspree.io).
   Leave empty to fall back to a pre-filled mailto: link instead. ── */
const FORMSPREE_ID = "";

const links = [
  { label: "Behance", href: "https://www.behance.net/racekipping" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/race-kipping-2008a0299/" },
  { label: "YouTube", href: "https://www.youtube.com/@racekipping" },
];

type FormState = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState<FormState>("idle");
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });

  useEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const ruleEl = el.querySelector<HTMLElement>(".section-rule");
      const headerEls = el.querySelectorAll<HTMLElement>(".section-header > *");
      const detailEls = el.querySelectorAll<HTMLElement>(".contact-detail");
      const formPanel = el.querySelector<HTMLElement>(".contact-form-panel");

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      if (ruleEl) tl.to(ruleEl, { scaleX: 1, duration: 1.15, ease: "power2.inOut" });
      tl.to(
        headerEls,
        { y: 0, opacity: 1, duration: 0.7, ease: "cubic-bezier(0.22, 1, 0.36, 1)", stagger: 0.08 },
        "-=0.6",
      );
      tl.to(
        detailEls,
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
        "-=0.45",
      );
      if (formPanel) {
        tl.to(
          formPanel,
          { y: 0, opacity: 1, duration: 0.75, ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
          "-=0.5",
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  const errors = {
    name: fields.name.trim().length < 2,
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()),
    message: fields.message.trim().length < 10,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleChange =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleBlur = (key: keyof typeof fields) => () =>
    setTouched((t) => ({ ...t, [key]: true }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (hasErrors) return;

    setFormState("sending");

    if (FORMSPREE_ID) {
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(fields),
        });
        if (res.ok) {
          animateSuccess();
        } else {
          setFormState("error");
        }
      } catch {
        setFormState("error");
      }
    } else {
      const subject = encodeURIComponent(`Portfolio inquiry from ${fields.name}`);
      const body = encodeURIComponent(
        `From: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`,
      );
      window.location.href = `mailto:info@racekipping.com?subject=${subject}&body=${body}`;
      animateSuccess();
    }
  };

  const animateSuccess = () => {
    setFormState("sent");
    const form = formRef.current;
    const success = successRef.current;
    if (!form || !success || prefersReducedMotion()) return;
    gsap.to(form, { opacity: 0, y: -8, duration: 0.28, ease: "power2.in" });
    gsap.fromTo(
      success,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.6, ease: "cubic-bezier(0.22, 1, 0.36, 1)", delay: 0.22 },
    );
  };

  const inputClass = (key: keyof typeof fields) =>
    `contact-input${touched[key] && errors[key] ? " contact-input-error" : ""}`;

  return (
    <section
      ref={root}
      id="contact"
      className="cv-auto py-[var(--section-space-y-mobile)] md:py-[var(--section-space-y-desktop)] w-full max-w-full overflow-x-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
        <div aria-hidden className="rule-draw section-rule mb-14 md:mb-20" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-0 lg:gap-x-10 gap-y-14 lg:gap-y-0 min-w-0">

          {/* Left — heading + contact details */}
          <div className="lg:col-span-5 min-w-0 flex flex-col gap-12">
            <header className="section-header">
              <p className="gsap-fade-up section-kicker">§ 04</p>
              <h2 className="gsap-fade-up font-display text-[clamp(38px,12vw,88px)] leading-[0.95] tracking-[-0.025em]">
                Currently taking on{" "}
                <span className="font-serif-i text-accent">new work.</span>
              </h2>
            </header>

            <dl className="space-y-8">
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="font-ui text-[9px] uppercase text-muted-foreground mb-3">Email</dt>
                <dd>
                  <a
                    href="mailto:info@racekipping.com"
                    className="font-display text-[18px] leading-[1.35] link-underline break-all md:break-normal transition-colors duration-200 hover:text-accent focus-visible:text-accent"
                  >
                    info@racekipping.com
                  </a>
                </dd>
              </div>
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="font-ui text-[9px] uppercase text-muted-foreground mb-3">Phone</dt>
                <dd>
                  <a
                    href="tel:+16187998495"
                    className="font-display text-[18px] leading-[1.35] link-underline break-words transition-colors duration-200 hover:text-accent focus-visible:text-accent"
                  >
                    +1 (618) 799 8495
                  </a>
                </dd>
              </div>
              <div className="contact-detail gsap-fade-up-sm">
                <dt className="font-ui text-[9px] uppercase text-muted-foreground mb-3">
                  Elsewhere
                </dt>
                <dd className="flex flex-wrap items-center gap-y-2">
                  {links.map((l, i) => (
                    <span key={l.label} className="inline-flex items-center">
                      {i > 0 && <span className="mx-2 text-muted-foreground">/</span>}
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display text-[18px] leading-[1.35] transition-colors duration-200 hover:text-accent focus-visible:text-accent"
                      >
                        {l.label}
                      </a>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* Right — contact form */}
          <div className="contact-form-panel lg:col-start-7 lg:col-span-6 min-w-0 lg:border-l lg:border-[color:var(--border)] lg:pl-10 xl:pl-12">
            <p className="font-ui text-[9px] uppercase tracking-[0.22em] text-muted-foreground mb-8">
              Send a message
            </p>

            {/* Success state */}
            <div
              ref={successRef}
              role="status"
              aria-live="polite"
              style={{ display: formState === "sent" ? "block" : "none" }}
            >
              <div className="h-px w-10 bg-accent mb-6" />
              <p className="font-display text-[24px] md:text-[30px] leading-[1.15] text-foreground mb-3">
                Message received.
              </p>
              <p className="section-body text-[16px] text-[color:var(--text-soft)] max-w-[38ch]">
                Thank you for reaching out — I'll be in touch shortly.
              </p>
            </div>

            {/* Form */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              style={{ display: formState === "sent" ? "none" : "flex" }}
              className="flex-col gap-7"
            >
              <div className="contact-field-group">
                <label htmlFor="cf-name" className="contact-label">
                  Name
                </label>
                <input
                  id="cf-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  className={inputClass("name")}
                  value={fields.name}
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  aria-invalid={touched.name && errors.name ? "true" : undefined}
                />
                {touched.name && errors.name && (
                  <p className="contact-error-msg" role="alert">
                    Please enter your name.
                  </p>
                )}
              </div>

              <div className="contact-field-group">
                <label htmlFor="cf-email" className="contact-label">
                  Email
                </label>
                <input
                  id="cf-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  className={inputClass("email")}
                  value={fields.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  aria-invalid={touched.email && errors.email ? "true" : undefined}
                />
                {touched.email && errors.email && (
                  <p className="contact-error-msg" role="alert">
                    Please enter a valid email.
                  </p>
                )}
              </div>

              <div className="contact-field-group">
                <label htmlFor="cf-message" className="contact-label">
                  Message
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project…"
                  className={`contact-textarea ${inputClass("message")}`}
                  value={fields.message}
                  onChange={handleChange("message")}
                  onBlur={handleBlur("message")}
                  aria-invalid={touched.message && errors.message ? "true" : undefined}
                />
                {touched.message && errors.message && (
                  <p className="contact-error-msg" role="alert">
                    Please include a message (10+ characters).
                  </p>
                )}
              </div>

              {formState === "error" && (
                <p className="contact-error-msg" role="alert">
                  Something went wrong. Please email me directly at{" "}
                  <a href="mailto:info@racekipping.com" className="underline">
                    info@racekipping.com
                  </a>
                  .
                </p>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="contact-submit"
                >
                  {formState === "sending" ? (
                    <span className="inline-flex items-center gap-2.5">
                      <span
                        className="block w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      Sending
                    </span>
                  ) : (
                    "Send message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

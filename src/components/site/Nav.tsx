import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useRouterState } from "@tanstack/react-router";
import type Lenis from "lenis";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { lockScroll } from "@/lib/scroll-lock";
import { workProjects } from "./work-data";

type NavItem = {
  label: string;
  href?: string;
  to?: string;
};

const items: readonly NavItem[] = [
  { href: "#work", label: "Work" },
  { to: "/motion", label: "Motion" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const SCROLL_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

type LenisWindow = typeof window & { __lenis?: Lenis };

/**
 * Smooth-scroll an in-page anchor through Lenis instead of letting the browser
 * fire its native fragment-jump. If Lenis isn't mounted (reduced-motion never
 * skips it now, but for SSR / initial hydration safety we still fall back to
 * `scrollIntoView`).
 */
function scrollToHash(targetId: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(targetId);
  if (!el) {
    const next = targetId === "top" ? "/" : `/#${targetId}`;
    window.location.assign(next);
    return;
  }
  const lenis = typeof window !== "undefined" ? (window as LenisWindow).__lenis : undefined;
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.5, easing: SCROLL_EASING });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  scrollToHash(href.slice(1));
}

function resolveActiveFromLocation(): string {
  if (typeof window === "undefined") return "#work";
  const hash = window.location.hash || "";
  const isKnownSection = items.some((item) => item.href === hash);
  if (isKnownSection) return hash;
  if (window.location.pathname.startsWith("/motion")) return "/motion";
  if (window.location.pathname.startsWith("/work/")) return "#work";
  return window.location.pathname === "/" ? "#work" : "";
}

const HamburgerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line x1="0" y1="11" x2="24" y2="11" stroke="currentColor" strokeWidth="1" />
    <line x1="0" y1="17" x2="24" y2="17" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>(resolveActiveFromLocation);
  const location = useRouterState({ select: (s) => s.location });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname !== "/") {
      setActiveHref(resolveActiveFromLocation());
      return;
    }

    const sections = items
      .map((item) => item.href)
      .filter(Boolean)
      .map((href) => document.querySelector<HTMLElement>(href as string))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const id = visible[0].target.id;
        if (id) setActiveHref(`#${id}`);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    setActiveHref(resolveActiveFromLocation());
  }, [location.pathname, location.hash]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200 ease-out ${
        scrolled ? "nav-plate is-scrolled" : "nav-plate"
      }`}
    >
      <nav className="mx-auto max-w-[1440px] w-full py-4 md:py-0 px-5 sm:px-6 md:px-12 md:h-[74px] flex items-center justify-between box-border">
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, "#top")}
          className="text-foreground shrink-0 transition-colors duration-200 ease-out md:hover:text-accent nav-brand"
        >
          <span className="md:hidden font-sans text-[14px] uppercase tracking-[0.13em] font-medium nav-brand-chip">
            RK
          </span>
          <span className="hidden md:inline font-ui text-[13px] uppercase nav-brand-chip">
            Race Kipping
          </span>
        </a>

        <ul className="hidden md:flex font-ui items-center gap-5 lg:gap-7 text-[15px] uppercase text-muted-foreground shrink-0">
          {items.map((it) => (
            <li key={it.label} className="relative group">
              {it.to ? (
                <Link
                  to={it.to}
                  aria-current={activeHref === it.to ? "page" : undefined}
                  className={`link-underline transition-colors duration-200 ease-out whitespace-nowrap font-ui uppercase ${
                    activeHref === it.to ? "text-foreground nav-active" : ""
                  }`}
                >
                  {it.label}
                </Link>
              ) : (
                <a
                  href={it.href}
                  onClick={(e) => handleNavClick(e, it.href as string)}
                  aria-current={activeHref === it.href ? "page" : undefined}
                  className={`link-underline transition-colors duration-200 ease-out whitespace-nowrap font-ui uppercase ${
                    activeHref === it.href ? "text-foreground nav-active" : ""
                  }`}
                >
                  {it.label}
                </a>
              )}
              {it.href === "#work" && (
                <div className="absolute left-0 top-full pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-180">
                  <div className="frame-panel bg-background/95 min-w-[230px] p-3">
                    <ul className="space-y-2 normal-case">
                      {workProjects.map((project) => (
                        <li key={project.id}>
                          <Link
                            to="/work/$projectId"
                            params={{ projectId: project.id }}
                            className="block font-display text-[16px] leading-tight text-foreground/90 hover:text-accent transition-colors"
                          >
                            {project.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 text-foreground shrink-0"
        >
          <HamburgerIcon />
        </button>
      </nav>

      {open && <NavOverlay onClose={() => setOpen(false)} />}
    </header>
  );
}

function NavOverlay({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);
  const location = useRouterState({ select: (s) => s.location });
  const activeHref = resolveActiveFromLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;
    previouslyFocused.current = (document.activeElement as HTMLElement | null) ?? null;
    const unlock = lockScroll();

    const el = overlayRef.current;
    if (el && !prefersReducedMotion()) {
      gsap.set(el, { opacity: 0 });
      gsap.to(el, { opacity: 1, duration: 0.2, ease: "power2.out" });
    }

    const t = window.setTimeout(() => closeRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(t);
      unlock();
      previouslyFocused.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = (afterClose?: () => void) => {
    if (closingRef.current) return;
    closingRef.current = true;
    const el = overlayRef.current;
    const finalize = () => {
      onClose();
      if (afterClose) {
        // Two RAFs lets `lockScroll`'s unlock (which calls `window.scrollTo`
        // back to the captured Y and `lenis.start()`) fully settle before our
        // smooth scrollTo begins — otherwise the unlock would snap-cancel it.
        requestAnimationFrame(() => requestAnimationFrame(() => afterClose()));
      }
    };
    if (!el || prefersReducedMotion()) {
      finalize();
      return;
    }
    gsap.to(el, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: finalize,
    });
  };

  const handleCloseClick = () => close();

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-[90] bg-background flex flex-col overflow-x-hidden"
    >
      <div className="flex items-center justify-between py-4 px-5 sm:px-6 box-border">
        <span className="font-sans text-[12px] uppercase tracking-[0.18em] font-medium text-foreground">
          RK
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={handleCloseClick}
          aria-label="Close menu"
          className="lightbox-control"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden="true"
          >
            <line x1="2" y1="2" x2="12" y2="12" />
            <line x1="12" y1="2" x2="2" y2="12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 px-5 sm:px-6 pb-8 overflow-x-hidden overflow-y-auto">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col items-center gap-3">
            {it.to ? (
              <Link
                to={it.to}
                onClick={() => close()}
                aria-current={activeHref === it.to ? "page" : undefined}
                className={`font-display link-underline text-center max-w-full ${
                  activeHref === it.to ? "text-foreground nav-active" : "text-foreground"
                }`}
                style={{ fontSize: "clamp(32px, 8.5vw, 56px)" }}
              >
                {it.label}
              </Link>
            ) : (
              <a
                href={it.href}
                onClick={(e) => {
                  e.preventDefault();
                  const id = (it.href as string).slice(1);
                  close(() => scrollToHash(id));
                }}
                aria-current={activeHref === it.href ? "page" : undefined}
                className={`font-display link-underline text-center max-w-full ${
                  activeHref === it.href ? "text-foreground nav-active" : "text-foreground"
                }`}
                style={{ fontSize: "clamp(32px, 8.5vw, 56px)" }}
              >
                {it.label}
              </a>
            )}
            {it.href === "#work" && (
              <div className="flex flex-col items-center gap-1.5">
                {workProjects.map((project) => (
                  <Link
                    key={project.id}
                    to="/work/$projectId"
                    params={{ projectId: project.id }}
                    onClick={() => close()}
                    aria-current={location.pathname === `/work/${project.id}` ? "page" : undefined}
                    className={`font-display text-[18px] link-underline ${
                      location.pathname === `/work/${project.id}`
                        ? "text-foreground nav-active"
                        : "text-muted-foreground"
                    }`}
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { lockScroll } from "@/lib/scroll-lock";

export type LightboxImage = { src: string; alt: string };

type LightboxProps = {
  images: LightboxImage[];
  startIndex: number;
  title: string;
  onClose: () => void;
};

const SWIPE_THRESHOLD = 50;

export function Lightbox({ images, startIndex, title, onClose }: LightboxProps) {
  const [index, setIndex] = useState(() =>
    Math.max(0, Math.min(images.length - 1, startIndex))
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const closingRef = useRef(false);

  // Mount: capture focus origin, lock scroll, run entry animation, focus close button.
  useEffect(() => {
    if (typeof document === "undefined") return;
    previouslyFocused.current =
      (document.activeElement as HTMLElement | null) ?? null;
    const unlock = lockScroll();

    const overlay = overlayRef.current;
    const frame = frameRef.current;
    const reduced = prefersReducedMotion();

    if (overlay && frame && !reduced) {
      gsap.set(overlay, { opacity: 0 });
      gsap.set(frame, { opacity: 0, scale: 0.96, force3D: true });
      gsap.to(overlay, { opacity: 1, duration: 0.2, ease: "power2.out" });
      gsap.to(frame, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
        force3D: true,
      });
    }

    const focusTimer = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 30);

    return () => {
      window.clearTimeout(focusTimer);
      unlock();
      const target = previouslyFocused.current;
      if (target && typeof target.focus === "function") {
        target.focus();
      }
    };
  }, []);

  // Crossfade image when navigating between gallery items.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || prefersReducedMotion()) return;
    gsap.fromTo(
      img,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "power2.out" }
    );
  }, [index]);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const overlay = overlayRef.current;
    const frame = frameRef.current;
    const reduced = prefersReducedMotion();
    if (!overlay || !frame || reduced) {
      onClose();
      return;
    }
    gsap.to(frame, {
      opacity: 0,
      scale: 0.96,
      duration: 0.2,
      ease: "power2.in",
      force3D: true,
    });
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: onClose,
    });
  }, [onClose]);

  const next = useCallback(() => {
    if (images.length <= 1) return;
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    if (images.length <= 1) return;
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard: Escape closes, arrows navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        return;
      }
      if (e.key === "Tab") {
        const dlg = dialogRef.current;
        if (!dlg) return;
        const focusables = Array.from(
          dlg.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
          )
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, next, prev]);

  // Mobile / touch swipe — desktop uses arrow buttons + keys.
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null || images.length <= 1) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) next();
    else prev();
  };

  if (typeof document === "undefined") return null;

  const current = images[index];

  const node = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — image ${index + 1} of ${images.length}`}
      className="lightbox fixed inset-0 z-[100]"
    >
      <div
        ref={overlayRef}
        onClick={close}
        className="lightbox-overlay absolute inset-0"
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={frameRef}
          className="lightbox-frame pointer-events-auto"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <img
            ref={imgRef}
            src={current.src}
            alt={current.alt}
            className="lightbox-image block"
          />
        </div>
      </div>

      <button
        ref={closeRef}
        type="button"
        onClick={close}
        aria-label="Close gallery"
        className="lightbox-control lightbox-close absolute top-4 right-4 md:top-6 md:right-6"
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

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="lightbox-control lightbox-arrow absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hidden md:inline-flex"
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
              <polyline points="9,2 3,7 9,12" strokeLinejoin="miter" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="lightbox-control lightbox-arrow absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden md:inline-flex"
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
              <polyline points="5,2 11,7 5,12" strokeLinejoin="miter" />
            </svg>
          </button>
        </>
      )}

      <p className="lightbox-counter absolute bottom-4 left-4 md:bottom-6 md:left-6 font-ui text-[10px] uppercase text-foreground pointer-events-none">
        {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
      </p>

      <p className="lightbox-title absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-6 font-serif italic text-foreground text-sm md:text-base pointer-events-none whitespace-nowrap">
        {title}
      </p>
    </div>
  );

  return createPortal(node, document.body);
}

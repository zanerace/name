import { getLenis } from "./motion";

/**
 * Lock body scroll while preserving the current scroll offset. Pairs with
 * Lenis (paused via getLenis().stop()) and the position-fixed body trick so
 * native scroll is also blocked. Returns an unlock function bound to the
 * scroll position captured at lock time.
 */
export function lockScroll(): () => void {
  if (typeof document === "undefined") return () => {};
  const scrollY = window.scrollY;
  const body = document.body;
  const previous = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
  };

  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";

  const lenis = getLenis();
  lenis?.stop();

  return () => {
    body.style.position = previous.position;
    body.style.top = previous.top;
    body.style.left = previous.left;
    body.style.right = previous.right;
    body.style.width = previous.width;
    body.style.overflow = previous.overflow;
    window.scrollTo(0, scrollY);
    lenis?.start();
  };
}

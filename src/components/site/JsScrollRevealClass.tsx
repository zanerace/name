import { useLayoutEffect } from "react";

/**
 * Applies scroll-reveal hooks only after hydration so SSR markup matches the first client render.
 * Replaces the prior inline body script (which ran before hydration and caused `<html>` mismatches).
 */
export function JsScrollRevealClass() {
  useLayoutEffect(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      document.documentElement.classList.add("js-scroll-reveal");
    } catch {
      /* ignore */
    }
    return () => {
      document.documentElement.classList.remove("js-scroll-reveal");
    };
  }, []);

  return null;
}

/**
 * Thin barrel — keeps GSAP / ScrollTrigger imports centralized for debugging.
 * Runtime registration still happens via `@/lib/motion`.
 */
export {
  gsap,
  ScrollTrigger,
  registerMotion,
  prefersReducedMotion,
  getLenis,
  isTouchDevice,
} from "./motion";

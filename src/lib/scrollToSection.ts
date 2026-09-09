import type Lenis from "lenis";

export function scrollToSection(
  href: string,
  lenis?: Lenis | null,
  options?: { duration?: number },
) {
  if (!href.startsWith("#")) return;

  const id = href.slice(1);
  const target = document.getElementById(id);
  if (!target) return;

  const duration = options?.duration ?? 1.15;

  // Ensure Lenis can move after mobile menu unlocked body scroll
  lenis?.start?.();

  if (lenis) {
    // Lenis already subtracts CSS scroll-margin-top — no extra nav offset
    lenis.scrollTo(target, { offset: 0, duration, immediate: false });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.history.pushState(null, "", href);
}

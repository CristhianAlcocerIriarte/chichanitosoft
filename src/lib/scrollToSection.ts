import type Lenis from "lenis";

export function getNavOffset() {
  if (typeof window === "undefined") return -64;

  const header = document.querySelector("header");
  const height = header?.getBoundingClientRect().height ?? 64;
  return -Math.round(height);
}

export function scrollToSection(
  href: string,
  lenis?: Lenis | null,
  options?: { duration?: number },
) {
  if (!href.startsWith("#")) return;

  const id = href.slice(1);
  const target = document.getElementById(id);
  if (!target) return;

  const offset = getNavOffset();
  const duration = options?.duration ?? 1.15;

  // Ensure Lenis can move after mobile menu unlocked body scroll
  lenis?.start?.();

  if (lenis) {
    lenis.scrollTo(target, { offset, duration, immediate: false });
  } else {
    const top =
      target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  window.history.pushState(null, "", href);
}

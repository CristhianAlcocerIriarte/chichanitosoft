"use client";

import { useLenis } from "lenis/react";
import type { MouseEvent, ReactNode } from "react";

type ScrollToHeroProps = {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
};

export function ScrollToHero({
  children,
  className,
  onNavigate,
}: ScrollToHeroProps) {
  const lenis = useLenis();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    onNavigate?.();

    window.history.pushState(null, "", "/");

    if (lenis) {
      lenis.scrollTo(0, { offset: 0, duration: 1.2 });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <a href="/" onClick={onClick} className={className} aria-label="Ir al inicio">
      {children}
    </a>
  );
}

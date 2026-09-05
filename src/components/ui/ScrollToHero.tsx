"use client";

import { useLenis } from "lenis/react";
import type { MouseEvent, ReactNode } from "react";

type ScrollToHeroProps = {
  children: ReactNode;
  className?: string;
};

export function ScrollToHero({ children, className }: ScrollToHeroProps) {
  const lenis = useLenis();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const target = document.getElementById("inicio");

    if (lenis) {
      lenis.scrollTo(target ?? 0, { offset: 0, duration: 1.2 });
      return;
    }

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <a href="#inicio" onClick={onClick} className={className} aria-label="Ir al inicio">
      {children}
    </a>
  );
}

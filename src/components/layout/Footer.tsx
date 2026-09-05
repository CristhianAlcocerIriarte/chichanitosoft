"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ScrollToHero } from "@/components/ui/ScrollToHero";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-signal/30 bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal to-transparent"
      />
      <Reveal y={20}>
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <ScrollToHero className="font-display text-2xl font-bold tracking-tight text-paper transition-opacity hover:opacity-90">
              Chichanito<span className="text-signal">Soft</span>
            </ScrollToHero>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-paper/60">
              Desarrollo de software a medida con frontend de alto impacto y
              ingeniería confiable.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-paper/55 sm:items-end">
            <a
              href="mailto:chichanitosoft@gmail.com"
              className="transition-colors duration-300 hover:text-signal"
            >
              chichanitosoft@gmail.com
            </a>
            <p className="font-mono text-xs tracking-wide text-signal/70">
              © {year} ChichanitoSoft. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}

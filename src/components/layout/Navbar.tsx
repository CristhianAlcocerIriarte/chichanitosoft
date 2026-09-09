"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useState, type MouseEvent } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ScrollToHero } from "@/components/ui/ScrollToHero";
import { scrollToSection } from "@/lib/scrollToSection";

const links = [
  { href: "#beneficios", label: "Beneficios" },
  { href: "#enfoque", label: "Enfoque" },
  { href: "#servicios", label: "Servicios" },
  { href: "#planes", label: "Planes" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 24);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  function onNavClick(e: MouseEvent<HTMLElement>, href: string) {
    e.preventDefault();
    e.stopPropagation();

    const wasOpen = open;
    document.body.style.overflow = "";
    setOpen(false);

    const go = () => scrollToSection(href, lenis);

    if (wasOpen) {
      // Wait until the mobile panel closes and body scroll unlocks
      window.setTimeout(go, 160);
      return;
    }

    requestAnimationFrame(go);
  }

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color,box-shadow] duration-500 ${
        open
          ? "border-b border-line bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          : scrolled
            ? "border-b border-line bg-paper/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent shadow-none"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
        <motion.div
          whileHover={reduce ? undefined : { scale: 1.02 }}
          transition={{ type: "spring", stiffness: 360, damping: 22 }}
        >
          <ScrollToHero
            onNavigate={closeMenu}
            className="font-display text-[1.05rem] font-bold tracking-tight text-ink sm:text-lg"
          >
            Chichanito<span className="text-signal">Soft</span>
          </ScrollToHero>
        </motion.div>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.06, duration: 0.5 }}
              onMouseEnter={() => setHovered(link.href)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => onNavClick(e, link.href)}
              className="relative text-sm font-medium text-muted transition-colors duration-300 hover:text-ink"
            >
              {link.label}
              <motion.span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px bg-signal"
                initial={false}
                animate={{
                  width: hovered === link.href ? "100%" : "0%",
                }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MagneticButton
            href="#contacto"
            onClick={(e) => onNavClick(e, "#contacto")}
            className="group relative hidden items-center overflow-hidden bg-signal px-4 py-2.5 text-sm font-medium text-white md:inline-flex"
          >
            <span className="relative z-10">Agenda una visita gratis</span>
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-signal-deep transition-transform duration-400 group-hover:scale-x-100"
            />
          </MagneticButton>

          <button
            type="button"
            className="relative z-[60] flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Cerrar" : "Menú"}</span>
            <span className="relative block h-3.5 w-5">
              <motion.span
                className="absolute left-0 top-0 block h-0.5 w-full bg-ink"
                animate={open ? { top: "0.4rem", rotate: 45 } : { top: 0, rotate: 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="absolute left-0 top-[0.4rem] block h-0.5 w-full bg-ink"
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-[0.8rem] block h-0.5 w-full bg-ink"
                animate={
                  open
                    ? { top: "0.4rem", rotate: -45 }
                    : { top: "0.8rem", rotate: 0 }
                }
                transition={{ duration: 0.25 }}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              className="fixed inset-0 z-40 bg-ink/25 md:hidden"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />
            <motion.div
              id="menu-movil"
              className="absolute inset-x-0 top-full z-50 border-b border-line bg-white shadow-[0_16px_40px_rgba(0,0,0,0.1)] md:hidden"
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav
                aria-label="Menú móvil"
                className="mx-auto flex max-w-6xl flex-col px-5 pb-5 pt-2 sm:px-8"
              >
                <ul className="flex flex-col">
                  {links.map((link, index) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => onNavClick(e, link.href)}
                        className="flex items-center justify-between border-b border-line py-3.5 text-base font-semibold text-ink"
                      >
                        <span className="font-display tracking-tight">
                          {link.label}
                        </span>
                        <span className="font-mono text-xs text-signal">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contacto"
                  onClick={(e) => onNavClick(e, "#contacto")}
                  className="mt-4 inline-flex items-center justify-center bg-signal px-5 py-3 text-sm font-semibold text-white"
                >
                  Agenda una visita gratis
                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

"use client";

import { motion, useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ScrollToHero } from "@/components/ui/ScrollToHero";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#enfoque", label: "Enfoque" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 24);
  });

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color,box-shadow] duration-500 ${
        scrolled
          ? "border-b border-line bg-paper/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent shadow-none"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
        <motion.div
          whileHover={reduce ? undefined : { scale: 1.02 }}
          transition={{ type: "spring", stiffness: 360, damping: 22 }}
        >
          <ScrollToHero className="font-display text-[1.05rem] font-bold tracking-tight text-ink sm:text-lg">
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

        <MagneticButton
          href="#contacto"
          className="group relative inline-flex items-center overflow-hidden bg-signal px-4 py-2.5 text-sm font-medium text-white"
        >
          <span className="relative z-10">Reserva una visita gratis</span>
          <span
            aria-hidden
            className="absolute inset-0 origin-left scale-x-0 bg-signal-deep transition-transform duration-400 group-hover:scale-x-100"
          />
        </MagneticButton>
      </div>
    </motion.header>
  );
}

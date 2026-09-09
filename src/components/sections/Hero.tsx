"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLenis } from "lenis/react";
import { useRef, type MouseEvent } from "react";
import { HeroCanvas } from "@/components/ui/HeroCanvas";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { scrollToSection } from "@/lib/scrollToSection";

const ease = [0.22, 1, 0.36, 1] as const;

const titleLines = [
  { text: "Sistemas web a medida,", className: "text-ink" },
  { text: "diseñados para escalar", className: "text-ink" },
  { text: "tu negocio sin límites.", className: "text-signal" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(35);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 22, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 22, mass: 0.4 });
  const gradient = useMotionTemplate`radial-gradient(48% 42% at ${smoothX}% ${smoothY}%, rgba(15, 157, 138, 0.48), rgba(15, 157, 138, 0.18) 38%, transparent 72%)`;

  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  function onMouseMove(e: MouseEvent<HTMLElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const yPos = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(yPos);
  }

  return (
    <section
      id="inicio"
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative min-h-[100svh] overflow-hidden mesh-hero"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={reduce ? undefined : { backgroundImage: gradient }}
      />
      <motion.div
        style={reduce ? undefined : { y: gridY }}
        className="absolute inset-0 z-[1] grid-overlay"
        aria-hidden
      />
      <div className="noise z-[1]" aria-hidden />
      <HeroCanvas />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-[22%] z-[1] hidden h-28 w-px bg-gradient-to-b from-transparent via-signal/50 to-transparent lg:block"
        initial={reduce ? false : { scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.9, ease }}
      />

      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-10 pt-20 sm:px-8 sm:pb-16 sm:pt-24 lg:pb-20 lg:pt-28"
      >
        <div className="max-w-4xl">
          <h1 className="font-display mt-3 text-[clamp(1.7rem,7.5vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.04em] text-balance sm:mt-4">
            {titleLines.map((line, lineIndex) => (
              <span
                key={line.text}
                className={`block overflow-hidden pb-[0.08em] sm:pb-[0.1em] ${line.className}`}
              >
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "115%", rotate: 1.5 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{
                    duration: 0.95,
                    delay: 0.22 + lineIndex * 0.1,
                    ease,
                  }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.span
            aria-hidden
            className="mt-4 block h-px max-w-[10rem] origin-left bg-ink/15 sm:mt-5 sm:max-w-[12rem]"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease }}
            className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft/80 sm:mt-5 sm:text-lg"
          >
            Desarrollo web de precisión: arquitectura sólida, rendimiento óptimo
            y validación rigurosa en cada despliegue.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.7, ease }}
            className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3"
          >
            <a
              href="#contacto"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#contacto", lenis);
              }}
              className="group relative inline-flex items-center justify-center overflow-hidden bg-signal px-5 py-3 text-sm font-semibold text-white animate-cta-glow sm:px-6 sm:py-3.5"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
              >
                <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent animate-button-shine" />
              </span>
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-px">
                Contáctanos
              </span>
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-signal-deep transition-transform duration-400 group-hover:scale-x-100"
              />
            </a>
            <MagneticButton
              href="#planes"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#planes", lenis);
              }}
              className="group inline-flex items-center justify-center gap-2 border border-signal/30 bg-white/50 px-5 py-3 text-sm font-semibold text-ink backdrop-blur-sm transition-colors duration-300 hover:border-signal hover:bg-signal/10 sm:px-6 sm:py-3.5"
            >
              Ver planes
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          className="pointer-events-none absolute bottom-8 right-5 hidden font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted lg:block"
          aria-hidden
        >
          <motion.span
            animate={reduce ? undefined : { y: [0, 4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            scroll
          </motion.span>
          <span className="mt-2 block h-10 w-px bg-gradient-to-b from-signal to-transparent animate-pulse-line" />
        </motion.div>
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-paper to-transparent"
      />
    </section>
  );
}

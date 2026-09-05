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
import { useRef, type MouseEvent } from "react";
import { HeroCanvas } from "@/components/ui/HeroCanvas";
import { MagneticButton } from "@/components/ui/MagneticButton";

const ease = [0.22, 1, 0.36, 1] as const;

const titleLines = [
  { text: "Chichanito", className: "text-ink" },
  { text: "Soft", className: "text-signal" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
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
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:justify-center lg:pb-24 lg:pt-32"
      >
        <div className="max-w-4xl">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="flex items-center gap-3"
          >
            <motion.span
              aria-hidden
              className="h-px w-8 bg-signal"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              style={{ transformOrigin: "left" }}
            />
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-signal-deep sm:text-xs">
              Software a medida
            </p>
          </motion.div>

          <h1 className="font-display mt-5 text-[clamp(2.75rem,11vw,6.75rem)] font-bold leading-[0.92] tracking-[-0.04em]">
            {titleLines.map((line, lineIndex) => (
              <span
                key={line.text}
                className={`block overflow-hidden ${line.className}`}
              >
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "115%", rotate: 2 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{
                    duration: 0.95,
                    delay: 0.22 + lineIndex * 0.12,
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
            className="mt-6 block h-px max-w-[12rem] origin-left bg-ink/15"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft/80 sm:text-xl"
          >
            Diseñamos e implementamos productos digitales precisos: interfaces
            memorables, backends sólidos y experiencia que convierte.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.7, ease }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <MagneticButton
              href="#contacto"
              className="group relative inline-flex items-center justify-center overflow-hidden bg-signal px-6 py-3.5 text-sm font-semibold text-white"
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-px">
                Reserva una visita gratis
              </span>
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-signal-deep transition-transform duration-400 group-hover:scale-x-100"
              />
            </MagneticButton>
            <MagneticButton
              href="#servicios"
              className="group inline-flex items-center justify-center gap-2 border border-signal/30 bg-white/50 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur-sm transition-colors duration-300 hover:border-signal hover:bg-signal/10"
            >
              Ver capacidades
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

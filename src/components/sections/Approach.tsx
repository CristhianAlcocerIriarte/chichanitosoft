"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { DrawLine } from "@/components/ui/DrawLine";

const steps = [
  {
    title: "Descubrimiento",
    text: "Entendemos el negocio, los usuarios y las restricciones reales antes de escribir una línea.",
  },
  {
    title: "Diseño & prototipo",
    text: "Definimos flujos, tipografía, motion y arquitectura visual que anticipan el producto final.",
  },
  {
    title: "Construcción",
    text: "Entregamos en ciclos cortos con código limpio, tests donde importan y despliegues confiables.",
  },
  {
    title: "Lanzamiento & cuidado",
    text: "Medimos, afinamos performance y acompañamos la evolución del producto.",
  },
];

export function Approach() {
  const reduce = useReducedMotion();

  return (
    <section
      id="enfoque"
      className="relative overflow-hidden border-y border-signal/20 bg-mist py-24 sm:py-32"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-signal/20 blur-3xl"
        animate={reduce ? undefined : { x: [0, 24, 0], y: [0, -16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-signal/18 blur-3xl"
        animate={reduce ? undefined : { x: [0, -20, 0], y: [0, 18, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal blur>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-signal-deep">
            Enfoque
          </p>
          <TextReveal
            as="h2"
            text="Del brief a producción sin fricción"
            className="font-display mt-4 max-w-xl text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl"
            delay={0.08}
          />
          <DrawLine className="mt-6 max-w-[7rem]" />
        </Reveal>

        <ol className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.1} y={32} blur>
              <motion.li
                className="group relative"
                whileHover={reduce ? undefined : { y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <motion.span
                  className="font-display inline-block text-5xl font-bold leading-none tracking-tighter text-signal/25 transition-colors duration-300 group-hover:text-signal/45"
                  initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.span>
                <h3 className="font-display mt-4 text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-signal-deep">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[0.95rem]">
                  {step.text}
                </p>
                {index < steps.length - 1 && (
                  <svg
                    aria-hidden
                    className="absolute -right-6 top-8 hidden h-6 w-10 text-signal/50 lg:block"
                    viewBox="0 0 40 24"
                    fill="none"
                  >
                    <path
                      d="M1 12h30m0 0-6-6m6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="animate-dash"
                    />
                  </svg>
                )}
              </motion.li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

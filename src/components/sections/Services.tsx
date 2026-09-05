"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { DrawLine } from "@/components/ui/DrawLine";

const services = [
  {
    code: "01",
    title: "Productos web a medida",
    description:
      "Aplicaciones web de alto rendimiento, arquitecturas claras y UI que refleja la identidad de tu marca sin plantillas genéricas.",
  },
  {
    code: "02",
    title: "Interfaces & experiencia",
    description:
      "Motion intencional, microinteracciones y sistemas de diseño coherentes. Cada transición refuerza jerarquía y confianza.",
  },
  {
    code: "03",
    title: "APIs & backends",
    description:
      "Servicios escalables, autenticación segura, integraciones y datos listos para crecer con tu operación.",
  },
  {
    code: "04",
    title: "Optimización & evolución",
    description:
      "Auditorías de performance, refactorización frontend y mejora continua de productos ya en producción.",
  },
];

export function Services() {
  const reduce = useReducedMotion();

  return (
    <section id="servicios" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-24 h-80 w-80 rounded-full bg-signal/8 blur-3xl"
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal blur>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-signal-deep">
            Servicios
          </p>
          <TextReveal
            as="h2"
            text="Ingeniería digital con intención estética"
            className="font-display mt-4 max-w-2xl text-4xl font-bold tracking-[-0.03em] text-ink text-balance sm:text-5xl"
            delay={0.08}
          />
          <DrawLine className="mt-6 max-w-[7rem]" />
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Construimos software que se siente premium: rápido, claro y
            memorable desde el primer scroll.
          </p>
        </Reveal>

        <ul className="mt-16 divide-y divide-line border-y border-line">
          {services.map((service, index) => (
            <Reveal key={service.code} delay={index * 0.08} y={24}>
              <li className="group relative">
                <motion.a
                  href="#contacto"
                  className="relative grid gap-4 overflow-hidden py-8 sm:grid-cols-[5rem_1fr_1.2fr_auto] sm:items-baseline sm:gap-8 sm:py-10"
                  whileHover={reduce ? undefined : { x: 8 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                >
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 bg-signal/[0.07] opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                  />
                  <motion.span
                    className="font-mono text-sm font-medium text-signal"
                    whileHover={reduce ? undefined : { scale: 1.08 }}
                  >
                    {service.code}
                  </motion.span>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-signal-deep sm:text-[1.7rem]">
                    {service.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted transition-colors duration-300 group-hover:text-ink-soft">
                    {service.description}
                  </p>
                  <span
                    aria-hidden
                    className="hidden translate-x-[-6px] text-signal opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:inline"
                  >
                    →
                  </span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100"
                  />
                </motion.a>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

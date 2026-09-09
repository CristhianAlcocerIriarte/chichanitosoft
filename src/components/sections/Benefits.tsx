"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Benefit = {
  code: string;
  title: string;
  text: string;
  icon: ReactNode;
};

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const benefits: Benefit[] = [
  {
    code: "01",
    title: "Mándalo desde tu PC o tu celular",
    text: "Administra productos, pedidos y contenido desde cualquier pantalla, sin depender de un técnico.",
    icon: (
      <IconFrame>
        <rect x="8" y="14" width="28" height="20" rx="1.5" />
        <path d="M16 40h12" />
        <path d="M22 34v6" />
        <rect x="40" y="20" width="14" height="24" rx="2" />
        <path d="M44 40h6" />
      </IconFrame>
    ),
  },
  {
    code: "02",
    title: "Tu negocio siempre disponible",
    text: "Atiende consultas y pedidos las 24 horas. Tus clientes te encuentran cuando te necesitan.",
    icon: (
      <IconFrame>
        <circle cx="32" cy="32" r="18" />
        <path d="M32 18v14l10 6" />
        <path d="M18 10h6M40 10h6" />
      </IconFrame>
    ),
  },
  {
    code: "03",
    title: "Más claridad, más conversión",
    text: "Un proceso simple baja la fricción y sube las chances de cerrar. La web trabaja por ti.",
    icon: (
      <IconFrame>
        <path d="M12 46V30l10-8 10 12 10-16 10 8v20" />
        <path d="M12 46h40" />
        <circle cx="42" cy="18" r="3" />
      </IconFrame>
    ),
  },
  {
    code: "04",
    title: "Menos trabajo manual",
    text: "Automatiza formularios, agendamiento y catálogos. Tu equipo gana tiempo real.",
    icon: (
      <IconFrame>
        <path d="M20 18h24v28H20z" />
        <path d="M26 26h12M26 34h12M26 42h8" />
        <path d="M40 14l6 6-6 6" />
      </IconFrame>
    ),
  },
  {
    code: "05",
    title: "Orden y control en un solo lugar",
    text: "Datos centralizados: menos WhatsApps perdidos y decisiones con información real.",
    icon: (
      <IconFrame>
        <ellipse cx="32" cy="18" rx="16" ry="6" />
        <path d="M16 18v10c0 3.3 7.2 6 16 6s16-2.7 16-6V18" />
        <path d="M16 28v10c0 3.3 7.2 6 16 6s16-2.7 16-6V28" />
      </IconFrame>
    ),
  },
  {
    code: "06",
    title: "Creces sin reinventar todo",
    text: "Empiezas con lo esencial y amplías módulos cuando el negocio lo pide.",
    icon: (
      <IconFrame>
        <path d="M14 46V30h10v16" />
        <path d="M28 46V22h10v24" />
        <path d="M42 46V14h10v32" />
        <path d="M12 46h42" />
      </IconFrame>
    ),
  },
  {
    code: "07",
    title: "Imagen que genera confianza",
    text: "Una presencia digital bien hecha comunica seriedad desde el primer vistazo.",
    icon: (
      <IconFrame>
        <path d="M32 12l14 6v12c0 10-6 16-14 20-8-4-14-10-14-20V18l14-6z" />
        <path d="M24 32l5 5 11-12" />
      </IconFrame>
    ),
  },
];

function getVisibleCount() {
  if (typeof window === "undefined") return 1;
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

export function Benefits() {
  const reduce = useReducedMotion();
  const [start, setStart] = useState(0);
  const [direction, setDirection] = useState(1);
  const [visible, setVisible] = useState(1);
  const [paused, setPaused] = useState(false);

  const total = benefits.length;

  useEffect(() => {
    function sync() {
      setVisible(getVisibleCount());
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setStart((current) => wrapIndex(current + 1, total));
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduce, paused, total]);

  function next() {
    setDirection(1);
    setStart((current) => wrapIndex(current + 1, total));
  }

  function prev() {
    setDirection(-1);
    setStart((current) => wrapIndex(current - 1, total));
  }

  const visibleCards = Array.from({ length: visible }, (_, offset) => {
    const index = wrapIndex(start + offset, total);
    return { ...benefits[index], key: `${benefits[index].code}-${start}-${offset}` };
  });

  return (
    <section
      id="beneficios"
      className="relative overflow-hidden border-y border-signal/20 bg-ink py-14 text-paper sm:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-signal/25 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-signal/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeader
            tone="dark"
            label="Beneficios"
            title="Por qué te conviene un sistema web"
          >
            <p className="max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              Tu sistema. <span className="text-signal">Tu control.</span> Desde
              la computadora o el celular.
            </p>
          </SectionHeader>
        </Reveal>

        <div className="relative mt-10 sm:px-10">
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-2xl text-white/80 transition-colors hover:text-signal sm:flex"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-2xl text-white/80 transition-colors hover:text-signal sm:flex"
          >
            ›
          </button>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={start}
                custom={direction}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, x: direction > 0 ? 56 : -56 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, x: direction > 0 ? -56 : 56 }
                }
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {visibleCards.map((benefit) => (
                  <article
                    key={benefit.key}
                    className="group relative flex flex-col overflow-hidden border border-white/10 bg-signal/15 backdrop-blur-sm"
                  >
                    <div className="flex aspect-[5/4] items-center justify-center border-b border-white/10 bg-white/[0.05] px-8 py-7 text-paper sm:px-10 sm:py-8">
                      <span className="block h-full max-h-[7.5rem] w-full max-w-[7.5rem] transition-transform duration-300 group-hover:scale-105 sm:max-h-36 sm:max-w-36">
                        {benefit.icon}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-paper">
                        {benefit.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/60">
                        {benefit.text}
                      </p>
                      <span
                        aria-hidden
                        className="mt-5 block h-px origin-left scale-x-0 bg-signal transition-transform duration-400 group-hover:scale-x-100"
                      />
                    </div>
                  </article>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 sm:hidden">
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="flex h-10 w-10 items-center justify-center border border-white/20 text-xl text-paper"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Siguiente"
            className="flex h-10 w-10 items-center justify-center border border-white/20 text-xl text-paper"
          >
            ›
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2.5">
          {benefits.map((benefit, i) => (
            <button
              key={benefit.code}
              type="button"
              aria-label={`Ir al beneficio ${benefit.code}`}
              aria-current={i === start ? "true" : undefined}
              onClick={() => {
                setDirection(i > start ? 1 : -1);
                setStart(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === start
                  ? "w-6 bg-signal"
                  : "w-2 bg-white/30 hover:bg-white/55"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

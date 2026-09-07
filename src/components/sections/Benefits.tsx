"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const benefits = [
  {
    code: "01",
    title: "Mándalo desde tu PC o tu celular",
    text: "Desarrollamos sistemas web que tú administras: productos, pedidos, contenido y datos, desde la computadora o el celular, sin complicaciones. Tu negocio, bajo control, donde estés.",
  },
  {
    code: "02",
    title: "Tu negocio siempre disponible",
    text: "Un sistema web atiende consultas, pedidos e información las 24 horas. Tus clientes te encuentran cuando te necesitan, aunque tu equipo no esté en línea.",
  },
  {
    code: "03",
    title: "Más claridad, más conversión",
    text: "Cuando el proceso es simple (qué ofreces, cómo contactarte, cómo comprar), bajas la fricción y subes las chances de cerrar. La web trabaja por ti mientras duermes.",
  },
  {
    code: "04",
    title: "Menos trabajo manual",
    text: "Formularios, agendamiento, catálogos o paneles internos reducen llamadas repetitivas, planillas sueltas y errores. Tu equipo gana tiempo para lo que importa.",
  },
  {
    code: "05",
    title: "Orden y control en un solo lugar",
    text: "Datos de clientes, pedidos o inventario centralizados. Menos WhatsApps perdidos, menos Excel desactualizado y decisiones con información real.",
  },
  {
    code: "06",
    title: "Creces sin reinventar todo",
    text: "Empiezas con lo esencial y amplías módulos cuando el negocio lo pide: más usuarios, más funciones, más sedes. El sistema escala contigo.",
  },
  {
    code: "07",
    title: "Imagen profesional que genera confianza",
    text: "Una presencia digital bien hecha comunica seriedad. Antes de escribirte, el cliente ya percibe que trabajas con método y calidad.",
  },
];

export function Benefits() {
  const reduce = useReducedMotion();

  return (
    <section id="beneficios" className="relative overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,157,138,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,157,138,0.45) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 70% 40%, black 10%, transparent 70%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-signal/25 blur-3xl"
        animate={reduce ? undefined : { opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid max-w-6xl lg:grid-cols-[0.95fr_1.15fr]">
        <aside className="flex flex-col justify-between border-b border-white/10 px-5 py-12 sm:px-8 lg:sticky lg:top-0 lg:h-[100svh] lg:border-b-0 lg:border-r lg:border-white/10 lg:py-16">
          <div>
            <Reveal>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-signal">
                Beneficios
              </p>
              <h2 className="font-display mt-2 max-w-sm text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl">
                Por qué te conviene un sistema web
              </h2>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-white/65 sm:text-lg">
                No es solo “tener página”. Es una herramienta que ordena tu
                operación y acerca clientes.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="mt-10 lg:mt-0">
            <p className="font-display text-[clamp(1.5rem,3.2vw,2.15rem)] font-semibold leading-tight tracking-[-0.02em]">
              Tu sistema.{" "}
              <span className="text-signal">Tu control.</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55 sm:text-base">
              Administra productos, pedidos y contenido desde la computadora o
              el celular, sin depender de un técnico para cada cambio.
            </p>
            <span
              aria-hidden
              className="mt-6 block h-px w-16 bg-gradient-to-r from-signal to-transparent"
            />
          </Reveal>
        </aside>

        <div className="bg-paper px-5 py-12 text-ink sm:px-8 sm:py-14 lg:py-16">
          <ol className="space-y-0">
            {benefits.map((benefit, index) => (
              <Reveal key={benefit.code} delay={index * 0.06} y={32}>
                <li className="group relative grid gap-2 border-b border-line py-6 last:border-b-0 sm:grid-cols-[4.5rem_1fr] sm:gap-8 sm:py-7">
                  <motion.span
                    className="font-display text-4xl font-bold leading-none tracking-tighter text-signal/30 transition-colors duration-300 group-hover:text-signal/55 sm:text-5xl"
                    whileHover={reduce ? undefined : { scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {benefit.code}
                  </motion.span>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-signal-deep sm:text-2xl">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
                      {benefit.text}
                    </p>
                  </div>
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-signal"
                    initial={{ scaleX: 0 }}
                    whileInView={reduce ? undefined : { scaleX: [0, 1, 0] }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

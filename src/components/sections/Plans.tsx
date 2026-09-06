"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { DrawLine } from "@/components/ui/DrawLine";
type Currency = "USD" | "BOB";

type ExchangeRate = {
  rate: number;
  source: string;
  sourceUrl: string;
  date: string | null;
};

const plans = [
  {
    id: "basico",
    name: "Básico",
    priceUsd: 50,
    ideal:
      "Ideal para emprendedores, negocios pequeños y sistemas web básicos que inician en el mundo digital.",
    featured: false,
    features: [
      {
        label: "Tipo de sitio",
        text: "Landing page, sitio web corporativo/informativo o sistemas web básicos de hasta 5 páginas.",
      },
      {
        label: "Hosting",
        text: "Incluido (desplegado en nuestros servidores).",
      },
      {
        label: "Diseño",
        text: "Diseño responsivo (adaptado a celulares y tablets) basado en plantillas modernas.",
      },
      {
        label: "Mantenimiento",
        text: "Actualizaciones de seguridad anuales y soporte técnico por correo electrónico.",
      },
      {
        label: "SEO",
        text: "Optimización SEO on-page básica (metaetiquetas y velocidad inicial).",
      },
      {
        label: "Gestión",
        text: "Panel básico para que puedas administrar tu propio contenido.",
      },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceUsd: 150,
    ideal:
      "Ideal para negocios en crecimiento y tiendas online con gestión de pedidos o catálogos interactivos.",
    featured: true,
    features: [
      {
        label: "Tipo de sitio",
        text: "Tienda online (e-commerce para pedidos por transferencia/WhatsApp) o aplicación web interactiva de hasta 15 secciones.",
      },
      {
        label: "Hosting",
        text: "Incluido (alojamiento optimizado en nuestros servidores).",
      },
      {
        label: "Diseño",
        text: "Diseño UX/UI personalizado alineado a la identidad visual de tu marca.",
      },
      {
        label: "Funcionalidades",
        text: "Gestión de inventario, catálogo de productos y panel de administración avanzado.",
      },
      {
        label: "Mantenimiento",
        text: "Monitoreo constante, respaldos periódicos y soporte prioritario vía chat/WhatsApp.",
      },
      {
        label: "SEO y rendimiento",
        text: "Estrategia SEO intermedia, integración con Google Analytics y optimización de velocidad.",
      },
    ],
  },
  {
    id: "empresarial",
    name: "Empresarial",
    priceUsd: 200,
    ideal:
      "Ideal para empresas consolidadas, comercio electrónico avanzado y proyectos web complejos a medida.",
    featured: false,
    features: [
      {
        label: "Tipo de sitio",
        text: "Plataformas web avanzadas, portales de alta concurrencia o sistemas a medida sin límite de secciones.",
      },
      {
        label: "Hosting",
        text: "Hosting prioritario / dedicado incluido (infraestructura escalable de alta disponibilidad en nuestros servidores).",
      },
      {
        label: "Diseño",
        text: "Arquitectura web escalable con interfaz 100% personalizada y pruebas de usabilidad.",
      },
      {
        label: "Funcionalidades",
        text: "Integración de pasarelas de pago (locales e internacionales), conexión con APIs de terceros (ERP, CRM, software de contabilidad), bases de datos robustas y protocolos de seguridad avanzados (cifrado de datos).",
      },
      {
        label: "Mantenimiento",
        text: "Respaldos frecuentes, monitoreo de rendimiento 24/7 y un canal de soporte técnico prioritario.",
      },
      {
        label: "Optimización continua",
        text: "Auditorías técnicas periódicas y reportes de rendimiento analítico.",
      },
    ],
  },
];

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatBob(value: number) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 0,
  }).format(value);
}

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.span
      aria-hidden
      animate={{ y: open ? [0, 0] : [0, 4, 0] }}
      transition={
        open
          ? { duration: 0.2 }
          : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
      }
      className="relative inline-flex h-8 w-8 items-center justify-center border border-signal/30 text-signal"
    >
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <path
          d="M2 4.5L7 9.5L12 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </motion.svg>
    </motion.span>
  );
}

export function Plans() {
  const reduce = useReducedMotion();
  const [currency, setCurrency] = useState<Currency>("USD");
  const [exchange, setExchange] = useState<ExchangeRate | null>(null);
  const [rateStatus, setRateStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [openPlan, setOpenPlan] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRate() {
      try {
        const response = await fetch("/api/exchange-rate", {
          headers: { Accept: "application/json" },
        });
        const data = (await response.json()) as ExchangeRate & {
          error?: string;
        };

        if (!response.ok || !data.rate) {
          throw new Error(data.error || "Sin tipo de cambio");
        }

        if (!cancelled) {
          setExchange({
            rate: data.rate,
            source: data.source,
            sourceUrl: data.sourceUrl,
            date: data.date,
          });
          setRateStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setRateStatus("error");
          setCurrency("USD");
        }
      }
    }

    loadRate();
    return () => {
      cancelled = true;
    };
  }, []);

  function displayPrice(priceUsd: number) {
    if (currency === "BOB" && exchange) {
      return formatBob(Math.round(priceUsd * exchange.rate));
    }
    return formatUsd(priceUsd);
  }

  function displayPeriod() {
    return currency === "BOB" ? "BOB / año" : "USD / año";
  }

  function togglePlan(id: string) {
    setOpenPlan((current) => (current === id ? null : id));
  }

  return (
    <section id="planes" className="relative overflow-hidden border-b border-signal/20 bg-paper py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-signal/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-32 h-72 w-72 rounded-full bg-signal/10 blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal blur>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-signal-deep">
            Planes
          </p>
          <TextReveal
            as="h2"
            text="Elige el plan que impulsa tu negocio"
            className="font-display mt-4 max-w-2xl text-4xl font-bold tracking-[-0.03em] text-ink text-balance sm:text-5xl"
            delay={0.08}
          />
          <DrawLine className="mt-6 max-w-[7rem]" />
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Hosting incluido, diseño profesional y acompañamiento técnico.
            Reserva una visita gratis y te orientamos al plan correcto.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div
            role="group"
            aria-label="Seleccionar moneda"
            className="inline-flex border border-line bg-white/80 p-1"
          >
            {(["USD", "BOB"] as const).map((option) => {
              const disabled = option === "BOB" && rateStatus !== "ready";
              const active = currency === option;

              return (
                <button
                  key={option}
                  type="button"
                  disabled={disabled}
                  onClick={() => setCurrency(option)}
                  className={`px-4 py-2 text-sm font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                    active
                      ? "bg-signal text-white"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-5">
          {plans.map((plan, index) => {
            const isOpen = openPlan === plan.id;

            return (
              <Reveal key={plan.id} delay={index * 0.08} y={28} blur>
                <motion.article
                  whileHover={reduce ? undefined : { y: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className={`relative flex flex-col border p-6 sm:p-7 ${
                    plan.featured
                      ? "border-signal bg-signal/[0.06]"
                      : "border-line bg-white/70"
                  }`}
                >
                  {plan.featured && (
                    <span className="font-mono absolute right-6 top-6 text-[0.65rem] uppercase tracking-[0.2em] text-signal-deep">
                      Recomendado
                    </span>
                  )}

                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-signal-deep">
                    Plan {plan.name}
                  </p>

                  <div className="mt-5 flex items-end gap-1.5">
                    <motion.span
                      key={`${plan.id}-${currency}-${exchange?.rate ?? "usd"}`}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
                    >
                      {displayPrice(plan.priceUsd)}
                    </motion.span>
                    <span className="mb-1.5 text-sm text-muted">
                      {displayPeriod()}
                    </span>
                  </div>

                  {currency === "BOB" && exchange && (
                    <p className="mt-1 font-mono text-[0.7rem] text-muted">
                      Equiv. {formatUsd(plan.priceUsd)} · TC{" "}
                      {exchange.rate.toFixed(2)}
                    </p>
                  )}

                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {plan.ideal}
                  </p>

                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`plan-details-${plan.id}`}
                    onClick={() => togglePlan(plan.id)}
                    className="mt-6 flex w-full items-center justify-between border-t border-line pt-5 text-left transition-colors hover:text-signal"
                  >
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-signal-deep">
                      {isOpen ? "Ocultar detalle" : "Ver detalle del plan"}
                    </span>
                    <Chevron open={isOpen} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`plan-details-${plan.id}`}
                        key="details"
                        initial={
                          reduce
                            ? false
                            : { height: 0, opacity: 0 }
                        }
                        animate={{ height: "auto", opacity: 1 }}
                        exit={
                          reduce
                            ? undefined
                            : { height: 0, opacity: 0 }
                        }
                        transition={{
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-5 pb-2 pt-5">
                          {plan.features.map((feature, featureIndex) => (
                            <motion.li
                              key={feature.label}
                              initial={
                                reduce
                                  ? false
                                  : { opacity: 0, y: -10 }
                              }
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: 0.05 + featureIndex * 0.05,
                                duration: 0.35,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            >
                              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-signal">
                                {feature.label}
                              </p>
                              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                                {feature.text}
                              </p>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { DrawLine } from "@/components/ui/DrawLine";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CONTACT_LIMITS, sanitizeContactInput } from "@/lib/sanitize";

const CONTACT_EMAIL = "chichanitosoft@gmail.com";

const fieldClass =
  "mt-2 w-full border-b border-ink/20 bg-transparent py-2.5 text-ink outline-none transition-all duration-300 focus:border-signal focus:pl-1";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [focused, setFocused] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot anti-bot
    if (String(data.get("company") || "").trim()) {
      setStatus("sent");
      form.reset();
      window.setTimeout(() => setStatus("idle"), 5000);
      return;
    }

    const clean = sanitizeContactInput({
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: data.get("message"),
    });

    if (!clean) {
      setErrorMsg("Revisa los datos. Evita caracteres especiales o mensajes muy cortos.");
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 5000);
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: clean.name,
          email: clean.email,
          phone: clean.phone,
          message: clean.message,
          company: "",
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "No se pudo enviar");
      }

      setStatus("sent");
      form.reset();
      window.setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "No se pudo enviar. Intenta de nuevo.",
      );
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 5000);
    }
  }

  return (
    <section id="contacto" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-10 h-72 w-72 rounded-full bg-signal/10 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal blur>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-signal-deep">
            Contacto
          </p>
          <TextReveal
            as="h2"
            text="Cuéntanos qué quieres construir"
            className="font-display mt-4 text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl"
            delay={0.08}
          />
          <DrawLine className="mt-6 max-w-[7rem]" />
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Reserva una visita gratis. Respondemos con claridad: alcance,
            tiempos y el enfoque técnico que tu producto necesita.
          </p>

          <dl className="mt-10 space-y-5 font-mono text-sm">
            <motion.div
              whileHover={reduce ? undefined : { x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <dt className="text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-ink transition-colors hover:text-signal"
                >
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </motion.div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                Celular
              </dt>
              <dd className="mt-1">
                <a
                  href="https://wa.me/59179969931"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink transition-colors hover:text-signal"
                >
                  +591 79969931
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.12} y={36} blur>
          <motion.form
            onSubmit={onSubmit}
            noValidate
            autoComplete="on"
            className="relative border border-signal/20 bg-signal/[0.03] p-6 backdrop-blur-sm sm:p-8"
            whileHover={reduce ? undefined : { y: -2 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            {/* Honeypot oculto para bots */}
            <div
              className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
              aria-hidden
            >
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-signal"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-1">
                <span
                  className={`font-mono text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    focused === "name" ? "text-signal" : "text-muted"
                  }`}
                >
                  Nombre
                </span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  maxLength={CONTACT_LIMITS.name}
                  title="Solo letras, espacios y signos básicos"
                  className={fieldClass}
                  placeholder="Tu nombre"
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                />
              </label>
              <label className="block sm:col-span-1">
                <span
                  className={`font-mono text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    focused === "email" ? "text-signal" : "text-muted"
                  }`}
                >
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={CONTACT_LIMITS.email}
                  inputMode="email"
                  className={fieldClass}
                  placeholder="tu@empresa.com"
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </label>
              <label className="block sm:col-span-2">
                <span
                  className={`font-mono text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    focused === "phone" ? "text-signal" : "text-muted"
                  }`}
                >
                  Celular
                </span>
                <input
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  maxLength={CONTACT_LIMITS.phone}
                  inputMode="tel"
                  className={fieldClass}
                  placeholder="+591 70000000"
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused(null)}
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span
                className={`font-mono text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  focused === "message" ? "text-signal" : "text-muted"
                }`}
              >
                Proyecto
              </span>
              <textarea
                required
                name="message"
                rows={5}
                maxLength={CONTACT_LIMITS.message}
                minLength={10}
                className={fieldClass}
                placeholder="Objetivo, plazos y stack preferido si lo tienes..."
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
              />
            </label>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <MagneticButton
                type="submit"
                disabled={status === "sending"}
                className="group relative inline-flex items-center justify-center overflow-hidden bg-signal px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                <span className="relative z-10 pointer-events-none">
                  {status === "sending" ? "Enviando…" : "Enviar mensaje"}
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-signal-deep transition-transform duration-400 group-hover:scale-x-100"
                />
              </MagneticButton>

              <AnimatePresence mode="wait">
                {status === "sent" && (
                  <motion.p
                    key="sent"
                    initial={reduce ? false : { opacity: 0, y: 6, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-signal-deep"
                  >
                    Mensaje enviado, en breve nos comunicaremos.
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    key="error"
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-signal-deep"
                  >
                    {errorMsg || "No se pudo enviar. Intenta de nuevo."}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </Reveal>
      </div>
    </section>
  );
}

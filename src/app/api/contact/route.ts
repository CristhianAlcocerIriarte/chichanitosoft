import { NextResponse } from "next/server";
import { sanitizeContactInput } from "@/lib/sanitize";

const CONTACT_EMAIL = "chichanitosoft@gmail.com";
const SITE_ORIGIN = "https://chichanitosoft.vercel.app";
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

const hits = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

function mailtoFallback(clean: {
  name: string;
  email: string;
  phone: string;
  message: string;
}, extra?: Record<string, unknown>) {
  return NextResponse.json({
    ok: false,
    fallbackMailto: true,
    name: clean.name,
    email: clean.email,
    phone: clean.phone,
    message: clean.message,
    ...extra,
  });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "Tipo no permitido" }, { status: 415 });
    }

    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera un momento." },
        { status: 429 },
      );
    }

    const body = await request.json();

    if (typeof body?.company === "string" && body.company.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const clean = sanitizeContactInput(body);
    if (!clean) {
      return NextResponse.json(
        { error: "Datos inválidos. Revisa el formulario." },
        { status: 400 },
      );
    }

    const origin =
      request.headers.get("origin") ||
      request.headers.get("referer")?.replace(/\/$/, "") ||
      SITE_ORIGIN;

    // Preferencia: Web3Forms si hay access key (entrega real a Gmail)
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
    if (web3Key) {
      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3Key,
          subject: `Proyecto ChichanitoSoft — ${clean.name}`,
          from_name: "ChichanitoSoft Web",
          name: clean.name,
          email: clean.email,
          phone: clean.phone,
          message: clean.message,
        }),
      });

      const web3Result = (await web3Response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (web3Response.ok && web3Result?.success) {
        return NextResponse.json({ ok: true, provider: "web3forms" });
      }
    }

    // Fallback: FormSubmit
    const response = await fetch(
      `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: origin,
          Referer: `${origin}/`,
        },
        body: JSON.stringify({
          name: clean.name,
          email: clean.email,
          phone: clean.phone,
          message: clean.message,
          _subject: `Proyecto ChichanitoSoft — ${clean.name}`,
          _replyto: clean.email,
          _template: "table",
        }),
      },
    );

    const result = (await response.json().catch(() => null)) as {
      success?: string | boolean;
      message?: string;
    } | null;

    const success =
      result?.success === true ||
      result?.success === "true" ||
      String(result?.message || "")
        .toLowerCase()
        .includes("successfully");

    if (success) {
      return NextResponse.json({ ok: true, provider: "formsubmit" });
    }

    const needsActivation = String(result?.message || "")
      .toLowerCase()
      .includes("activation");

    // Nunca fingir éxito: si no llegó el email, usamos mailto
    return mailtoFallback(clean, {
      pendingActivation: needsActivation,
      error: needsActivation
        ? "Activa FormSubmit desde el correo enviado a chichanitosoft@gmail.com (revisa spam)."
        : result?.message || "No se pudo enviar automáticamente",
    });
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

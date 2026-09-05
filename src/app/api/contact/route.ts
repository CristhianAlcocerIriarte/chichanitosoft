import { NextResponse } from "next/server";
import { sanitizeContactInput } from "@/lib/sanitize";

const CONTACT_EMAIL = "chichanitosoft@gmail.com";
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

    // Honeypot: si viene lleno, fingimos éxito sin enviar
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

    const response = await fetch(
      `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: clean.name,
          email: clean.email,
          message: clean.message,
          _subject: `Proyecto ChichanitoSoft — ${clean.name}`,
          _replyto: clean.email,
          _template: "table",
          _captcha: "false",
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json({ error: "No se pudo enviar" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

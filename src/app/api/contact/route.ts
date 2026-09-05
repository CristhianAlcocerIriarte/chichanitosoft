import { NextResponse } from "next/server";
import { sanitizeContactInput } from "@/lib/sanitize";

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 8;

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

/** Valida y sanitiza. El envío real se hace en el cliente (FormSubmit/Web3Forms). */
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
      return NextResponse.json({ ok: true, honeypot: true });
    }

    const clean = sanitizeContactInput(body);
    if (!clean) {
      return NextResponse.json(
        { error: "Datos inválidos. Revisa el formulario." },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, data: clean });
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

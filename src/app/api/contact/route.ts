import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
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

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendWithGmail(clean: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<boolean> {
  const user = process.env.GMAIL_USER || CONTACT_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!pass) return false;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const safeName = escapeHtml(clean.name);
  const safeEmail = escapeHtml(clean.email);
  const safePhone = escapeHtml(clean.phone);
  const safeMessage = escapeHtml(clean.message).replaceAll("\n", "<br/>");

  await transporter.sendMail({
    from: `"ChichanitoSoft Web" <${user}>`,
    to: CONTACT_EMAIL,
    replyTo: clean.email,
    subject: `Proyecto ChichanitoSoft — ${clean.name}`,
    text: [
      `Nombre: ${clean.name}`,
      `Email: ${clean.email}`,
      `Celular: ${clean.phone}`,
      "",
      clean.message,
    ].join("\n"),
    html: `
      <h2>Nuevo contacto desde la web</h2>
      <p><strong>Nombre:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Celular:</strong> ${safePhone}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${safeMessage}</p>
    `,
  });

  return true;
}

async function sendWithWeb3Forms(clean: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<boolean> {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return false;

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Proyecto ChichanitoSoft — ${clean.name}`,
      from_name: "ChichanitoSoft Web",
      name: clean.name,
      email: clean.email,
      phone: clean.phone,
      message: clean.message,
    }),
  });

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
  } | null;

  return Boolean(response.ok && result?.success);
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

    // 1) Gmail SMTP (silencioso, sin abrir Outlook)
    try {
      if (await sendWithGmail(clean)) {
        return NextResponse.json({ ok: true, provider: "gmail" });
      }
    } catch {
      // Continúa con el siguiente proveedor
    }

    // 2) Web3Forms
    try {
      if (await sendWithWeb3Forms(clean)) {
        return NextResponse.json({ ok: true, provider: "web3forms" });
      }
    } catch {
      // Continúa
    }

    return NextResponse.json(
      {
        error:
          "El envío de correo aún no está configurado. Agrega GMAIL_APP_PASSWORD en Vercel.",
      },
      { status: 503 },
    );
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

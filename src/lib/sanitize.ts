const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HTML_TAGS = /<\/?[^>]+(>|$)/g;
const HEADER_INJECTION = /(content-type|bcc|cc|to|from|mime-version|multipart|%\d{0,2}):/gi;
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

export const CONTACT_LIMITS = {
  name: 80,
  email: 120,
  phone: 20,
  message: 2000,
} as const;

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

function stripUnsafe(value: string): string {
  return value
    .replace(CONTROL_CHARS, "")
    .replace(HTML_TAGS, "")
    .replace(HEADER_INJECTION, "")
    .replace(/[<>`"\\]/g, "")
    .replace(/\r\n|\r|\n/g, " ")
    .trim();
}

function stripPhone(value: string): string {
  return value
    .replace(CONTROL_CHARS, "")
    .replace(HTML_TAGS, "")
    .replace(/[^\d+\s().-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripMessage(value: string): string {
  return value
    .replace(CONTROL_CHARS, "")
    .replace(HTML_TAGS, "")
    .replace(HEADER_INJECTION, "")
    .replace(/[<>`]/g, "")
    .replace(/\r\n|\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizeContactInput(input: unknown): ContactPayload | null {
  if (!input || typeof input !== "object") return null;

  const raw = input as Record<string, unknown>;

  const name = stripUnsafe(String(raw.name ?? "")).slice(0, CONTACT_LIMITS.name);
  const email = stripUnsafe(String(raw.email ?? ""))
    .toLowerCase()
    .slice(0, CONTACT_LIMITS.email);
  const phone = stripPhone(String(raw.phone ?? "")).slice(0, CONTACT_LIMITS.phone);
  const message = stripMessage(String(raw.message ?? "")).slice(
    0,
    CONTACT_LIMITS.message,
  );

  if (name.length < 2) return null;
  if (!EMAIL_RE.test(email)) return null;
  if (!PHONE_RE.test(phone)) return null;
  if ((phone.match(/\d/g) || []).length < 7) return null;
  if (message.length < 10) return null;

  if (!/^[\p{L}\p{M}\s.'-]+$/u.test(name)) return null;

  return { name, email, phone, message };
}

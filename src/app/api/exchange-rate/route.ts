import { NextResponse } from "next/server";

export const revalidate = 3600; // BCB publica 1 vez por día hábil

type ExchangePayload = {
  rate: number;
  currency: "USD/BOB";
  source: string;
  sourceUrl: string;
  date: string | null;
  fetchedAt: string;
};

async function fetchFromBcbOfficial(): Promise<ExchangePayload | null> {
  const response = await fetch(
    "https://www.bcb.gob.bo/librerias/indicadores/otras/ultimo.php",
    {
      headers: {
        Accept: "text/html",
        "User-Agent": "ChichanitoSoft/1.0 (+https://chichanitosoft.vercel.app)",
      },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) return null;

  const html = await response.text();

  // Fila del dólar estadounidense en la tabla de cotizaciones del BCB
  const dollarMatch = html.match(
    /ESTADOS\s+UNIDOS[\s\S]{0,400}?USD[\s\S]{0,120}?(\d{1,3}(?:[.,]\d{2,5})?)/i,
  );

  if (!dollarMatch?.[1]) return null;

  const rate = Number(dollarMatch[1].replace(",", "."));
  if (!Number.isFinite(rate) || rate <= 0) return null;

  const dateMatch = html.match(
    /TABLA DE COTIZACIONES DEL\s+([0-9]{1,2}\s+de\s+[A-ZÁÉÍÓÚÑ]+\s+de\s+[0-9]{4})/i,
  );

  return {
    rate,
    currency: "USD/BOB",
    source: "Banco Central de Bolivia — Tipo de Cambio Oficial (TCO)",
    sourceUrl: "https://www.bcb.gob.bo/librerias/indicadores/otras/ultimo.php",
    date: dateMatch?.[1] ?? null,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchFromBcbMirror(): Promise<ExchangePayload | null> {
  const response = await fetch("https://apibcb.cucu.bo/api/v1/tc/oficial", {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    tc_oficial?: {
      valor?: number;
      compra?: number;
      base?: number;
      fecha?: string;
      fuente?: string;
    };
  };

  const rate =
    data.tc_oficial?.valor ??
    data.tc_oficial?.compra ??
    data.tc_oficial?.base;

  if (!rate || !Number.isFinite(rate) || rate <= 0) return null;

  return {
    rate,
    currency: "USD/BOB",
    source:
      data.tc_oficial?.fuente ||
      "Banco Central de Bolivia — Tipo de Cambio Oficial (TCO)",
    sourceUrl: "https://www.bcb.gob.bo/",
    date: data.tc_oficial?.fecha ?? null,
    fetchedAt: new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const primary = await fetchFromBcbOfficial().catch(() => null);
    const payload = primary ?? (await fetchFromBcbMirror().catch(() => null));

    if (!payload) {
      return NextResponse.json(
        { error: "No se pudo obtener el tipo de cambio del BCB" },
        { status: 502 },
      );
    }

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Error al consultar el tipo de cambio" },
      { status: 500 },
    );
  }
}

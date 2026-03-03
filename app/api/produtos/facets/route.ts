import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const docs = await db
    .collection("produtos")
    .find({ isActive: { $ne: false } }, { projection: { categorias: 1, tags: 1, tipo: 1, precoCents: 1, preco: 1 } })
    .toArray();

  const categorias = new Set<string>();
  const tags = new Set<string>();
  const tipos = new Set<string>();
  let minCents = Number.POSITIVE_INFINITY;
  let maxCents = 0;

  for (const p of docs as any[]) {
    if (Array.isArray(p.categorias)) for (const c of p.categorias) if (typeof c === "string" && c.trim()) categorias.add(c.trim());
    if (Array.isArray(p.tags)) for (const t of p.tags) if (typeof t === "string" && t.trim()) tags.add(t.trim());
    if (typeof p.tipo === "string") tipos.add(p.tipo);
    const cents = typeof p.precoCents === "number" ? p.precoCents : Math.trunc(Math.round((p.preco ?? 0) * 100));
    minCents = Math.min(minCents, cents);
    maxCents = Math.max(maxCents, cents);
  }

  if (minCents === Number.POSITIVE_INFINITY) minCents = 0;

  return NextResponse.json({
    categorias: Array.from(categorias).sort((a, b) => a.localeCompare(b)),
    tags: Array.from(tags).sort((a, b) => a.localeCompare(b)),
    tipos: Array.from(tipos).sort((a, b) => a.localeCompare(b)),
    min: Math.round((minCents / 100) * 100) / 100,
    max: Math.round((maxCents / 100) * 100) / 100,
  });
}

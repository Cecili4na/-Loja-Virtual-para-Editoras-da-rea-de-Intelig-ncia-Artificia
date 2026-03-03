import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import type { CheckoutQuoteRequest, CheckoutQuoteResponse, ProductType } from "@/lib/types";
import { ObjectId } from "mongodb";

function toRegion(cep?: string): "N" | "NE" | "CO" | "SE" | "S" | "UNK" {
  const digits = (cep ?? "").replace(/\D/g, "");
  if (digits.length < 1) return "UNK";
  const first = digits[0];
  if (first === "6") return "N";
  if (first === "5") return "NE";
  if (first === "7") return "CO";
  if (first === "0" || first === "1" || first === "2" || first === "3") return "SE";
  if (first === "8" || first === "9") return "S";
  return "UNK";
}

export async function POST(req: Request) {
  const body = (await req.json()) as CheckoutQuoteRequest;
  if (!body?.items || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Invalid items" }, { status: 400 });
  }
  if (body.deliveryMethod !== "entrega" && body.deliveryMethod !== "retirada") {
    return NextResponse.json({ error: "Invalid deliveryMethod" }, { status: 400 });
  }

  const productIds = body.items.map((i) => i.productId);
  const objectIds: ObjectId[] = [];
  for (const id of productIds) {
    try {
      objectIds.push(new ObjectId(id));
    } catch {
      return NextResponse.json({ error: `Invalid productId: ${id}` }, { status: 400 });
    }
  }

  const client = await clientPromise;
  const db = client.db();

  const products = await db
    .collection("produtos")
    .find({ _id: { $in: objectIds }, isActive: { $ne: false } }, { projection: { titulo: 1, tipo: 1, precoCents: 1, preco: 1, estoqueQty: 1 } })
    .toArray();

  const byId = new Map<string, any>();
  for (const p of products as any[]) byId.set(p._id.toString(), p);

  let subtotalCents = 0;
  let hasPhysical = false;

  for (const it of body.items) {
    const p = byId.get(it.productId);
    if (!p) return NextResponse.json({ error: `Product not found: ${it.productId}` }, { status: 404 });
    const qty = Math.max(1, Math.min(99, Math.trunc(Number(it.qty || 1))));
    const precoCents = typeof p.precoCents === "number" ? p.precoCents : Math.trunc(Math.round((p.preco ?? 0) * 100));
    const tipo = (p.tipo ?? "fisico") as ProductType;
    if (tipo === "fisico" || tipo === "kit") hasPhysical = true;
    subtotalCents += precoCents * qty;
  }

  let shippingCents = 0;
  if (body.deliveryMethod === "retirada") {
    shippingCents = 0;
  } else {
    if (!hasPhysical) {
      shippingCents = 0;
    } else {
      // Regras simples para cumprir requisito: frete automático.
      const region = toRegion(body.cep);
      const base = region === "NE" ? 1890 : region === "SE" ? 1690 : region === "S" ? 2190 : region === "N" ? 2590 : region === "CO" ? 2090 : 1990;
      shippingCents = subtotalCents >= 20000 ? 0 : base;
    }
  }

  const taxRate = Number(process.env.TAX_RATE ?? "0"); // ex: 0.05
  const taxCents = taxRate > 0 ? Math.trunc(Math.round(subtotalCents * taxRate)) : 0;
  const totalCents = subtotalCents + shippingCents + taxCents;

  const resp: CheckoutQuoteResponse = {
    currency: "BRL",
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents,
    hasPhysical,
  };

  return NextResponse.json(resp);
}

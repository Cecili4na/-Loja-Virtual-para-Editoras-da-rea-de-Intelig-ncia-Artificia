import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

type PedidoInput = {
  customer: { nome: string; email: string; telefone?: string };
  deliveryMethod: "entrega" | "retirada";
  address?: {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  items: Array<{ productId: string; qty: number }>;
};

export async function POST(req: Request) {
  const body = (await req.json()) as PedidoInput;

  if (!body?.customer?.nome || !body?.customer?.email || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (body.deliveryMethod !== "entrega" && body.deliveryMethod !== "retirada") {
    return NextResponse.json({ error: "Invalid deliveryMethod" }, { status: 400 });
  }

  const ids: ObjectId[] = [];
  for (const it of body.items) {
    try {
      ids.push(new ObjectId(it.productId));
    } catch {
      return NextResponse.json({ error: `Invalid productId: ${it.productId}` }, { status: 400 });
    }
  }

  const client = await clientPromise;
  const db = client.db();
  const produtos = await db
    .collection("produtos")
    .find({ _id: { $in: ids }, isActive: { $ne: false } }, { projection: { titulo: 1, tipo: 1, precoCents: 1, preco: 1, estoqueQty: 1, imagens: 1, imagem: 1 } })
    .toArray();

  const byId = new Map<string, any>();
  for (const p of produtos as any[]) byId.set(p._id.toString(), p);

  // Valida estoque (só físico/kit)
  for (const it of body.items) {
    const p = byId.get(it.productId);
    if (!p) return NextResponse.json({ error: `Product not found: ${it.productId}` }, { status: 404 });
    const qty = Math.max(1, Math.min(99, Math.trunc(Number(it.qty || 1))));
    const tipo = p.tipo ?? "fisico";
    if ((tipo === "fisico" || tipo === "kit") && typeof p.estoqueQty === "number") {
      if (p.estoqueQty < qty) {
        return NextResponse.json({ error: `Sem estoque para: ${p.titulo}` }, { status: 409 });
      }
    }
  }

  // Cria pedido (PENDENTE) e dá baixa no estoque físico/kit
  const now = new Date();
  const orderItems = body.items.map((it) => {
    const p = byId.get(it.productId);
    const qty = Math.max(1, Math.min(99, Math.trunc(Number(it.qty || 1))));
    const precoCents = typeof p.precoCents === "number" ? p.precoCents : Math.trunc(Math.round((p.preco ?? 0) * 100));
    const img = Array.isArray(p.imagens) && p.imagens.length ? p.imagens[0] : p.imagem ?? "/placeholder.jpg";
    return {
      productId: it.productId,
      titulo: p.titulo,
      tipo: p.tipo ?? "fisico",
      unitPriceCents: precoCents,
      qty,
      imagem: img,
    };
  });

  const insert = await db.collection("pedidos").insertOne({
    status: "PENDENTE",
    customer: body.customer,
    deliveryMethod: body.deliveryMethod,
    address: body.deliveryMethod === "entrega" ? body.address : null,
    items: orderItems,
    createdAt: now,
    updatedAt: now,
  });

  for (const it of body.items) {
    const p = byId.get(it.productId);
    const qty = Math.max(1, Math.min(99, Math.trunc(Number(it.qty || 1))));
    const tipo = p.tipo ?? "fisico";
    if (tipo === "fisico" || tipo === "kit") {
      await db.collection("produtos").updateOne({ _id: new ObjectId(it.productId) }, { $inc: { estoqueQty: -qty }, $set: { updatedAt: new Date() } });
    }
  }

  return NextResponse.json({ orderId: insert.insertedId.toString(), status: "PENDENTE" }, { status: 201 });
}

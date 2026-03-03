import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import type { ProductType } from "@/lib/types";

type ProdutoUpdate = {
  titulo?: string;
  autor?: string;
  descricao?: string;
  preco?: number;
  precoCents?: number;
  tipo?: ProductType | "digital";
  imagem?: string;
  imagens?: string[];
  categorias?: string[];
  tags?: string[];
  estoqueQty?: number | null;
  isActive?: boolean;
  components?: Array<{ productId: string; qty: number }>;
};

function normalizeStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean);
}

function toCents(input: { preco?: number; precoCents?: number }): number | undefined {
  if (typeof input.precoCents === "number" && Number.isFinite(input.precoCents)) {
    return Math.max(0, Math.trunc(input.precoCents));
  }
  if (typeof input.preco === "number" && Number.isFinite(input.preco)) {
    return Math.max(0, Math.trunc(Math.round(input.preco * 100)));
  }
  return undefined;
}

function normalizeTipo(t: ProdutoUpdate["tipo"]): ProductType | undefined {
  if (!t) return undefined;
  if (t === "digital") return "ebook";
  if (t === "fisico" || t === "ebook" || t === "kit") return t;
  return undefined;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db();

  let _id: ObjectId;
  try {
    _id = new ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const p: any = await db.collection("produtos").findOne({ _id });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const produto = {
    id: p._id.toString(),
    titulo: p.titulo,
    autor: p.autor,
    descricao: p.descricao ?? "",
    tipo: (p.tipo ?? "fisico") as ProductType,
    precoCents: typeof p.precoCents === "number" ? p.precoCents : Math.trunc(Math.round((p.preco ?? 0) * 100)),
    imagens: Array.isArray(p.imagens) && p.imagens.length ? p.imagens : [p.imagem ?? "/placeholder.jpg"],
    categorias: Array.isArray(p.categorias) ? p.categorias : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    estoqueQty: typeof p.estoqueQty === "number" ? p.estoqueQty : p.tipo === "fisico" ? 0 : null,
    isActive: p.isActive !== false,
    components: Array.isArray(p.components) ? p.components : undefined,
  };

  return NextResponse.json(produto);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = (await req.json()) as ProdutoUpdate;

  let _id: ObjectId;
  try {
    _id = new ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const update: any = { updatedAt: new Date() };

  if (typeof body.titulo === "string") update.titulo = body.titulo;
  if (typeof body.autor === "string") update.autor = body.autor;
  if (typeof body.descricao === "string") update.descricao = body.descricao;

  const tipo = normalizeTipo(body.tipo);
  if (tipo) update.tipo = tipo;

  const cents = toCents(body);
  if (typeof cents === "number") update.precoCents = cents;

  if (Array.isArray(body.imagens) || typeof body.imagem === "string") {
    const imgs = normalizeStringArray(body.imagens);
    update.imagens = imgs.length ? imgs : [typeof body.imagem === "string" ? body.imagem : "/placeholder.jpg"];
  }

  if (Array.isArray(body.categorias)) update.categorias = normalizeStringArray(body.categorias);
  if (Array.isArray(body.tags)) update.tags = normalizeStringArray(body.tags);

  if (typeof body.isActive === "boolean") update.isActive = body.isActive;

  if (typeof body.estoqueQty === "number" || body.estoqueQty === null) {
    update.estoqueQty = body.estoqueQty === null ? null : Math.max(0, Math.trunc(body.estoqueQty));
  }

  if (Array.isArray(body.components)) update.components = body.components;

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection("produtos").updateOne({ _id }, { $set: update });
  if (result.matchedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  let _id: ObjectId;
  try {
    _id = new ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection("produtos").deleteOne({ _id });
  if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

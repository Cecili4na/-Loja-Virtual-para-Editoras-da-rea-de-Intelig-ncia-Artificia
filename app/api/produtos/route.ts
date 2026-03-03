import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import type { ProductType } from "@/lib/types";

type ProdutoInput = {
  titulo: string;
  autor: string;
  descricao?: string;
  preco?: number; // legado
  precoCents?: number;
  tipo: ProductType | "digital";
  imagem?: string; // legado
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

function toCents(input: { preco?: number; precoCents?: number }): number {
  if (typeof input.precoCents === "number" && Number.isFinite(input.precoCents)) {
    return Math.max(0, Math.trunc(input.precoCents));
  }
  if (typeof input.preco === "number" && Number.isFinite(input.preco)) {
    return Math.max(0, Math.trunc(Math.round(input.preco * 100)));
  }
  return 0;
}

function normalizeTipo(t: ProdutoInput["tipo"]): ProductType {
  if (t === "digital") return "ebook";
  if (t === "fisico" || t === "ebook" || t === "kit") return t;
  return "fisico";
}

export async function GET(req: Request) {
  const client = await clientPromise;
  const db = client.db();

  const { searchParams } = new URL(req.url);
  const categoria = searchParams.get("categoria")?.trim() || "";
  const tag = searchParams.get("tag")?.trim() || "";
  const tipo = (searchParams.get("tipo")?.trim() || "") as ProductType | "";
  const q = searchParams.get("q")?.trim() || "";
  const min = searchParams.get("min") ? Number(searchParams.get("min")) : undefined;
  const max = searchParams.get("max") ? Number(searchParams.get("max")) : undefined;
  const sort = searchParams.get("sort")?.trim() || "recent";

  const filter: any = { isActive: { $ne: false } };
  if (categoria) filter.categorias = categoria;
  if (tag) filter.tags = tag;
  if (tipo) filter.tipo = tipo;
  if (Number.isFinite(min) || Number.isFinite(max)) {
    filter.precoCents = {};
    if (Number.isFinite(min)) filter.precoCents.$gte = Math.trunc((min as number) * 100);
    if (Number.isFinite(max)) filter.precoCents.$lte = Math.trunc((max as number) * 100);
  }
  if (q) {
    // Busca simples (regex) para manter compatibilidade sem índice text.
    filter.$or = [
      { titulo: { $regex: q, $options: "i" } },
      { autor: { $regex: q, $options: "i" } },
      { descricao: { $regex: q, $options: "i" } },
    ];
  }

  const sortSpec: any =
    sort === "price_asc"
      ? { precoCents: 1 }
      : sort === "price_desc"
        ? { precoCents: -1 }
        : { createdAt: -1 };

  const docs = await db
    .collection("produtos")
    .find(filter)
    .sort(sortSpec)
    .toArray();

  const produtos = docs.map((p: any) => ({
    id: p._id.toString(),
    titulo: p.titulo,
    autor: p.autor,
    descricao: p.descricao ?? "",
    tipo: (p.tipo ?? (p.tipo === "digital" ? "ebook" : "fisico")) as ProductType,
    precoCents: typeof p.precoCents === "number" ? p.precoCents : Math.trunc(Math.round((p.preco ?? 0) * 100)),
    imagens: Array.isArray(p.imagens) && p.imagens.length ? p.imagens : [p.imagem ?? "/placeholder.jpg"],
    categorias: Array.isArray(p.categorias) ? p.categorias : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    estoqueQty: typeof p.estoqueQty === "number" ? p.estoqueQty : p.tipo === "fisico" ? 0 : null,
  }));

  return NextResponse.json(produtos);
}

export async function POST(req: Request) {
  const body = (await req.json()) as ProdutoInput;

  if (!body?.titulo || !body?.autor || !body?.tipo) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const tipo = normalizeTipo(body.tipo);
  const precoCents = toCents(body);
  const imagens = normalizeStringArray(body.imagens);
  const categorias = normalizeStringArray(body.categorias);
  const tags = normalizeStringArray(body.tags);
  const estoqueQty =
    tipo === "fisico" || tipo === "kit"
      ? typeof body.estoqueQty === "number"
        ? Math.max(0, Math.trunc(body.estoqueQty))
        : 0
      : null;

  const now = new Date();

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection("produtos").insertOne({
    titulo: body.titulo,
    autor: body.autor,
    descricao: body.descricao ?? "",
    tipo,
    precoCents,
    imagens: imagens.length ? imagens : [body.imagem ?? "/placeholder.jpg"],
    categorias,
    tags,
    estoqueQty,
    isActive: body.isActive ?? true,
    components: Array.isArray(body.components) ? body.components : undefined,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ insertedId: result.insertedId.toString() }, { status: 201 });
}
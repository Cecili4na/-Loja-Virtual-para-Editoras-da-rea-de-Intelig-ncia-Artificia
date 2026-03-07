import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

type ProdutoInput = {
  titulo: string;
  autor: string;
  preco: number;
  tipo: "fisico" | "digital";
  imagem?: string;
};

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const docs = await db
    .collection("produtos")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const produtos = docs.map((p: any) => ({
    id: p._id.toString(),
    titulo: p.titulo,
    autor: p.autor,
    preco: p.preco,
    tipo: p.tipo,
    imagem: p.imagem ?? "/placeholder.jpg",
  }));

  return NextResponse.json(produtos);
}

export async function POST(req: Request) {
  const body = (await req.json()) as ProdutoInput;

  if (!body?.titulo || !body?.autor || typeof body?.preco !== "number" || !body?.tipo) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection("produtos").insertOne({
    ...body,
    imagem: body.imagem ?? "/placeholder.jpg",
    createdAt: new Date(),
  });

  return NextResponse.json({ insertedId: result.insertedId.toString() }, { status: 201 });
}
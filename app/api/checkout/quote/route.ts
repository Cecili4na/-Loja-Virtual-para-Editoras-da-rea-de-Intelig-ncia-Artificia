import { NextResponse } from "next/server";
import type { CheckoutQuoteRequest, CheckoutQuoteResponse } from "@/lib/types";

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
  try {
    const body = (await req.json()) as CheckoutQuoteRequest;
    
    if (!body?.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }
    
    if (body.deliveryMethod !== "entrega" && body.deliveryMethod !== "retirada") {
      return NextResponse.json({ error: "Invalid deliveryMethod" }, { status: 400 });
    }

    let subtotalCents = 0;
    let hasPhysical = false;

    for (const item of body.items) {
      const qty = Math.max(1, Math.min(99, Math.trunc(Number(item.quantidade || 1))));
      const precoCents = Math.trunc(Math.round((item.preco ?? 0) * 100));
      const tipo = item.tipo ?? "fisico";
      
      if (tipo === "fisico" || tipo === "kit") {
        hasPhysical = true;
      }
      
      subtotalCents += precoCents * qty;
    }

    let shippingCents = 0;
    
    if (body.deliveryMethod === "retirada") {
      shippingCents = 0;
    } else {
      if (!hasPhysical) {
        shippingCents = 0;
      } else {
        // Cálculo de frete baseado em região do CEP
        const region = toRegion(body.cep);
        const base = 
          region === "NE" ? 1890 : 
          region === "SE" ? 1690 : 
          region === "S" ? 2190 : 
          region === "N" ? 2590 : 
          region === "CO" ? 2090 : 
          1990;
        
        // Frete grátis para compras acima de R$ 200,00
        shippingCents = subtotalCents >= 20000 ? 0 : base;
      }
    }

    const taxRate = Number(process.env.TAX_RATE ?? "0");
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
  } catch (error) {
    console.error("Error calculating quote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

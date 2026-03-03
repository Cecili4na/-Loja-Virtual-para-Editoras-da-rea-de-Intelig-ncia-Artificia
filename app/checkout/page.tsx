"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/app/providers";
import type { CheckoutQuoteResponse } from "@/lib/types";

function money(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export default function CheckoutPage() {
  const cart = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<"entrega" | "retirada">("entrega");
  const [cep, setCep] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  const [quote, setQuote] = useState<CheckoutQuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const quotePayload = useMemo(() => {
    return {
      items: cart.items.map((i) => ({ productId: i.productId, qty: i.qty })),
      cep,
      deliveryMethod,
    };
  }, [cart.items, cep, deliveryMethod]);

  useEffect(() => {
    (async () => {
      if (cart.items.length === 0) {
        setQuote(null);
        return;
      }
      setQuoteLoading(true);
      setMsg(null);
      try {
        const res = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quotePayload),
        });
        if (!res.ok) {
          setQuote(null);
          return;
        }
        setQuote(await res.json());
      } finally {
        setQuoteLoading(false);
      }
    })();
  }, [quotePayload, cart.items.length]);

  const needsAddress = quote?.hasPhysical && deliveryMethod === "entrega";

  async function submitOrder() {
    if (cart.items.length === 0) return;
    setSubmitting(true);
    setMsg(null);
    try {
      const payload: any = {
        customer: { nome, email, telefone },
        deliveryMethod,
        items: cart.items.map((i) => ({ productId: i.productId, qty: i.qty })),
      };
      if (needsAddress) {
        payload.address = { cep, rua, numero, bairro, cidade, uf };
      }
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Falha ao criar pedido");
      cart.clear();
      setMsg(`Pedido criado: ${data.orderId} (status: ${data.status})`);
    } catch (e: any) {
      setMsg(e?.message ?? "Erro ao finalizar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ background: "#2c3e50", color: "white", padding: "1rem 2rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <nav style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <Link href="/">
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", cursor: "pointer" }}>COMPIA Editora</h1>
          </Link>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <Link href="/produtos" style={{ color: "white" }}>
              Produtos
            </Link>
            <Link href="/carrinho" style={{ color: "white" }}>
              Carrinho
            </Link>
          </div>
        </nav>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: 8 }}>Checkout</h2>
        <p style={{ color: "#666", marginTop: 0 }}>Checkout simples e responsivo + cálculo automático de frete/impostos.</p>

        {cart.items.length === 0 ? (
          <div style={{ background: "#f8f9fa", padding: "2rem", borderRadius: 12 }}>
            <p>Seu carrinho está vazio.</p>
            <Link href="/produtos" style={{ textDecoration: "underline" }}>
              Voltar para produtos
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
              <h3 style={{ marginTop: 0 }}>Dados do cliente</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
                <input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefone (opcional)" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
              </div>
            </section>

            <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
              <h3 style={{ marginTop: 0 }}>Entrega</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="radio" checked={deliveryMethod === "entrega"} onChange={() => setDeliveryMethod("entrega")} />
                  Entrega
                </label>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="radio" checked={deliveryMethod === "retirada"} onChange={() => setDeliveryMethod("retirada")} />
                  Retirada no local
                </label>
              </div>

              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                <input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="CEP" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
                {needsAddress ? (
                  <>
                    <input value={rua} onChange={(e) => setRua(e.target.value)} placeholder="Rua" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
                    <input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
                    <input value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Bairro" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
                    <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
                    <input value={uf} onChange={(e) => setUf(e.target.value)} placeholder="UF" style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
                  </>
                ) : (
                  <div style={{ color: "#666", alignSelf: "center" }}>{quote?.hasPhysical ? "Retirada selecionada (sem endereço)." : "Somente e-books (sem endereço)."}</div>
                )}
              </div>
            </section>

            <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
              <h3 style={{ marginTop: 0 }}>Resumo</h3>

              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span>
                  <strong>R$ {money(cart.subtotalCents)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Frete</span>
                  <strong>{quoteLoading ? "…" : `R$ ${money(quote?.shippingCents ?? 0)}`}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Impostos</span>
                  <strong>{quoteLoading ? "…" : `R$ ${money(quote?.taxCents ?? 0)}`}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, marginTop: 6 }}>
                  <span>Total</span>
                  <strong>{quoteLoading ? "…" : `R$ ${money(quote?.totalCents ?? cart.subtotalCents)}`}</strong>
                </div>
              </div>

              {msg ? <p style={{ marginTop: 12, color: msg.startsWith("Pedido criado") ? "#27ae60" : "crimson" }}>{msg}</p> : null}

              <button
                onClick={submitOrder}
                disabled={submitting || !nome || !email || (needsAddress && (!cep || !rua || !numero || !bairro || !cidade || !uf))}
                style={{ marginTop: 12, width: "100%", background: "#27ae60", color: "white", padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 800 }}
              >
                {submitting ? "Finalizando…" : "Finalizar (criar pedido pendente)"}
              </button>

              <p style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
                Observação: nesta fase do projeto, o pedido fica como <strong>PENDENTE</strong> (sem integração de pagamento).
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCart } from "@/app/providers";

function money(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export default function CarrinhoPage() {
  const cart = useCart();

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          background: "#2c3e50",
          color: "white",
          padding: "1rem 2rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <nav
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link href="/">
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", cursor: "pointer" }}>COMPIA Editora</h1>
          </Link>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <Link href="/produtos" style={{ color: "white" }}>
              Produtos
            </Link>
            <Link href="/carrinho" style={{ color: "white", fontWeight: "bold" }}>
              Carrinho ({cart.totalItems})
            </Link>
            <Link href="/admin/produtos" style={{ color: "white" }}>
              Admin
            </Link>
          </div>
        </nav>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Carrinho de Compras</h2>

        {cart.items.length === 0 ? (
          <div style={{ background: "#f8f9fa", padding: "3rem", borderRadius: 12, textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", color: "#666" }}>Seu carrinho está vazio</p>
            <Link
              href="/produtos"
              style={{ display: "inline-block", marginTop: "1rem", background: "#3498db", color: "white", padding: "0.75rem 1.5rem", borderRadius: 10, fontWeight: "bold" }}
            >
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
              {cart.items.map((it) => (
                <div
                  key={it.productId}
                  style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 12, padding: 12, borderBottom: "1px solid #f0f0f0", alignItems: "center" }}
                >
                  <div style={{ width: 72, height: 72, background: "#f0f0f0", borderRadius: 10, overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.imagem ?? "/placeholder.jpg"} alt={it.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <div>
                    <div style={{ fontWeight: 700 }}>{it.titulo}</div>
                    <div style={{ color: "#666", fontSize: 13 }}>{it.tipo === "ebook" ? "E-book" : it.tipo === "kit" ? "Kit" : "Físico"}</div>
                    <div style={{ marginTop: 6, display: "flex", gap: 10, alignItems: "center" }}>
                      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: "#666" }}>Qtd</span>
                        <input
                          value={String(it.qty)}
                          inputMode="numeric"
                          onChange={(e) => cart.setQty(it.productId, Number(e.target.value || 1))}
                          style={{ width: 70, padding: 8, borderRadius: 10, border: "1px solid #ddd" }}
                        />
                      </label>
                      <button
                        onClick={() => cart.removeItem(it.productId)}
                        style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
                      >
                        Remover
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800 }}>R$ {money(it.unitPriceCents * it.qty)}</div>
                    <div style={{ color: "#666", fontSize: 13 }}>R$ {money(it.unitPriceCents)} / un.</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <button onClick={cart.clear} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}>
                Limpar carrinho
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 18 }}>
                  Subtotal: <strong>R$ {money(cart.subtotalCents)}</strong>
                </div>
                <Link href="/checkout" style={{ background: "#27ae60", color: "white", padding: "12px 16px", borderRadius: 12, fontWeight: 800 }}>
                  Ir para checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

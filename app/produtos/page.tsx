"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/app/providers";
import type { ProductType } from "@/lib/types";

type Produto = {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  tipo: ProductType;
  precoCents: number;
  imagens: string[];
  categorias: string[];
  tags: string[];
  estoqueQty: number | null;
};

function money(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export default function ProdutosPage() {
  const cart = useCart();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const [facets, setFacets] = useState<{ categorias: string[]; tags: string[]; tipos: string[] } | null>(null);

  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tag, setTag] = useState("");
  const [tipo, setTipo] = useState<"" | ProductType>("");
  const [sort, setSort] = useState("recent");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (categoria) sp.set("categoria", categoria);
    if (tag) sp.set("tag", tag);
    if (tipo) sp.set("tipo", tipo);
    if (sort) sp.set("sort", sort);
    if (min) sp.set("min", min);
    if (max) sp.set("max", max);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  }, [q, categoria, tag, tipo, sort, min, max]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/produtos/facets", { cache: "no-store" });
      if (res.ok) setFacets(await res.json());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/produtos${queryString}`, { cache: "no-store" });
      const data = res.ok ? await res.json() : [];
      setProdutos(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, [queryString]);

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
            <Link href="/produtos" style={{ color: "white", fontWeight: "bold" }}>
              Produtos
            </Link>
            <Link href="/carrinho" style={{ color: "white" }}>
              Carrinho ({cart.totalItems})
            </Link>
            <Link href="/admin/produtos" style={{ color: "white" }}>
              Admin
            </Link>
          </div>
        </nav>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: "2rem", marginBottom: 6 }}>Catálogo de Produtos</h2>
            <p style={{ color: "#666", marginTop: 0 }}>Filtros por categoria, tag, tipo e preço.</p>
          </div>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            padding: 12,
            border: "1px solid #eee",
            borderRadius: 12,
            background: "#fafafa",
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título/autor/descrição"
            style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
          />

          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}>
            <option value="">Todas as categorias</option>
            {(facets?.categorias ?? []).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={tag} onChange={(e) => setTag(e.target.value)} style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}>
            <option value="">Todas as tags</option>
            {(facets?.tags ?? []).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select value={tipo} onChange={(e) => setTipo(e.target.value as any)} style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}>
            <option value="">Todos os tipos</option>
            <option value="fisico">Físico</option>
            <option value="ebook">E-book</option>
            <option value="kit">Kit</option>
          </select>

          <input value={min} onChange={(e) => setMin(e.target.value)} placeholder="Preço mín (ex: 20)" inputMode="decimal" style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }} />
          <input value={max} onChange={(e) => setMax(e.target.value)} placeholder="Preço máx (ex: 200)" inputMode="decimal" style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }} />

          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}>
            <option value="recent">Mais recentes</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
          </select>

          <button
            onClick={() => {
              setQ("");
              setCategoria("");
              setTag("");
              setTipo("");
              setSort("recent");
              setMin("");
              setMax("");
            }}
            style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10, cursor: "pointer" }}
          >
            Limpar
          </button>
        </section>

        {loading ? (
          <p style={{ marginTop: 18 }}>Carregando…</p>
        ) : produtos.length === 0 ? (
          <div style={{ marginTop: 18, background: "#f8f9fa", padding: "1.5rem", borderRadius: 12, border: "1px solid #eee" }}>
            <p style={{ margin: 0, color: "#666" }}>Nenhum produto encontrado.</p>
            <p style={{ marginTop: 10, marginBottom: 0 }}>
              Cadastre produtos em <Link href="/admin/produtos">/admin/produtos</Link>.
            </p>
          </div>
        ) : (
          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {produtos.map((produto) => {
              const img = produto.imagens?.[0] ?? "/placeholder.jpg";
              const outOfStock = (produto.tipo === "fisico" || produto.tipo === "kit") && (produto.estoqueQty ?? 0) <= 0;
              return (
                <div
                  key={produto.id}
                  style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                >
                  <div style={{ height: 200, background: "#f0f0f0", position: "relative", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={produto.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <div style={{ padding: "1.1rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#3498db", textTransform: "uppercase", fontWeight: "bold" }}>
                      {produto.tipo === "ebook" ? "📱 E-book" : produto.tipo === "kit" ? "🎁 Kit" : "📚 Físico"}
                    </span>

                    <h3 style={{ fontSize: "1.1rem", margin: "0.5rem 0", color: "#2c3e50" }}>{produto.titulo}</h3>
                    <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: 8 }}>{produto.autor}</p>

                    {produto.categorias?.length ? (
                      <p style={{ color: "#777", fontSize: "0.85rem", marginTop: 0, marginBottom: 8 }}>
                        {produto.categorias.slice(0, 2).join(" • ")}
                        {produto.categorias.length > 2 ? " …" : ""}
                      </p>
                    ) : null}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginTop: 10 }}>
                      <span style={{ fontSize: "1.35rem", fontWeight: "bold", color: "#27ae60" }}>R$ {money(produto.precoCents)}</span>
                      <button
                        disabled={outOfStock}
                        onClick={() =>
                          cart.addItem({
                            productId: produto.id,
                            titulo: produto.titulo,
                            tipo: produto.tipo,
                            unitPriceCents: produto.precoCents,
                            imagem: img,
                          })
                        }
                        style={{
                          background: outOfStock ? "#bdc3c7" : "#3498db",
                          color: "white",
                          border: "none",
                          padding: "0.55rem 0.9rem",
                          borderRadius: 10,
                          cursor: outOfStock ? "not-allowed" : "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        {outOfStock ? "Sem estoque" : "Adicionar"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

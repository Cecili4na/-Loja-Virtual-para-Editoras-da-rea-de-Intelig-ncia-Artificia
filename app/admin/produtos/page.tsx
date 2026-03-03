"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AdminProduto = {
  id: string;
  titulo: string;
  autor: string;
  tipo: string;
  precoCents: number;
  isActive?: boolean;
};

function money(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export default function AdminProdutosPage() {
  const [items, setItems] = useState<AdminProduto[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/produtos", { cache: "no-store" });
      const data = (await res.json()) as any[];
      setItems(
        data.map((p) => ({
          id: p.id,
          titulo: p.titulo,
          autor: p.autor,
          tipo: p.tipo,
          precoCents: p.precoCents ?? 0,
          isActive: p.isActive,
        }))
      );
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Excluir este produto?")) return;
    const res = await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Falha ao excluir");
      return;
    }
    load();
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Admin • Produtos</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/" style={{ textDecoration: "underline" }}>
            Ver loja
          </Link>
          <Link
            href="/admin/produtos/novo"
            style={{ background: "#2c3e50", color: "white", padding: "10px 14px", borderRadius: 8 }}
          >
            + Novo produto
          </Link>
        </div>
      </div>

      <p style={{ color: "#555" }}>Cadastro/edição/exclusão salva no MongoDB.</p>

      {loading ? (
        <p>Carregando…</p>
      ) : err ? (
        <p style={{ color: "crimson" }}>{err}</p>
      ) : items.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 10 }}>Título</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 10 }}>Autor</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 10 }}>Tipo</th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 10 }}>Preço</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: 10 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>{p.titulo}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>{p.autor}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>{p.tipo}</td>
                  <td style={{ padding: 10, textAlign: "right", borderBottom: "1px solid #f0f0f0" }}>R$ {money(p.precoCents)}</td>
                  <td style={{ padding: 10, textAlign: "right", borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ display: "inline-flex", gap: 8 }}>
                      <Link href={`/admin/produtos/${p.id}`} style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 8 }}>
                        Editar
                      </Link>
                      <button
                        onClick={() => onDelete(p.id)}
                        style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer" }}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductForm from "../ProductForm";

function moneyFromCents(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export default function EditarProdutoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [initial, setInitial] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/produtos/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Produto não encontrado");
        const p = await res.json();
        setInitial({
          titulo: p.titulo ?? "",
          autor: p.autor ?? "",
          descricao: p.descricao ?? "",
          tipo: p.tipo ?? "fisico",
          preco: moneyFromCents(p.precoCents ?? 0),
          imagens: Array.isArray(p.imagens) ? p.imagens.join(", ") : "",
          categorias: Array.isArray(p.categorias) ? p.categorias.join(", ") : "",
          tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
          estoqueQty: p.estoqueQty === null || p.estoqueQty === undefined ? "" : String(p.estoqueQty),
          isActive: p.isActive !== false,
        });
      } catch (e: any) {
        setErr(e?.message ?? "Erro ao carregar");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Editar produto</h1>
        <Link href="/admin/produtos" style={{ textDecoration: "underline" }}>
          Voltar
        </Link>
      </div>

      {loading ? (
        <p>Carregando…</p>
      ) : err ? (
        <p style={{ color: "crimson" }}>{err}</p>
      ) : (
        <>
          <ProductForm
            initial={initial}
            submitting={submitting}
            onSubmit={async (payload) => {
              setSubmitting(true);
              setErr(null);
              try {
                const res = await fetch(`/api/produtos/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
                if (!res.ok) {
                  const e = await res.json().catch(() => ({}));
                  throw new Error(e?.error || "Falha ao salvar");
                }
                router.push("/admin/produtos");
              } catch (e: any) {
                setErr(e?.message ?? "Erro ao salvar");
              } finally {
                setSubmitting(false);
              }
            }}
          />
        </>
      )}
    </div>
  );
}

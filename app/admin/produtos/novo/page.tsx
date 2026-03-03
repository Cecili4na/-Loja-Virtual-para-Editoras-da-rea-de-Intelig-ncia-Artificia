"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProductForm from "../ProductForm";

export default function NovoProdutoPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Novo produto</h1>
        <Link href="/admin/produtos" style={{ textDecoration: "underline" }}>
          Voltar
        </Link>
      </div>

      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

      <ProductForm
        submitting={submitting}
        onSubmit={async (payload) => {
          setSubmitting(true);
          setErr(null);
          try {
            const res = await fetch("/api/produtos", {
              method: "POST",
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
    </div>
  );
}

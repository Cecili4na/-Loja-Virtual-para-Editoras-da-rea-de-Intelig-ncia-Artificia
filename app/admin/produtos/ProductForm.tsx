"use client";

import { useMemo, useState } from "react";
import type { ProductType } from "@/lib/types";

type FormProduct = {
  titulo: string;
  autor: string;
  descricao: string;
  tipo: ProductType;
  preco: string; // BRL decimal
  imagens: string; // comma-separated
  categorias: string; // comma-separated
  tags: string; // comma-separated
  estoqueQty: string; // int or empty
  isActive: boolean;
};

function parseCommaList(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function parsePrecoToCents(preco: string) {
  const normalized = preco.replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.trunc(Math.round(n * 100)));
}

export default function ProductForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial?: Partial<FormProduct>;
  onSubmit: (payload: any) => Promise<void>;
  submitting: boolean;
}) {
  const [form, setForm] = useState<FormProduct>({
    titulo: initial?.titulo ?? "",
    autor: initial?.autor ?? "",
    descricao: initial?.descricao ?? "",
    tipo: (initial?.tipo as ProductType) ?? "fisico",
    preco: initial?.preco ?? "0,00",
    imagens: initial?.imagens ?? "",
    categorias: initial?.categorias ?? "",
    tags: initial?.tags ?? "",
    estoqueQty: initial?.estoqueQty ?? "",
    isActive: initial?.isActive ?? true,
  });

  const showStock = useMemo(() => form.tipo === "fisico" || form.tipo === "kit", [form.tipo]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const payload = {
          titulo: form.titulo.trim(),
          autor: form.autor.trim(),
          descricao: form.descricao.trim(),
          tipo: form.tipo,
          precoCents: parsePrecoToCents(form.preco),
          imagens: parseCommaList(form.imagens),
          categorias: parseCommaList(form.categorias),
          tags: parseCommaList(form.tags),
          estoqueQty: showStock ? Math.max(0, Math.trunc(Number(form.estoqueQty || 0))) : null,
          isActive: form.isActive,
        };
        await onSubmit(payload);
      }}
      style={{ display: "grid", gap: 14, marginTop: 16 }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <label>Título</label>
        <input
          value={form.titulo}
          onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
          required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Autor</label>
        <input
          value={form.autor}
          onChange={(e) => setForm((p) => ({ ...p, autor: e.target.value }))}
          required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Descrição</label>
        <textarea
          value={form.descricao}
          onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
          rows={5}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Tipo</label>
          <select
            value={form.tipo}
            onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as ProductType }))}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          >
            <option value="fisico">Físico</option>
            <option value="ebook">E-book</option>
            <option value="kit">Kit</option>
          </select>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label>Preço (R$)</label>
          <input
            value={form.preco}
            onChange={(e) => setForm((p) => ({ ...p, preco: e.target.value }))}
            placeholder="Ex: 89,90"
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />
        </div>
      </div>

      {showStock ? (
        <div style={{ display: "grid", gap: 6 }}>
          <label>Estoque (quantidade)</label>
          <input
            value={form.estoqueQty}
            onChange={(e) => setForm((p) => ({ ...p, estoqueQty: e.target.value }))}
            placeholder="Ex: 10"
            inputMode="numeric"
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />
        </div>
      ) : (
        <div style={{ color: "#666" }}>E-book: estoque ilimitado.</div>
      )}

      <div style={{ display: "grid", gap: 6 }}>
        <label>Imagens (URLs separadas por vírgula)</label>
        <input
          value={form.imagens}
          onChange={(e) => setForm((p) => ({ ...p, imagens: e.target.value }))}
          placeholder="https://.../capa.jpg, https://.../verso.jpg"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Categorias (separadas por vírgula)</label>
          <input
            value={form.categorias}
            onChange={(e) => setForm((p) => ({ ...p, categorias: e.target.value }))}
            placeholder="IA, Segurança, Blockchain"
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Tags (separadas por vírgula)</label>
          <input
            value={form.tags}
            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
            placeholder="iniciante, avançado, guia"
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
        />
        Publicado no catálogo
      </label>

      <button
        disabled={submitting}
        style={{ background: "#27ae60", color: "white", padding: "12px 16px", borderRadius: 10, border: "none", cursor: "pointer" }}
      >
        {submitting ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}

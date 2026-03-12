'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProdutoCard from '../components/ProdutoCard'
import { useProdutos } from '../contexts/ProdutosContext'

export default function Produtos() {
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'fisico' | 'digital'>('todos')
  const [ordenacao, setOrdenacao] = useState<'preco-asc' | 'preco-desc' | 'nome'>('nome')
  const { produtos } = useProdutos()

  const produtosFiltrados = produtos.filter((produto) => {
    if (filtroTipo === 'todos') return true
    return produto.tipo === filtroTipo
  })

  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    if (ordenacao === 'preco-asc') return a.preco - b.preco
    if (ordenacao === 'preco-desc') return b.preco - a.preco
    return a.titulo.localeCompare(b.titulo)
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1 }}>
        <div className="produtos-header">
          <h2>Catálogo de Produtos</h2>
          <p className="produtos-subtitle">
            {produtosOrdenados.length} {produtosOrdenados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>

        <div className="filtros-container">
          <div className="filtro-group">
            <label>Tipo:</label>
            <div className="filtro-buttons">
              <button
                className={`filtro-button ${filtroTipo === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltroTipo('todos')}
              >
                Todos
              </button>
              <button
                className={`filtro-button ${filtroTipo === 'fisico' ? 'active' : ''}`}
                onClick={() => setFiltroTipo('fisico')}
              >
                Físicos
              </button>
              <button
                className={`filtro-button ${filtroTipo === 'digital' ? 'active' : ''}`}
                onClick={() => setFiltroTipo('digital')}
              >
                E-books
              </button>
            </div>
          </div>

          <div className="filtro-group">
            <label>Ordenar por:</label>
            <select
              className="ordenacao-select"
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as any)}
            >
              <option value="nome">Nome</option>
              <option value="preco-asc">Menor preço</option>
              <option value="preco-desc">Maior preço</option>
            </select>
          </div>
        </div>

        <div className="produtos-grid">
          {produtosOrdenados.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>

        {produtosOrdenados.length === 0 && (
          <div className="empty-state">
            <p>Nenhum produto encontrado com os filtros selecionados.</p>
          </div>
        )}
      </main>

      <Footer />

      <style jsx>{`
        .produtos-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-top: 2rem;
        }

        .produtos-header h2 {
          font-size: 2.5rem;
          color: var(--ink);
          margin-bottom: 0.5rem;
        }

        .produtos-subtitle {
          color: var(--muted);
          font-size: 1.1rem;
        }

        .filtros-container {
          background: rgba(18, 24, 42, 0.85);
          padding: 1.5rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          align-items: center;
          border: 1px solid var(--line);
          box-shadow: 0 14px 24px rgba(7, 10, 24, 0.35);
        }

        .filtro-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .filtro-group label {
          font-weight: 600;
          color: var(--ink);
        }

        .filtro-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .filtro-button {
          padding: 0.5rem 1.25rem;
          border: 2px solid #e2e8f0;
          background: rgba(9, 12, 22, 0.45);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          color: var(--ink);
        }

        .filtro-button:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .filtro-button.active {
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061021;
          border-color: transparent;
        }

        .ordenacao-select {
          padding: 0.5rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background: rgba(9, 12, 22, 0.45);
          cursor: pointer;
          font-weight: 500;
          color: var(--ink);
          transition: border-color 0.2s;
        }

        .ordenacao-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .produtos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #718096;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .produtos-header h2 {
            font-size: 1.8rem;
          }

          .filtros-container {
            flex-direction: column;
            align-items: stretch;
          }

          .filtro-group {
            flex-direction: column;
            align-items: stretch;
          }

          .filtro-buttons {
            flex-wrap: wrap;
          }

          .produtos-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}


'use client'

import { Produto } from '../contexts/CarrinhoContext'
import { useCarrinho } from '../contexts/CarrinhoContext'

interface ProdutoCardProps {
  produto: Produto
}

export default function ProdutoCard({ produto }: ProdutoCardProps) {
  const { adicionarAoCarrinho } = useCarrinho()

  const handleAdicionar = () => {
    adicionarAoCarrinho(produto)
  }

  return (
    <div className="card">
      <div className="card-image">
        <img
          src={produto.imagem}
          alt={`Capa do livro ${produto.titulo}`}
          className="cover"
        />
      </div>
      
      <div className="card-content">
        <span className="badge">
          {produto.tipo === 'digital' ? 'Digital' : 'Físico'}
        </span>
        
        <h3 className="card-title">{produto.titulo}</h3>
        
        <p className="card-author">{produto.autor}</p>
        
        <div className="card-footer">
          <span className="price">
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </span>
          
          <button onClick={handleAdicionar} className="add-button">
            Adicionar
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .card {
          border: 1px solid var(--line);
          border-radius: 18px;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          background:
            linear-gradient(180deg, rgba(139, 92, 246, 0.08), transparent 35%),
            rgba(18, 24, 42, 0.9);
          position: relative;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.45);
          border-color: rgba(34, 211, 238, 0.45);
        }

        .card-image {
          height: 200px;
          background: linear-gradient(145deg, rgba(34, 211, 238, 0.28), rgba(139, 92, 246, 0.32));
          border-bottom: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .card-image::before {
          content: '';
          position: absolute;
          left: 14px;
          right: 14px;
          top: 14px;
          bottom: 14px;
          border: 1px solid #c8bfad;
          border-color: rgba(147, 197, 253, 0.45);
        }

        .cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: relative;
          z-index: 1;
        }

        .card-content {
          padding: 1.5rem;
        }

        .badge {
          font-size: 0.75rem;
          color: var(--ink);
          text-transform: uppercase;
          font-weight: 700;
          background: rgba(34, 211, 238, 0.18);
          border: 1px solid rgba(34, 211, 238, 0.32);
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          display: inline-block;
        }

        .card-title {
          font-size: 1.1rem;
          margin: 0.75rem 0 0.5rem;
          color: var(--ink);
          font-weight: 600;
          line-height: 1.4;
        }

        .card-author {
          color: var(--muted);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--line);
        }

        .price {
          font-size: 1.35rem;
          font-weight: 700;
          color: #f2e8ff;
          text-shadow: 0 0 12px rgba(192, 132, 252, 0.35);
        }

        .add-button {
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061021;
          border: 1px solid transparent;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .add-button:hover {
          filter: brightness(1.07);
          box-shadow: 0 0 18px rgba(34, 211, 238, 0.45);
        }
      `}</style>
    </div>
  )
}

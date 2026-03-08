'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useCarrinho } from '../contexts/CarrinhoContext'

export default function Header() {
  const { quantidadeTotal } = useCarrinho()
  const quantidadeAnterior = useRef(quantidadeTotal)
  const [itemAdicionado, setItemAdicionado] = useState(false)

  useEffect(() => {
    if (quantidadeTotal > quantidadeAnterior.current) {
      setItemAdicionado(true)
      const timer = setTimeout(() => setItemAdicionado(false), 900)
      quantidadeAnterior.current = quantidadeTotal
      return () => clearTimeout(timer)
    }

    quantidadeAnterior.current = quantidadeTotal
    return undefined
  }, [quantidadeTotal])

  return (
    <header className="header">
      <nav className="nav-container">
        <Link href="/">
          <h1 className="logo">COMPIA Editora</h1>
        </Link>
        <div className="nav-links">
          <Link href="/produtos" className="nav-link">
            Produtos
          </Link>
          <Link href="/carrinho" className="nav-link cart-link">
            <span className="cart-label">Carrinho</span>
            {quantidadeTotal > 0 && <span className="cart-count">{quantidadeTotal}</span>}
            {itemAdicionado && <span className="cart-added">✓</span>}
          </Link>
        </div>
      </nav>
      
      <style jsx>{`
        .header {
          background: rgba(12, 18, 34, 0.72);
          backdrop-filter: blur(12px);
          color: var(--ink);
          padding: 1rem 2rem;
          border-bottom: 1px solid var(--line);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 10px 30px rgba(5, 9, 23, 0.45);
        }

        .header::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent-2), transparent);
          opacity: 0.7;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .logo:hover {
          color: var(--accent);
          text-shadow: 0 0 18px rgba(34, 211, 238, 0.45);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: var(--ink);
          font-weight: 600;
          font-size: 0.92rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: color 0.2s ease;
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 100%;
          height: 2px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.2s ease;
        }

        .nav-link:hover {
          color: var(--accent);
        }

        .nav-link:hover::after {
          transform: scaleX(1);
        }

        .cart-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cart-link::after {
          display: none;
        }

        .cart-label {
          line-height: 1;
        }

        .cart-count {
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061021;
          border-radius: 999px;
          min-width: 22px;
          height: 22px;
          padding: 0 0.45rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 700;
          box-shadow: 0 0 16px rgba(34, 211, 238, 0.55);
        }

        .cart-added {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1px solid rgba(34, 211, 238, 0.4);
          background: rgba(34, 211, 238, 0.12);
          color: var(--accent);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.68rem;
          font-weight: 700;
          animation: popIn 0.25s ease;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.6);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }

          .logo {
            font-size: 1.2rem;
          }

          .nav-links {
            gap: 1rem;
          }

          .nav-link {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { useCarrinho } from '../contexts/CarrinhoContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Carrinho() {
  const { itens, removerDoCarrinho, atualizarQuantidade, total } = useCarrinho()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1 }}>
        <h2 className="page-title">Carrinho de Compras</h2>

        {itens.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">CART</div>
            <p className="empty-text">Seu carrinho está vazio</p>
            <Link href="/produtos" className="continue-button">
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {itens.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <span>CP</span>
                  </div>
                  
                  <div className="item-info">
                    <h3>{item.titulo}</h3>
                    <p className="item-author">{item.autor}</p>
                    <span className="item-type">
                      {item.tipo === 'digital' ? 'Digital' : 'Físico'}
                    </span>
                  </div>

                  <div className="item-quantity">
                    <button
                      onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                      className="qty-button"
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantidade}</span>
                    <button
                      onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                      className="qty-button"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-price">
                    <p className="unit-price">
                      R$ {item.preco.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="total-price">
                      R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <button
                    onClick={() => removerDoCarrinho(item.id)}
                    className="remove-button"
                    title="Remover item"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Resumo do Pedido</h3>
              
              <div className="summary-line">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2).replace('.', ',')} </span>
              </div>
              
              <div className="summary-line">
                <span>Frete</span>
                <span className="free">Grátis</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-total">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>

              <div className="summary-actions">
                <Link href="/checkout" className="checkout-button">
                  <span className="btn-icon">🛒</span>
                  <span>Finalizar Compra</span>
                </Link>

                <Link href="/produtos" className="continue-shopping">
                  <span className="btn-icon">←</span>
                  <span>Continuar Comprando</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style jsx>{`
        .page-title {
          font-size: 2.5rem;
          color: var(--ink);
          margin-bottom: 2rem;
          text-align: center;
          padding-top: 2rem;
        }

        .empty-cart {
          background: rgba(24, 31, 54, 0.85);
          padding: 4rem 2rem;
          border-radius: 16px;
          text-align: center;
          border: 1px solid var(--line);
          box-shadow: 0 16px 26px rgba(7, 10, 24, 0.35);
        }

        .empty-icon {
          font-size: 0.9rem;
          letter-spacing: 0.24em;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--muted);
        }

        .empty-text {
          font-size: 1.3rem;
          color: var(--muted);
          margin-bottom: 2rem;
        }

        .continue-button {
          display: inline-block;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061021;
          border: 1px solid transparent;
          padding: 1rem 2rem;
          border-radius: 999px;
          font-weight: 600;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .continue-button:hover {
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.45);
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2rem;
          align-items: start;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item {
          background: rgba(24, 31, 54, 0.82);
          padding: 1.5rem;
          border-radius: 16px;
          display: grid;
          grid-template-columns: 80px 1fr auto auto auto;
          gap: 1.5rem;
          align-items: center;
          border: 1px solid var(--line);
          box-shadow: 0 10px 20px rgba(7, 10, 24, 0.28);
          transition: box-shadow 0.2s;
        }

        .cart-item:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .item-image {
          width: 80px;
          height: 80px;
          background: rgba(139, 92, 246, 0.18);
          border: 1px solid var(--line);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          letter-spacing: 0.12em;
          font-weight: 700;
        }

        .item-info h3 {
          font-size: 1.1rem;
          color: var(--ink);
          margin-bottom: 0.25rem;
        }

        .item-author {
          color: var(--muted);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .item-type {
          font-size: 0.75rem;
          color: var(--ink);
          background: rgba(34, 211, 238, 0.12);
          border: 1px solid rgba(34, 211, 238, 0.35);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          display: inline-block;
        }

        .item-quantity {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(9, 12, 22, 0.45);
          padding: 0.5rem;
          border-radius: 8px;
        }

        .qty-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--line);
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .qty-button:hover {
          background: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
        }

        .qty-value {
          font-weight: 600;
          color: var(--ink);
          min-width: 30px;
          text-align: center;
        }

        .item-price {
          text-align: right;
        }

        .unit-price {
          color: var(--muted);
          font-size: 0.85rem;
        }

        .total-price {
          font-size: 1.3rem;
          font-weight: 700;
          color: #7ee7bf;
        }

        .remove-button {
          background: transparent;
          border: 1px solid rgba(244, 63, 94, 0.45);
          width: 76px;
          height: 40px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #fda4af;
          transition: all 0.2s;
        }

        .remove-button:hover {
          background: rgba(244, 63, 94, 0.2);
          color: #fff;
        }

        .cart-summary {
          background: rgba(24, 31, 54, 0.86);
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--line);
          box-shadow: 0 14px 24px rgba(7, 10, 24, 0.35);
          position: sticky;
          top: 100px;
        }

        .cart-summary h3 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--ink);
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          color: var(--muted);
        }

        .summary-line .free {
          color: #48bb78;
          font-weight: 600;
        }

        .summary-divider {
          height: 1px;
          background: var(--line);
          margin: 1.5rem 0;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 1.5rem;
        }

        .summary-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .checkout-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          background: linear-gradient(135deg, var(--accent), var(--accent-2)) !important;
          color: #061021 !important;
          border: 1px solid transparent !important;
          padding: 1rem 1.2rem;
          border-radius: 999px;
          text-align: center;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.02em;
          box-shadow: 0 10px 24px rgba(34, 211, 238, 0.25);
          text-decoration: none !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }

        .checkout-button:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
          box-shadow: 0 14px 28px rgba(34, 211, 238, 0.35);
        }

        .continue-shopping {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          text-align: center;
          color: var(--ink) !important;
          padding: 0.9rem 1rem;
          font-weight: 700;
          border: 1px solid var(--line) !important;
          border-radius: 999px;
          background: rgba(9, 12, 22, 0.45) !important;
          text-decoration: none !important;
          transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }

        .continue-shopping:hover {
          transform: translateY(-1px);
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(34, 211, 238, 0.08);
          text-decoration: none;
        }

        .btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          line-height: 1;
          font-size: 0.95rem;
        }

        @media (max-width: 968px) {
          .cart-content {
            grid-template-columns: 1fr;
          }

          .cart-summary {
            position: static;
          }

          .cart-item {
            grid-template-columns: 60px 1fr;
            gap: 1rem;
          }

          .item-quantity {
            grid-column: 1 / -1;
            justify-content: center;
          }

          .item-price {
            grid-column: 1 / -1;
            text-align: center;
          }

          .remove-button {
            position: absolute;
            top: 1rem;
            right: 1rem;
          }
        }
      `}</style>
    </div>
  )
}


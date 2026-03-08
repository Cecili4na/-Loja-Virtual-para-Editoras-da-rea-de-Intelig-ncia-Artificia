'use client'

import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Confirmacao() {
  const numeroPedido = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1 }}>
        <div className="confirmacao-container">
          <div className="success-icon">OK</div>
          
          <h1>Pedido Confirmado!</h1>
          
          <p className="pedido-numero">
            Número do pedido: <strong>#{numeroPedido}</strong>
          </p>

          <div className="info-box">
            <h3>Confirmação enviada</h3>
            <p>
              Enviamos um email com os detalhes do seu pedido e instruções para acompanhamento.
            </p>
          </div>

          <div className="status-steps">
            <div className="status-step">
              <div className="status-icon">01</div>
              <div>
                <h4>Pedido Confirmado</h4>
                <p>Seu pedido foi recebido com sucesso</p>
              </div>
            </div>

            <div className="status-divider"></div>

            <div className="status-step pending">
              <div className="status-icon">02</div>
              <div>
                <h4>Em Preparação</h4>
                <p>Estamos preparando seu pedido</p>
              </div>
            </div>

            <div className="status-divider"></div>

            <div className="status-step pending">
              <div className="status-icon">03</div>
              <div>
                <h4>Em Transporte</h4>
                <p>Seu pedido está a caminho</p>
              </div>
            </div>

            <div className="status-divider"></div>

            <div className="status-step pending">
              <div className="status-icon">04</div>
              <div>
                <h4>Entregue</h4>
                <p>Pedido entregue com sucesso</p>
              </div>
            </div>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <div className="card-icon">A</div>
              <h4>Prazo de Entrega</h4>
              <p>5-7 dias úteis para livros físicos</p>
              <p>E-books disponíveis imediatamente</p>
            </div>

            <div className="info-card">
              <div className="card-icon">B</div>
              <h4>Acompanhamento</h4>
              <p>Você receberá atualizações por email</p>
              <p>sobre o status do seu pedido</p>
            </div>

            <div className="info-card">
              <div className="card-icon">C</div>
              <h4>Dúvidas?</h4>
              <p>Entre em contato conosco</p>
              <p>contato@compia.com</p>
            </div>
          </div>

          <div className="actions">
            <Link href="/produtos" className="primary-button">
              Continuar Comprando
            </Link>
            <Link href="/" className="secondary-button">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .confirmacao-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem 1rem;
          text-align: center;
        }

        .success-icon {
          width: 84px;
          height: 84px;
          border: 1px solid var(--line);
          background: #ece7dc;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.1em;
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .confirmacao-container h1 {
          font-size: 2.5rem;
          color: var(--ink);
          margin-bottom: 1rem;
        }

        .pedido-numero {
          font-size: 1.2rem;
          color: var(--muted);
          margin-bottom: 2rem;
        }

        .pedido-numero strong {
          color: var(--ink);
          font-size: 1.4rem;
        }

        .info-box {
          background: rgba(34, 211, 238, 0.12);
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 3rem;
          border: 1px solid var(--line);
        }

        .info-box h3 {
          color: var(--ink);
          margin-bottom: 0.75rem;
          font-size: 1.3rem;
        }

        .info-box p {
          color: var(--muted);
          line-height: 1.6;
        }

        .status-steps {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: rgba(24, 31, 54, 0.86);
          border-radius: 16px;
          border: 1px solid var(--line);
          box-shadow: 0 14px 24px rgba(7, 10, 24, 0.35);
        }

        .status-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          max-width: 150px;
        }

        .status-step.pending {
          opacity: 0.5;
        }

        .status-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: rgba(34, 211, 238, 0.15);
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .status-step.pending .status-icon {
          background: rgba(255, 255, 255, 0.05);
        }

        .status-step h4 {
          font-size: 0.9rem;
          color: var(--ink);
          margin: 0;
        }

        .status-step p {
          font-size: 0.75rem;
          color: var(--muted);
          margin: 0;
          text-align: center;
        }

        .status-divider {
          width: 50px;
          height: 2px;
          background: var(--line);
          margin-top: 25px;
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .info-card {
          background: rgba(24, 31, 54, 0.84);
          padding: 2rem 1.5rem;
          border-radius: 16px;
          border: 1px solid var(--line);
          box-shadow: 0 10px 20px rgba(7, 10, 24, 0.3);
        }

        .card-icon {
          width: 36px;
          height: 36px;
          border: 1px solid var(--line);
          background: rgba(139, 92, 246, 0.2);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.82rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .info-card h4 {
          font-size: 1.1rem;
          color: var(--ink);
          margin-bottom: 0.75rem;
        }

        .info-card p {
          font-size: 0.9rem;
          color: var(--muted);
          margin: 0.25rem 0;
          line-height: 1.5;
        }

        .actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061021;
          border: 1px solid transparent;
          border-radius: 999px;
          font-weight: 600;
          font-size: 1.1rem;
          text-decoration: none !important;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .primary-button::before {
          content: '🛍️';
          font-size: 0.92rem;
        }

        .primary-button:hover {
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.45);
        }

        .secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2.5rem;
          background: rgba(9, 12, 22, 0.45);
          color: var(--ink);
          border: 1px solid var(--line);
          border-radius: 999px;
          font-weight: 600;
          font-size: 1.1rem;
          text-decoration: none !important;
          transition: all 0.2s;
        }

        .secondary-button::before {
          content: '↩';
          font-size: 1rem;
        }

        .secondary-button:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 768px) {
          .confirmacao-container {
            padding: 2rem 1rem;
          }

          .confirmacao-container h1 {
            font-size: 1.8rem;
          }

          .status-steps {
            flex-direction: column;
            padding: 1.5rem;
          }

          .status-divider {
            width: 2px;
            height: 30px;
            margin: 0;
          }

          .status-step {
            max-width: 100%;
            flex-direction: row;
            text-align: left;
          }

          .status-step h4,
          .status-step p {
            text-align: left;
          }

          .info-cards {
            grid-template-columns: 1fr;
          }

          .actions {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

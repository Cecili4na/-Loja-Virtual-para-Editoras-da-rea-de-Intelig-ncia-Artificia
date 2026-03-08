'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1 }}>
        <section className="panel">
          <h1>Fale com a COMPIA</h1>
          <p className="subtitle">Retornamos em até 1 dia útil.</p>

          {enviado ? (
            <div className="ok">Mensagem enviada com sucesso.</div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setEnviado(true)
              }}
            >
              <div className="row">
                <input placeholder="Nome" required className="input" />
                <input placeholder="Email" type="email" required className="input" />
              </div>
              <input placeholder="Assunto" required className="input" />
              <textarea placeholder="Mensagem" required className="input area" />
              <button type="submit" className="button">Enviar mensagem</button>
            </form>
          )}
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .panel {
          background: rgba(24, 31, 54, 0.86);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 2rem;
          margin-top: 2rem;
          max-width: 860px;
        }

        h1 {
          font-size: clamp(1.8rem, 4vw, 2.3rem);
          margin-bottom: 0.35rem;
        }

        .subtitle {
          color: var(--muted);
          margin-bottom: 1rem;
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }

        .input {
          width: 100%;
          margin-top: 0.8rem;
          background: rgba(9, 12, 22, 0.45);
          border: 1px solid var(--line);
          border-radius: 10px;
          color: var(--ink);
          padding: 0.8rem 0.9rem;
        }

        .area {
          min-height: 140px;
          resize: vertical;
        }

        .button {
          margin-top: 1rem;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061021;
          border: none;
          border-radius: 999px;
          padding: 0.8rem 1.25rem;
          font-weight: 700;
        }

        .ok {
          background: rgba(34, 211, 238, 0.12);
          border: 1px solid rgba(34, 211, 238, 0.4);
          border-radius: 12px;
          padding: 1rem;
        }

        @media (max-width: 768px) {
          .row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

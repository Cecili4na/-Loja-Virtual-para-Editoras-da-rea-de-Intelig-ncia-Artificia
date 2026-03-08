'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PrivacidadePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1 }}>
        <section className="panel">
          <h1>Política de Privacidade</h1>
          <p>
            Esta página descreve como coletamos e usamos dados na plataforma COMPIA.
          </p>

          <h3>1. Dados coletados</h3>
          <p>Coletamos apenas dados necessários para compra, entrega e suporte.</p>

          <h3>2. Uso dos dados</h3>
          <p>Utilizamos os dados para processar pedidos e melhorar sua experiência.</p>

          <h3>3. Compartilhamento</h3>
          <p>Não vendemos dados pessoais. Compartilhamento apenas quando necessário para operação.</p>

          <h3>4. Contato</h3>
          <p>Em caso de dúvidas, fale com contato@compia.com.</p>
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
          max-width: 900px;
        }

        h1 {
          font-size: clamp(1.7rem, 4vw, 2.3rem);
          margin-bottom: 1rem;
        }

        h3 {
          margin-top: 1rem;
          margin-bottom: 0.35rem;
        }

        p {
          color: var(--muted);
        }
      `}</style>
    </div>
  )
}

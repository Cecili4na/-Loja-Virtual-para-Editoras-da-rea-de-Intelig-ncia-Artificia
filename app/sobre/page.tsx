'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'

export default function SobrePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1 }}>
        <section className="hero">
          <p className="eyebrow">Sobre a COMPIA</p>
          <h1>Conhecimento aplicado em Inteligência Artificial</h1>
          <p>
            Somos uma editora focada em publicações técnicas de IA, com materiais para
            quem quer aprender, implementar e evoluir com qualidade.
          </p>
        </section>

        <section className="grid">
          <article className="card">
            <h3>Missão</h3>
            <p>
              Traduzir temas complexos de IA em conteúdo claro, prático e atualizado,
              conectando teoria com aplicação real.
            </p>
          </article>

          <article className="card">
            <h3>Visão</h3>
            <p>
              Ser referência em publicações de Inteligência Artificial no Brasil,
              apoiando estudantes, profissionais e empresas.
            </p>
          </article>

          <article className="card">
            <h3>Valores</h3>
            <p>
              Clareza, rigor técnico, ética em IA e compromisso com aprendizado contínuo.
            </p>
          </article>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .hero {
          background: rgba(24, 31, 54, 0.82);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 2rem;
          margin-top: 2rem;
        }

        .eyebrow {
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.8rem;
          margin-bottom: 0.75rem;
        }

        h1 {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          margin-bottom: 0.75rem;
        }

        .hero p {
          color: var(--muted);
          max-width: 760px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .card {
          background: rgba(24, 31, 54, 0.82);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 1.25rem;
        }

        .card h3 {
          margin-bottom: 0.5rem;
        }

        .card p {
          color: var(--muted);
        }
      `}</style>
    </div>
  )
}

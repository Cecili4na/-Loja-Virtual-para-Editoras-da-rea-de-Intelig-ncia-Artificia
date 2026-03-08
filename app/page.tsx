'use client'

import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'

const categorias = [
  'Machine Learning',
  'Deep Learning',
  'NLP',
  'Computer Vision'
]

const destaques = [
  {
    titulo: 'Curadoria técnica',
    texto: 'Seleção focada em aplicações reais e fundamentos sólidos.'
  },
  {
    titulo: 'Edições objetivas',
    texto: 'Conteúdo direto, com linguagem didática e exemplos práticos.'
  },
  {
    titulo: 'Atualização contínua',
    texto: 'Publicações alinhadas com o estado da arte em IA.'
  },
  {
    titulo: 'Catálogo híbrido',
    texto: 'Versões físicas e digitais para diferentes rotinas de estudo.'
  }
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1 }}>
        <section className="hero">
          <div className="container hero-content">
            <p className="eyebrow">Plataforma editorial de IA</p>
            <h2 className="hero-title">Conhecimento técnico com linguagem clara</h2>
            <p className="hero-subtitle">
              Livros e e-books para profissionais, estudantes e equipes que precisam aplicar
              Inteligência Artificial com rigor.
            </p>
            <Link href="/produtos" className="cta-button">
              Explorar catálogo
            </Link>
          </div>
        </section>

        <section className="categories-section">
          <div className="container">
            <h3 className="section-title">Áreas de estudo</h3>
            <div className="categories-grid">
              {categorias.map((cat, index) => (
                <Link href="/produtos" key={cat}>
                  <article className="category-card">
                    <span className="category-index">{String(index + 1).padStart(2, '0')}</span>
                    <h4 className="category-name">{cat}</h4>
                    <p className="category-description">Coleções com trilhas introdutórias e avançadas.</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <h3 className="section-title">Diferenciais COMPIA</h3>
            <div className="features-grid">
              {destaques.map((item, index) => (
                <article className="feature" key={item.titulo}>
                  <span className="feature-index">{index + 1}</span>
                  <h4>{item.titulo}</h4>
                  <p>{item.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .hero {
          background:
            radial-gradient(600px 280px at 15% 5%, rgba(34, 211, 238, 0.18), transparent 70%),
            radial-gradient(700px 320px at 85% 5%, rgba(139, 92, 246, 0.3), transparent 70%),
            rgba(18, 24, 42, 0.8);
          border-bottom: 1px solid var(--line);
          padding: 5.5rem 0;
          border-radius: 0 0 28px 28px;
          position: relative;
          overflow: hidden;
        }

        .hero::after {
          content: '';
          position: absolute;
          inset: auto -10% -120px;
          height: 220px;
          background: radial-gradient(50% 100% at 50% 0%, rgba(139, 92, 246, 0.2), transparent 80%);
          pointer-events: none;
        }

        .hero-content {
          max-width: 780px;
        }

        .eyebrow {
          display: inline-block;
          padding: 0.3rem 0.7rem;
          border: 1px solid rgba(34, 211, 238, 0.4);
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1rem;
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3.3rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin-bottom: 1rem;
          text-shadow: 0 0 24px rgba(139, 92, 246, 0.2);
        }

        .hero-subtitle {
          color: var(--muted);
          font-size: 1.06rem;
          max-width: 680px;
          margin-bottom: 2rem;
        }

        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061021;
          border: 1px solid transparent;
          padding: 0.9rem 1.4rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.84rem;
          font-weight: 700;
          border-radius: 999px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 22px rgba(34, 211, 238, 0.45);
        }

        .categories-section,
        .features-section {
          padding: 4rem 0;
        }

        .section-title {
          font-size: 1.65rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          color: var(--ink);
        }

        .categories-grid,
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }

        .category-card,
        .feature {
          background: rgba(18, 24, 42, 0.85);
          border: 1px solid var(--line);
          padding: 1.25rem;
          min-height: 165px;
          border-radius: 16px;
          transition: transform 0.2s ease, border-color 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .category-card::before,
        .feature::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -60px;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(192, 132, 252, 0.16), transparent 70%);
          pointer-events: none;
        }

        .category-card:hover,
        .feature:hover {
          transform: translateY(-4px);
          border-color: rgba(34, 211, 238, 0.5);
          box-shadow: 0 14px 28px rgba(7, 10, 24, 0.45);
        }

        .category-index,
        .feature-index {
          display: inline-block;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--muted);
          margin-bottom: 0.8rem;
        }

        .category-name,
        .feature h4 {
          font-size: 1.15rem;
          margin-bottom: 0.5rem;
          color: var(--ink);
        }

        .category-description,
        .feature p {
          color: var(--muted);
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 4rem 0;
          }

          .section-title {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </div>
  )
}


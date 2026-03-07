import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        background: '#2c3e50', 
        color: 'white', 
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <nav style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>COMPIA Editora</h1>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link
              href="/produtos"
              style={{ color: 'white', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Produtos
            </Link>

            <Link href="/carrinho" style={{ color: 'white', textDecoration: 'none' }}>
              Carrinho
            </Link>
          </div>
        </nav>
      </header>

      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '2rem', width: '100%' }}>
        <section style={{ textAlign: 'center', padding: '3rem 0' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#2c3e50' }}>
            Bem-vindo à COMPIA Editora
          </h2>

          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto 2rem' }}>
            Sua fonte de conhecimento em Inteligência Artificial, Machine Learning e tecnologias emergentes
          </p>

          <Link 
            href="/produtos" 
            style={{ 
              display: 'inline-block',
              background: '#3498db', 
              color: 'white', 
              padding: '1rem 2rem', 
              borderRadius: '4px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              transition: 'background 0.3s',
              textDecoration: 'none'
            }}
          >
            Ver Catálogo
          </Link>
        </section>

        <section style={{ marginTop: '4rem' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Categorias</h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem' 
          }}>
            {['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision'].map((cat) => (
              <div 
                key={cat}
                style={{ 
                  background: '#f8f9fa', 
                  padding: '2rem', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <h4 style={{ fontSize: '1.3rem', color: '#2c3e50' }}>{cat}</h4>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ 
        background: '#2c3e50', 
        color: 'white', 
        padding: '2rem',
        marginTop: '4rem',
        textAlign: 'center'
      }}>
        <p>&copy; 2026 COMPIA Editora. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
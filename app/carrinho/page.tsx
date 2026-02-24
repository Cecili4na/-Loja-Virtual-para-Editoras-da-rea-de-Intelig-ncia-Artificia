import Link from 'next/link'

export default function Carrinho() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ 
        background: '#2c3e50', 
        color: 'white', 
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <nav style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>COMPIA Editora</h1>
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/produtos" style={{ color: 'white' }}>Produtos</Link>
            <Link href="/carrinho" style={{ color: 'white', fontWeight: 'bold' }}>Carrinho</Link>
          </div>
        </nav>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Carrinho de Compras</h2>
        
        <div style={{ 
          background: '#f8f9fa', 
          padding: '3rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            Seu carrinho está vazio
          </p>
          <Link 
            href="/produtos"
            style={{ 
              display: 'inline-block',
              marginTop: '1rem',
              background: '#3498db', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            Continuar Comprando
          </Link>
        </div>
      </main>
    </div>
  )
}

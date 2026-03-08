import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>COMPIA Editora</h3>
          <p>Especialistas em publicações sobre Inteligência Artificial</p>
        </div>
        
        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li><Link href="/sobre">Sobre Nós</Link></li>
            <li><Link href="/contato">Contato</Link></li>
            <li><Link href="/privacidade">Política de Privacidade</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Categorias</h4>
          <ul>
            <li><Link href="/produtos">Machine Learning</Link></li>
            <li><Link href="/produtos">Deep Learning</Link></li>
            <li><Link href="/produtos">NLP</Link></li>
            <li><Link href="/produtos">Computer Vision</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 COMPIA Editora. Todos os direitos reservados.</p>
      </div>
      
      <style jsx>{`
        .footer {
          background: rgba(10, 14, 28, 0.9);
          color: var(--ink);
          padding: 4rem 2rem 1.5rem;
          margin-top: 4rem;
          position: relative;
          border-top: 1px solid var(--line);
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--ink);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .footer-section h4 {
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
          color: var(--ink);
          letter-spacing: 0.03em;
        }

        .footer-section p {
          color: var(--muted);
          line-height: 1.8;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section li {
          color: var(--muted);
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: color 0.2s ease, transform 0.2s ease;
          padding-left: 20px;
          position: relative;
        }

        .footer-section li::before {
          content: '▸';
          position: absolute;
          left: 0;
          transition: transform 0.3s;
        }

        .footer-section li:hover {
          color: var(--accent);
          transform: translateX(5px);
        }

        .footer-section li:hover::before {
          transform: translateX(5px);
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid var(--line);
          color: var(--muted);
        }

        @media (max-width: 768px) {
          .footer {
            padding: 2rem 1rem 1rem;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </footer>
  )
}

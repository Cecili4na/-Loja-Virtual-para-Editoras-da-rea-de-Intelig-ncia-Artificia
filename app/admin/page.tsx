'use client'

import { FormEvent, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useProdutos } from '../contexts/ProdutosContext'

const imagensPadrao = [
  '/produtos/ml.svg',
  '/produtos/deep.svg',
  '/produtos/nlp.svg',
  '/produtos/cv.svg',
]

export default function AdminPage() {
  const { produtos, adicionarProduto, adminAtivo, ativarAdmin, desativarAdmin } = useProdutos()
  const [senha, setSenha] = useState('')
  const [erroLogin, setErroLogin] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [form, setForm] = useState({
    titulo: '',
    autor: '',
    preco: '',
    tipo: 'fisico' as 'fisico' | 'digital',
    imagem: imagensPadrao[0],
  })

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    const ok = ativarAdmin(senha)

    if (!ok) {
      setErroLogin('Senha inválida. Use admin123.')
      return
    }

    setErroLogin('')
    setSenha('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    adicionarProduto({
      titulo: form.titulo.trim(),
      autor: form.autor.trim(),
      preco: Number(form.preco),
      tipo: form.tipo,
      imagem: form.imagem,
    })

    setForm({
      titulo: '',
      autor: '',
      preco: '',
      tipo: 'fisico',
      imagem: imagensPadrao[0],
    })
    setSucesso('Produto cadastrado com sucesso.')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container admin-page" style={{ flex: 1 }}>
        <div className="admin-header">
          <p className="eyebrow">Área administrativa</p>
          <h2>Cadastro de novos produtos</h2>
          <p>Este modo é local no navegador. Serve para demonstração do cadastro.</p>
        </div>

        {!adminAtivo ? (
          <section className="panel login-panel">
            <h3>Entrar no modo admin</h3>
            <form onSubmit={handleLogin} className="form-grid">
              <label>
                Senha
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite a senha"
                  required
                />
              </label>
              {erroLogin && <p className="error-message">{erroLogin}</p>}
              <button type="submit" className="primary-button">Entrar</button>
            </form>
          </section>
        ) : (
          <>
            <section className="panel">
              <div className="panel-topbar">
                <h3>Modo admin ativo</h3>
                <button type="button" onClick={desativarAdmin} className="secondary-button">
                  Sair do admin
                </button>
              </div>

              <form onSubmit={handleSubmit} className="form-grid product-form">
                <label>
                  Título
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
                    required
                  />
                </label>

                <label>
                  Autor
                  <input
                    type="text"
                    value={form.autor}
                    onChange={(e) => setForm((prev) => ({ ...prev, autor: e.target.value }))}
                    required
                  />
                </label>

                <label>
                  Preço
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.preco}
                    onChange={(e) => setForm((prev) => ({ ...prev, preco: e.target.value }))}
                    required
                  />
                </label>

                <label>
                  Tipo
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value as 'fisico' | 'digital' }))}
                  >
                    <option value="fisico">Físico</option>
                    <option value="digital">Digital</option>
                  </select>
                </label>

                <label>
                  Imagem
                  <select
                    value={form.imagem}
                    onChange={(e) => setForm((prev) => ({ ...prev, imagem: e.target.value }))}
                  >
                    {imagensPadrao.map((imagem) => (
                      <option key={imagem} value={imagem}>
                        {imagem}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="form-actions">
                  <button type="submit" className="primary-button">Cadastrar produto</button>
                  {sucesso && <span className="success-message">{sucesso}</span>}
                </div>
              </form>
            </section>

            <section className="panel">
              <h3>Produtos cadastrados</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Autor</th>
                      <th>Tipo</th>
                      <th>Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((produto) => (
                      <tr key={produto.id}>
                        <td>{produto.id}</td>
                        <td>{produto.titulo}</td>
                        <td>{produto.autor}</td>
                        <td>{produto.tipo}</td>
                        <td>R$ {produto.preco.toFixed(2).replace('.', ',')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      <style jsx>{`
        .admin-page {
          padding-top: 2rem;
          padding-bottom: 3rem;
        }

        .admin-header {
          margin-bottom: 2rem;
        }

        .eyebrow {
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.78rem;
          margin-bottom: 0.6rem;
        }

        .panel {
          background: rgba(18, 24, 42, 0.9);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .panel-topbar {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
        }

        .form-grid {
          display: grid;
          gap: 1rem;
        }

        .product-form {
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        label {
          display: grid;
          gap: 0.45rem;
          color: var(--ink);
          font-size: 0.95rem;
        }

        input,
        select {
          background: rgba(10, 15, 28, 0.9);
          border: 1px solid var(--line);
          color: var(--ink);
          border-radius: 12px;
          padding: 0.9rem 1rem;
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .primary-button,
        .secondary-button {
          border-radius: 999px;
          padding: 0.85rem 1.25rem;
          border: 1px solid transparent;
          cursor: pointer;
          font-weight: 700;
        }

        .primary-button {
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061021;
        }

        .secondary-button {
          background: transparent;
          color: var(--ink);
          border-color: var(--line);
        }

        .error-message {
          color: #fca5a5;
          margin: 0;
        }

        .success-message {
          color: #86efac;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          text-align: left;
          padding: 0.9rem 0.75rem;
          border-bottom: 1px solid var(--line);
        }

        th {
          color: var(--muted);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .panel-topbar {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  )
}

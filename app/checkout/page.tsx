'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCarrinho } from '../contexts/CarrinhoContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import type { CheckoutQuoteResponse } from '@/lib/types'

type SimulacaoPagamento =
  | {
      metodo: 'pix'
      txid: string
      codigoCopiaECola: string
      expiraEm: string
    }
  | {
      metodo: 'boleto'
      linhaDigitavel: string
      codigoBarras: string
      vencimento: string
    }

const somenteDigitos = (valor: string) => valor.replace(/\D/g, '')

const aplicarMascara = (name: string, value: string) => {
  if (name === 'telefone') {
    const digitos = somenteDigitos(value).slice(0, 11)
    if (digitos.length <= 10) {
      return digitos
        .replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_, ddd, p1, p2) => {
          if (!ddd) return ''
          if (!p1) return `(${ddd}`
          if (!p2) return `(${ddd}) ${p1}`
          return `(${ddd}) ${p1}-${p2}`
        })
        .trim()
    }

    return digitos
      .replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (_, ddd, p1, p2) => {
        if (!ddd) return ''
        if (!p1) return `(${ddd}`
        if (!p2) return `(${ddd}) ${p1}`
        return `(${ddd}) ${p1}-${p2}`
      })
      .trim()
  }

  if (name === 'cep') {
    const digitos = somenteDigitos(value).slice(0, 8)
    return digitos.replace(/(\d{5})(\d{0,3})/, '$1-$2').replace(/-$/, '')
  }

  if (name === 'numeroCartao') {
    const digitos = somenteDigitos(value).slice(0, 16)
    return digitos.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  if (name === 'validade') {
    const digitos = somenteDigitos(value).slice(0, 4)
    return digitos.replace(/(\d{2})(\d{0,2})/, '$1/$2').replace(/\/$/, '')
  }

  if (name === 'cvv') {
    return somenteDigitos(value).slice(0, 4)
  }

  if (name === 'estado') {
    return value.toUpperCase().slice(0, 2)
  }

  return value
}

const validarCartaoLuhn = (numeroCartao: string) => {
  const digits = somenteDigitos(numeroCartao)

  if (digits.length < 13 || digits.length > 19) return false

  let soma = 0
  let duplicar = false

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let numero = Number(digits[i])
    if (duplicar) {
      numero *= 2
      if (numero > 9) numero -= 9
    }
    soma += numero
    duplicar = !duplicar
  }

  return soma % 10 === 0
}

const gerarCodigoPix = (valor: number) => {
  const txid = `COPIA${Math.random().toString(36).slice(2, 10).toUpperCase()}`
  const centavos = Math.round(valor * 100)
  const payload = `00020126580014BR.GOV.BCB.PIX0130pagamento.checkout@compia.com520400005303986540${centavos}5802BR5919COMP IA EDITORA6009SAO PAULO62070503${txid}6304ABCD`
  return { txid, payload }
}

const gerarBoleto = (valor: number) => {
  const valorFormatado = Math.round(valor * 100)
    .toString()
    .padStart(10, '0')
  const base = `34191${Math.floor(10000 + Math.random() * 89999)}${Math.floor(10000 + Math.random() * 89999)}${valorFormatado}`

  const linhaDigitavel = `${base.slice(0, 5)}.${base.slice(5, 10)} ${base.slice(10, 15)}.${base.slice(15, 20)} ${base.slice(20, 25)}.${base.slice(25, 30)} 1 ${base.slice(30, 44).padEnd(14, '0')}`

  return {
    linhaDigitavel,
    codigoBarras: base.padEnd(44, '0').slice(0, 44)
  }
}

export default function Checkout() {
  const router = useRouter()
  const { itens, total, limparCarrinho } = useCarrinho()
  const [etapa, setEtapa] = useState<'dados' | 'pagamento'>('dados')
  const [metodoPagamento, setMetodoPagamento] = useState<'cartao' | 'pix' | 'boleto'>('cartao')
  const [processando, setProcessando] = useState(false)
  const [erroPagamento, setErroPagamento] = useState('')
  const [simulacaoPagamento, setSimulacaoPagamento] = useState<SimulacaoPagamento | null>(null)
  const [mensagemCopiaPix, setMensagemCopiaPix] = useState('')
  const [quote, setQuote] = useState<CheckoutQuoteResponse | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [tipoEntrega, setTipoEntrega] = useState<'entrega' | 'retirada'>('entrega')

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    // Dados do cartão
    numeroCartao: '',
    nomeCartao: '',
    validade: '',
    cvv: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const valueFormatado = aplicarMascara(name, value)
    setFormData(prev => ({ ...prev, [name]: valueFormatado }))
  }

  const handleSubmitDados = (e: React.FormEvent) => {
    e.preventDefault()
    setEtapa('pagamento')
  }

  // Calcular frete automaticamente quando CEP ou itens mudam
  useEffect(() => {
    const calcularFrete = async () => {
      if (itens.length === 0) {
        setQuote(null)
        return
      }

      setQuoteLoading(true)
      try {
        const payload = {
          items: itens.map(item => ({
            id: item.id,
            quantidade: item.quantidade,
            tipo: item.tipo as 'fisico' | 'digital',
            preco: item.preco
          })),
          cep: formData.cep,
          deliveryMethod: tipoEntrega
        }

        const res = await fetch('/api/checkout/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (res.ok) {
          const data = await res.json()
          setQuote(data)
        } else {
          setQuote(null)
        }
      } catch (error) {
        console.error('Erro ao calcular frete:', error)
        setQuote(null)
      } finally {
        setQuoteLoading(false)
      }
    }

    calcularFrete()
  }, [itens, formData.cep, tipoEntrega])

  const handleSelecionarMetodo = (metodo: 'cartao' | 'pix' | 'boleto') => {
    setMetodoPagamento(metodo)
    setErroPagamento('')
    setSimulacaoPagamento(null)
    setMensagemCopiaPix('')
  }

  const concluirPedido = async () => {
    setProcessando(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    limparCarrinho()
    router.push('/confirmacao')
  }

  const confirmarPagamentoPendente = async () => {
    setErroPagamento('')
    await concluirPedido()
  }

  const copiarPix = async (codigo: string) => {
    try {
      await navigator.clipboard.writeText(codigo)
      setMensagemCopiaPix('Código PIX copiado.')
    } catch {
      setMensagemCopiaPix('Não foi possível copiar automaticamente.')
    }
  }

  const handleFinalizarCompra = async (e: React.FormEvent) => {
    e.preventDefault()
    setErroPagamento('')
    setMensagemCopiaPix('')

    if (metodoPagamento === 'cartao') {
      if (!validarCartaoLuhn(formData.numeroCartao)) {
        setErroPagamento('Número de cartão inválido para simulação.')
        return
      }

      setProcessando(true)
      await new Promise(resolve => setTimeout(resolve, 1800))

      if (formData.cvv === '000') {
        setProcessando(false)
        setErroPagamento('Pagamento recusado pelo emissor. Tente outro cartão.')
        return
      }

      await concluirPedido()
      return
    }

    setProcessando(true)
    await new Promise(resolve => setTimeout(resolve, 900))

    if (metodoPagamento === 'pix') {
      const { txid, payload } = gerarCodigoPix(total)
      const expiraEm = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
      setSimulacaoPagamento({
        metodo: 'pix',
        txid,
        codigoCopiaECola: payload,
        expiraEm
      })
    }

    if (metodoPagamento === 'boleto') {
      const { linhaDigitavel, codigoBarras } = gerarBoleto(total)
      const vencimento = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
      setSimulacaoPagamento({
        metodo: 'boleto',
        linhaDigitavel,
        codigoBarras,
        vencimento
      })
    }

    setProcessando(false)
  }

  if (itens.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main className="container" style={{ flex: 1, textAlign: 'center', paddingTop: '4rem' }}>
          <h2>Seu carrinho está vazio</h2>
          <Link href="/produtos" className="link-button">
            Voltar para Produtos
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1 }}>
        <h2 className="page-title">Finalizar Compra</h2>

        <div className="steps-indicator">
          <div className={`step ${etapa === 'dados' ? 'active' : 'completed'}`}>
            <div className="step-number">1</div>
            <span>Dados</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${etapa === 'pagamento' ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Pagamento</span>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            {etapa === 'dados' && (
              <form onSubmit={handleSubmitDados}>
                <div className="form-section">
                  <h3>Dados Pessoais</h3>
                  
                  <div className="form-group">
                    <label>Nome Completo *</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Telefone *</label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Tipo de Entrega</h3>
                  
                  <div className="delivery-options">
                    <label className={`delivery-option ${tipoEntrega === 'entrega' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="tipoEntrega"
                        value="entrega"
                        checked={tipoEntrega === 'entrega'}
                        onChange={() => setTipoEntrega('entrega')}
                      />
                      <div className="option-content">
                        <strong>Entrega em casa</strong>
                        <span>Receba no endereço informado</span>
                      </div>
                    </label>
                    
                    <label className={`delivery-option ${tipoEntrega === 'retirada' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="tipoEntrega"
                        value="retirada"
                        checked={tipoEntrega === 'retirada'}
                        onChange={() => setTipoEntrega('retirada')}
                      />
                      <div className="option-content">
                        <strong>Retirar no local</strong>
                        <span>Frete grátis</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Endereço de Entrega</h3>

                  <div className="form-row">
                    <div className="form-group" style={{ flex: '0 0 150px' }}>
                      <label>CEP *</label>
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="00000-000"
                      />
                    </div>

                    <div className="form-group">
                      <label>Endereço *</label>
                      <input
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ flex: '0 0 120px' }}>
                      <label>Número *</label>
                      <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Complemento</label>
                      <input
                        type="text"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Cidade *</label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group" style={{ flex: '0 0 100px' }}>
                      <label>Estado *</label>
                      <input
                        type="text"
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="UF"
                        maxLength={2}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  Continuar para Pagamento
                </button>
              </form>
            )}

            {etapa === 'pagamento' && (
              <form onSubmit={handleFinalizarCompra}>
                <div className="form-section">
                  <h3>Método de Pagamento</h3>

                  <div className="payment-methods">
                    <div
                      className={`payment-method ${metodoPagamento === 'cartao' ? 'active' : ''}`}
                      onClick={() => handleSelecionarMetodo('cartao')}
                    >
                      <div className="payment-icon">01</div>
                      <span>Cartão de Crédito</span>
                    </div>

                    <div
                      className={`payment-method ${metodoPagamento === 'pix' ? 'active' : ''}`}
                      onClick={() => handleSelecionarMetodo('pix')}
                    >
                      <div className="payment-icon">02</div>
                      <span>PIX</span>
                    </div>

                    <div
                      className={`payment-method ${metodoPagamento === 'boleto' ? 'active' : ''}`}
                      onClick={() => handleSelecionarMetodo('boleto')}
                    >
                      <div className="payment-icon">03</div>
                      <span>Boleto</span>
                    </div>
                  </div>

                  {metodoPagamento === 'cartao' && (
                    <div className="payment-details">
                      <div className="form-group">
                        <label>Número do Cartão *</label>
                        <input
                          type="text"
                          name="numeroCartao"
                          value={formData.numeroCartao}
                          onChange={handleInputChange}
                          required
                          className="form-input"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                        />
                      </div>

                      <div className="form-group">
                        <label>Nome no Cartão *</label>
                        <input
                          type="text"
                          name="nomeCartao"
                          value={formData.nomeCartao}
                          onChange={handleInputChange}
                          required
                          className="form-input"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Validade *</label>
                          <input
                            type="text"
                            name="validade"
                            value={formData.validade}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="MM/AA"
                            maxLength={5}
                          />
                        </div>

                        <div className="form-group">
                          <label>CVV *</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="000"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {metodoPagamento === 'pix' && (
                    <div className="payment-info">
                      <p>Ao gerar, o checkout cria um PIX Copia e Cola com validade de 15 minutos.</p>
                      <p>Depois, clique em “Pagamento aprovado” para concluir.</p>
                    </div>
                  )}

                  {metodoPagamento === 'boleto' && (
                    <div className="payment-info">
                      <p>Ao gerar, exibimos linha digitável e código de barras.</p>
                      <p>Use “Pagamento aprovado” para concluir.</p>
                    </div>
                  )}

                  {erroPagamento && <p className="payment-error">{erroPagamento}</p>}

                  {simulacaoPagamento?.metodo === 'pix' && (
                    <div className="simulacao-box">
                      <h4>PIX gerado</h4>
                      <p><strong>TXID:</strong> {simulacaoPagamento.txid}</p>
                      <p><strong>Expira às:</strong> {simulacaoPagamento.expiraEm}</p>
                      <textarea
                        readOnly
                        className="payment-code"
                        value={simulacaoPagamento.codigoCopiaECola}
                      />
                      <div className="simulacao-actions">
                        <button
                          type="button"
                          className="back-button"
                          onClick={() => copiarPix(simulacaoPagamento.codigoCopiaECola)}
                        >
                          Copiar código PIX
                        </button>
                        <button
                          type="button"
                          className="submit-button"
                          onClick={confirmarPagamentoPendente}
                          disabled={processando}
                        >
                          Pagamento aprovado
                        </button>
                      </div>
                      {mensagemCopiaPix && <p className="copy-feedback">{mensagemCopiaPix}</p>}
                    </div>
                  )}

                  {simulacaoPagamento?.metodo === 'boleto' && (
                    <div className="simulacao-box">
                      <h4>Boleto gerado</h4>
                      <p><strong>Vencimento:</strong> {simulacaoPagamento.vencimento}</p>
                      <p><strong>Linha digitável:</strong> {simulacaoPagamento.linhaDigitavel}</p>
                      <textarea
                        readOnly
                        className="payment-code"
                        value={simulacaoPagamento.codigoBarras}
                      />
                      <div className="simulacao-actions">
                        <button
                          type="button"
                          className="submit-button"
                          onClick={confirmarPagamentoPendente}
                          disabled={processando}
                        >
                          Pagamento aprovado
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="back-button"
                    onClick={() => setEtapa('dados')}
                  >
                    Voltar
                  </button>

                  <button type="submit" className="submit-button" disabled={processando}>
                    {processando
                      ? 'Processando...'
                      : metodoPagamento === 'cartao'
                        ? 'Pagar com Cartão'
                        : metodoPagamento === 'pix'
                          ? 'Gerar PIX'
                          : 'Gerar Boleto'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="order-summary">
            <h3>Resumo do Pedido</h3>

            <div className="summary-items">
              {itens.map((item) => (
                <div key={item.id} className="summary-item">
                  <div>
                    <p className="item-title">{item.titulo}</p>
                    <p className="item-qty">Qtd: {item.quantidade}</p>
                  </div>
                  <p className="item-price">
                    R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-line">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>

            <div className="summary-line">
              <span>Frete</span>
              <span className={quote?.shippingCents === 0 ? 'free' : ''}>
                {quoteLoading ? 'Calculando...' : quote ? `R$ ${(quote.shippingCents / 100).toFixed(2).replace('.', ',')}` : 'Grátis'}
              </span>
            </div>

            {quote?.hasPhysical && tipoEntrega === 'entrega' && quote.shippingCents === 0 && (
              <div className="free-shipping-notice">
                🎉 Frete grátis para compras acima de R$ 200,00
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>R$ {quote ? ((quote.totalCents) / 100).toFixed(2).replace('.', ',') : total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>
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

        .steps-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 3rem;
          gap: 1rem;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          color: var(--muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          transition: all 0.3s;
        }

        .step.active .step-number {
          background: var(--ink);
          color: var(--paper);
        }

        .step.completed .step-number {
          background: #48bb78;
          color: white;
        }

        .step span {
          font-size: 0.9rem;
          color: var(--muted);
        }

        .step.active span,
        .step.completed span {
          color: var(--ink);
          font-weight: 600;
        }

        .step-divider {
          width: 60px;
          height: 2px;
          background: var(--line);
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          align-items: start;
        }

        .checkout-form {
          background: rgba(24, 31, 54, 0.86);
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--line);
          box-shadow: 0 16px 26px rgba(7, 10, 24, 0.35);
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section h3 {
          font-size: 1.3rem;
          color: var(--ink);
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--line);
        }

        .form-group {
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--ink);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--line);
          background: rgba(9, 12, 22, 0.45);
          color: var(--ink);
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .delivery-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .delivery-option {
          padding: 1.25rem;
          border: 2px solid var(--line);
          background: rgba(9, 12, 22, 0.35);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .delivery-option input[type="radio"] {
          margin-top: 0.25rem;
          cursor: pointer;
        }

        .delivery-option .option-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .delivery-option .option-content strong {
          color: var(--ink);
          font-size: 0.95rem;
        }

        .delivery-option .option-content span {
          color: var(--muted);
          font-size: 0.85rem;
        }

        .delivery-option:hover {
          border-color: var(--accent);
        }

        .delivery-option.active {
          border-color: var(--accent-2);
          background: rgba(139, 92, 246, 0.15);
        }

        .free-shipping-notice {
          background: rgba(72, 187, 120, 0.15);
          color: #48bb78;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
          margin: 0.75rem 0;
          border: 1px solid rgba(72, 187, 120, 0.3);
        }

        .payment-methods {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .payment-method {
          padding: 1.5rem 1rem;
          border: 2px solid var(--line);
          background: rgba(9, 12, 22, 0.35);
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .payment-method:hover {
          border-color: var(--accent);
        }

        .payment-method.active {
          border-color: var(--accent-2);
          background: rgba(139, 92, 246, 0.18);
        }

        .payment-icon {
          font-size: 0.84rem;
          letter-spacing: 0.1em;
          font-weight: 700;
          color: var(--muted);
          margin-bottom: 0.5rem;
        }

        .payment-method span {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .payment-details {
          padding-top: 1rem;
        }

        .payment-info {
          background: rgba(34, 211, 238, 0.12);
          padding: 1.5rem;
          border-radius: 8px;
          color: var(--ink);
          margin-top: 1rem;
        }

        .payment-info p {
          margin-bottom: 0.5rem;
        }

        .payment-error {
          margin-top: 1rem;
          padding: 0.9rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(248, 113, 113, 0.5);
          background: rgba(248, 113, 113, 0.15);
          color: #fecaca;
          font-weight: 600;
        }

        .simulacao-box {
          margin-top: 1.2rem;
          border-radius: 12px;
          border: 1px solid var(--line);
          background: rgba(9, 12, 22, 0.4);
          padding: 1rem;
        }

        .simulacao-box h4 {
          margin-bottom: 0.8rem;
          color: var(--ink);
        }

        .simulacao-box p {
          margin-bottom: 0.5rem;
          color: var(--muted);
        }

        .simulacao-box strong {
          color: var(--ink);
        }

        .payment-code {
          width: 100%;
          min-height: 90px;
          border-radius: 8px;
          margin-top: 0.5rem;
          margin-bottom: 0.8rem;
          border: 1px solid var(--line);
          background: rgba(9, 12, 22, 0.85);
          color: #dbeafe;
          padding: 0.75rem;
          font-size: 0.84rem;
          resize: vertical;
        }

        .simulacao-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .simulacao-actions :global(button) {
          flex: 1;
          min-width: 180px;
        }

        .copy-feedback {
          margin-top: 0.6rem;
          color: #93c5fd;
          font-size: 0.88rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
        }

        .back-button {
          flex: 1;
          padding: 1rem;
          border: 2px solid var(--line);
          background: rgba(9, 12, 22, 0.45);
          color: var(--ink);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-button:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .submit-button {
          flex: 2;
          padding: 1rem;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061021;
          border: 1px solid transparent;
          border-radius: 999px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: box-shadow 0.2s ease;
        }

        .submit-button:hover:not(:disabled) {
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.45);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .order-summary {
          background: rgba(24, 31, 54, 0.88);
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--line);
          box-shadow: 0 16px 26px rgba(7, 10, 24, 0.35);
          position: sticky;
          top: 100px;
        }

        .order-summary h3 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--ink);
        }

        .summary-items {
          margin-bottom: 1.5rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--line);
        }

        .item-title {
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 0.25rem;
        }

        .item-qty {
          font-size: 0.85rem;
          color: var(--muted);
        }

        .item-price {
          font-weight: 700;
          color: #48bb78;
        }

        .summary-divider {
          height: 1px;
          background: var(--line);
          margin: 1rem 0;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          color: var(--muted);
        }

        .summary-line .free {
          color: #48bb78;
          font-weight: 600;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--ink);
          margin-top: 1rem;
        }

        .link-button {
          display: inline-block;
          margin-top: 2rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061021;
          border: 1px solid transparent;
          border-radius: 999px;
          font-weight: 600;
        }

        @media (max-width: 968px) {
          .checkout-content {
            grid-template-columns: 1fr;
          }

          .order-summary {
            position: static;
          }

          .payment-methods {
            grid-template-columns: 1fr;
          }

          .form-row {
            flex-direction: column;
          }

          .form-actions {
            flex-direction: column;
          }

          .simulacao-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

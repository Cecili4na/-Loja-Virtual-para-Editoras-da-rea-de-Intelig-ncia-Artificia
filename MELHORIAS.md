# 📚 COMPIA Editora - E-commerce de Livros de IA

Plataforma de e-commerce moderna para a COMPIA Editora, especializada em livros sobre Inteligência Artificial, Machine Learning e tecnologias emergentes.

## ✨ Funcionalidades Implementadas

### 🎨 Design Moderno e Responsivo
- Interface visual completamente refatorada com gradientes e animações
- Design responsivo para desktop, tablet e mobile
- Paleta de cores moderna e consistente
- Componentes reutilizáveis (Header, Footer, ProdutoCard)

### 🛒 Gestão de Carrinho
- Context API para gerenciamento global de estado
- Adicionar/remover produtos do carrinho
- Atualizar quantidades
- Cálculo automático de totais
- Badge no header indicando quantidade de itens

### 📦 Catálogo de Produtos
- Grid responsivo de produtos
- Filtros por tipo (Físico/E-book)
- Ordenação por nome e preço
- 8 produtos cadastrados
- Indicadores visuais de tipo de produto

### 💳 Sistema de Checkout (Mockado)
- Formulário de dados pessoais e endereço
- Múltiplas opções de pagamento:
  - **Cartão de Crédito** - Formulário completo com validação
  - **PIX** - Pagamento instantâneo (mockado)
  - **Boleto** - Geração de boleto (mockado)
- Fluxo em duas etapas (Dados → Pagamento)
- Resumo do pedido sempre visível

### ✅ Confirmação de Pedido
- Página de confirmação com número do pedido
- Status visual do processo de entrega
- Informações sobre prazo e acompanhamento
- Ações para continuar comprando

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Acessar aplicação
# http://localhost:3003
```

## 📁 Estrutura do Projeto

```
app/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx      # Cabeçalho com navegação
│   ├── Footer.tsx      # Rodapé
│   └── ProdutoCard.tsx # Card de produto
├── contexts/           # Context API
│   └── CarrinhoContext.tsx  # Gestão do carrinho
├── data/              # Dados mockados
│   └── produtos.ts    # Lista de produtos
├── carrinho/          # Página do carrinho
├── checkout/          # Página de checkout
├── confirmacao/       # Página de confirmação
├── produtos/          # Página de catálogo
├── layout.tsx         # Layout principal
├── page.tsx           # Página inicial
└── globals.css        # Estilos globais
```

## 🎯 Melhorias Implementadas

### Visual
- ✅ Gradientes modernos (roxo/azul)
- ✅ Animações suaves de hover e transição
- ✅ Sombras e bordas arredondadas
- ✅ Ícones emoji para melhor UX
- ✅ Tipografia hierárquica clara
- ✅ Espaçamento consistente

### Funcionalidade
- ✅ Gestão de estado global com Context API
- ✅ Carrinho funcional com CRUD completo
- ✅ Filtros e ordenação de produtos
- ✅ Sistema de pagamento mockado
- ✅ Fluxo completo de compra
- ✅ Feedback visual em todas as ações

### UX
- ✅ Loading states
- ✅ Mensagens de confirmação
- ✅ Navegação intuitiva
- ✅ Responsividade completa
- ✅ Indicadores visuais claros

## 🔧 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **CSS-in-JS** (styled-jsx) - Estilos encapsulados
- **Context API** - Gerenciamento de estado

## 💡 Próximas Melhorias Sugeridas

- [ ] Integração com API real de produtos
- [ ] Sistema de autenticação
- [ ] Histórico de pedidos
- [ ] Sistema de avaliações
- [ ] Wishlist (lista de desejos)
- [ ] Busca avançada de produtos
- [ ] Filtros adicionais (autor, categoria, preço)
- [ ] Integração com gateway de pagamento real
- [ ] Sistema de cupons de desconto

## 📝 Notas

Este é um projeto educacional com sistema de pagamento mockado. Todos os processos de pagamento são simulados e não realizam transações reais.

---

Desenvolvido com ❤️ para o curso de Programação Web

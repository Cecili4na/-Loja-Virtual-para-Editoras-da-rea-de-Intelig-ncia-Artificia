'use client'

import './globals.css'
import { CarrinhoProvider } from './contexts/CarrinhoContext'
import { ProdutosProvider } from './contexts/ProdutosContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ProdutosProvider>
          <CarrinhoProvider>
            {children}
          </CarrinhoProvider>
        </ProdutosProvider>
      </body>
    </html>
  )
}

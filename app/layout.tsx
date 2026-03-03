import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from './providers'

export const metadata: Metadata = {
  title: 'COMPIA Editora - Livros de Inteligência Artificial',
  description: 'Plataforma de e-commerce da COMPIA Editora',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}

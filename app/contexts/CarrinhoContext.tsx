'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Produto {
  id: number
  titulo: string
  autor: string
  preco: number
  tipo: 'fisico' | 'digital'
  imagem: string
}

export interface ItemCarrinho extends Produto {
  quantidade: number
}

interface CarrinhoContextType {
  itens: ItemCarrinho[]
  adicionarAoCarrinho: (produto: Produto) => void
  removerDoCarrinho: (id: number) => void
  atualizarQuantidade: (id: number, quantidade: number) => void
  limparCarrinho: () => void
  total: number
  quantidadeTotal: number
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined)

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([])

  const adicionarAoCarrinho = (produto: Produto) => {
    setItens((itensAtuais) => {
      const itemExistente = itensAtuais.find((item) => item.id === produto.id)
      
      if (itemExistente) {
        return itensAtuais.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      }
      
      return [...itensAtuais, { ...produto, quantidade: 1 }]
    })
  }

  const removerDoCarrinho = (id: number) => {
    setItens((itensAtuais) => itensAtuais.filter((item) => item.id !== id))
  }

  const atualizarQuantidade = (id: number, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(id)
      return
    }
    
    setItens((itensAtuais) =>
      itensAtuais.map((item) =>
        item.id === id ? { ...item, quantidade } : item
      )
    )
  }

  const limparCarrinho = () => {
    setItens([])
  }

  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0)
  const quantidadeTotal = itens.reduce((acc, item) => acc + item.quantidade, 0)

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho,
        total,
        quantidadeTotal,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  )
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext)
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider')
  }
  return context
}

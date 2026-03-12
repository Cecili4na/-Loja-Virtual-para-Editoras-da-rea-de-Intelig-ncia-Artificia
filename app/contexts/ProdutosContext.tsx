'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Produto } from './CarrinhoContext'
import { produtos as produtosIniciais } from '../data/produtos'

interface NovoProdutoInput {
  titulo: string
  autor: string
  preco: number
  tipo: 'fisico' | 'digital'
  imagem: string
}

interface ProdutosContextType {
  produtos: Produto[]
  adicionarProduto: (produto: NovoProdutoInput) => void
  adminAtivo: boolean
  ativarAdmin: (senha: string) => boolean
  desativarAdmin: () => void
}

const PRODUTOS_STORAGE_KEY = 'compia-produtos'
const ADMIN_STORAGE_KEY = 'compia-admin-enabled'
const ADMIN_PASSWORD = 'admin123'

const ProdutosContext = createContext<ProdutosContextType | undefined>(undefined)

export function ProdutosProvider({ children }: { children: React.ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais)
  const [adminAtivo, setAdminAtivo] = useState(false)

  useEffect(() => {
    const produtosSalvos = window.localStorage.getItem(PRODUTOS_STORAGE_KEY)
    const adminSalvo = window.localStorage.getItem(ADMIN_STORAGE_KEY)

    if (produtosSalvos) {
      try {
        const parsed = JSON.parse(produtosSalvos) as Produto[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProdutos(parsed)
        }
      } catch {
        window.localStorage.removeItem(PRODUTOS_STORAGE_KEY)
      }
    }

    if (adminSalvo === 'true') {
      setAdminAtivo(true)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(produtos))
  }, [produtos])

  const adicionarProduto = (produto: NovoProdutoInput) => {
    setProdutos((produtosAtuais) => {
      const maiorId = produtosAtuais.reduce((maior, item) => Math.max(maior, item.id), 0)
      const novoProduto: Produto = {
        id: maiorId + 1,
        ...produto,
      }

      return [novoProduto, ...produtosAtuais]
    })
  }

  const ativarAdmin = (senha: string) => {
    if (senha !== ADMIN_PASSWORD) {
      return false
    }

    setAdminAtivo(true)
    window.localStorage.setItem(ADMIN_STORAGE_KEY, 'true')
    return true
  }

  const desativarAdmin = () => {
    setAdminAtivo(false)
    window.localStorage.removeItem(ADMIN_STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      produtos,
      adicionarProduto,
      adminAtivo,
      ativarAdmin,
      desativarAdmin,
    }),
    [produtos, adminAtivo]
  )

  return <ProdutosContext.Provider value={value}>{children}</ProdutosContext.Provider>
}

export function useProdutos() {
  const context = useContext(ProdutosContext)

  if (!context) {
    throw new Error('useProdutos deve ser usado dentro de um ProdutosProvider')
  }

  return context
}

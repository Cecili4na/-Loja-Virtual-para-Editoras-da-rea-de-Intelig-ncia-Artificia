export type ProductType = "fisico" | "ebook" | "kit";

export type Product = {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  tipo: ProductType;
  precoCents: number;
  imagens: string[];
  categorias: string[];
  tags: string[];
  estoqueQty: number | null; // null = ilimitado (ex.: ebook)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Kits (opcional)
  components?: Array<{ productId: string; qty: number }>;
};

export type CartItem = {
  productId: string;
  titulo: string;
  tipo: ProductType;
  unitPriceCents: number;
  imagem?: string;
  qty: number;
};

export type CheckoutQuoteRequest = {
  items: Array<{ productId: string; qty: number }>;
  cep?: string;
  deliveryMethod: "entrega" | "retirada";
};

export type CheckoutQuoteResponse = {
  currency: "BRL";
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  hasPhysical: boolean;
};

export type ProductType = "fisico" | "digital" | "kit";

export type CheckoutQuoteRequest = {
  items: Array<{ id: number; quantidade: number; tipo: ProductType; preco: number }>;
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

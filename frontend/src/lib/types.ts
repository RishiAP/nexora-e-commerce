// Shared types for frontend state and API shapes

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
}

export type ProductRef = Product | string; // populated product or id string

export interface CartItem {
  product: ProductRef;
  quantity: number;
}

export interface Cart {
  products: CartItem[];
  total?: number;
}

export interface OrderLineItem {
  product: ProductRef;
  quantity: number;
}

export interface OrderReceipt {
  _id?: string;
  products?: OrderLineItem[];
  total?: number;
  // timestamp may come in different shapes from API
  timestamps?: number | string | Date;
}

export interface QtyChange {
  id: string;
  newQty: number;
  original: number;
}

// Type guards and helpers
export function isProduct(ref: ProductRef): ref is Product {
  return typeof ref === "object" && ref !== null;
}

export function getProductId(ref: ProductRef): string {
  if (typeof ref === "string") return ref;
  return ref._id ?? ref.id ?? "";
}

export function getProductPrice(ref: ProductRef): number | undefined {
  return isProduct(ref) ? ref.price : undefined;
}

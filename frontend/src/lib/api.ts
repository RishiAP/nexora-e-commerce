"use client";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export async function getProducts() {
  const res = await fetch(`${BASE}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getCart() {
  const res = await fetch(`${BASE}/api/cart`);
  if (!res.ok) return null;
  return res.json();
}

export async function addToCart(productId: string, qty = 1) {
  const res = await fetch(`${BASE}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product: productId, quantity: qty }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}

export async function removeFromCart(productId: string) {
  const res = await fetch(`${BASE}/api/cart/${productId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove from cart");
  return res.json();
}

export async function checkout(cartItems: Array<{ product: string; quantity: number }>) {
  const res = await fetch(`${BASE}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartItems }),
  });
  if (!res.ok) throw new Error("Checkout failed");
  return res.json();
}

"use client";

import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

// Configure axios defaults
const api = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in all requests
});

export async function getProducts() {
  const res = await api.get("/api/products");
  return res.data;
}

export async function getCart() {
  try {
    const res = await api.get("/api/cart");
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function addToCart(productId: string, qty = 1) {
  const res = await api.post("/api/cart", {
    product: productId,
    quantity: qty,
  });
  return res.data;
}

export async function removeFromCart(productId: string) {
  const res = await api.delete(`/api/cart/${productId}`);
  return res.data;
}

export async function checkout(cartItems: Array<{ product: string; quantity: number }>) {
  const res = await api.post("/api/checkout", { cartItems });
  return res.data;
}

// Theme API functions
export async function setTheme(theme: "light" | "dark") {
  const res = await api.post("/api/theme", { theme });
  return res.data;
}

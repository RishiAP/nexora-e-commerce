const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export async function getProductsServer() {
  const res = await fetch(`${BASE}/api/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getCartServer() {
  const res = await fetch(`${BASE}/api/cart`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import CartPanel from "./CartPanel";
import Modal from "./Modal";
import { Input } from "./ui/input";
import { addToCart, removeFromCart, checkout } from "@/lib/api";
import { toast } from "sonner";

export default function InteractiveArea({ products, cart: initialCart }: { products: any[]; cart: any | null }) {
  const [cart, setCart] = useState(initialCart);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [receipt, setReceipt] = useState<any | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  function setQty(id: string, val: number) {
    setQuantities((q) => ({ ...q, [id]: val }));
  }

  async function handleAdd(id: string, qty?: number) {
    const useQty = typeof qty === "number" ? qty : quantities[id] ?? 1;
    
    // Optimistically update cart
    setCart((prevCart: any) => {
      const product = products.find(p => p._id === id);
      if (!product) return prevCart;
      
      if (!prevCart || !prevCart.products) {
        return {
          products: [{ product, quantity: useQty }],
          total: product.price * useQty
        };
      }
      
      const existingItemIndex = prevCart.products.findIndex(
        (item: any) => (item.product._id || item.product) === id
      );
      
      const newProducts = [...prevCart.products];
      if (existingItemIndex >= 0) {
        newProducts[existingItemIndex] = {
          ...newProducts[existingItemIndex],
          quantity: newProducts[existingItemIndex].quantity + useQty
        };
      } else {
        newProducts.push({ product, quantity: useQty });
      }
      
      const total = newProducts.reduce((acc: number, item: any) => {
        const price = item.product?.price ?? 0;
        return acc + price * item.quantity;
      }, 0);
      
      return { ...prevCart, products: newProducts, total };
    });
    
    // Send request in background
    addToCart(id, useQty).catch(err => {
      console.error(err);
      toast.error("Failed to sync cart with server");
    });
  }

  async function handleRemove(id: string) {
    // Optimistically remove from cart
    setCart((prevCart: any) => {
      if (!prevCart || !prevCart.products) return prevCart;
      
      const newProducts = prevCart.products.filter(
        (item: any) => (item.product._id || item.product) !== id
      );
      
      const total = newProducts.reduce((acc: number, item: any) => {
        const price = item.product?.price ?? 0;
        return acc + price * item.quantity;
      }, 0);
      
      return { ...prevCart, products: newProducts, total };
    });
    
    // Send request in background
    removeFromCart(id).catch(err => {
      console.error(err);
      toast.error("Failed to sync cart with server");
    });
  }

  async function handleUpdate(id: string, newQty: number, currentQty: number) {
    const diff = newQty - currentQty;
    if (diff === 0) return;
    
    // Optimistically update cart
    setCart((prevCart: any) => {
      if (!prevCart || !prevCart.products) return prevCart;
      
      let newProducts = [...prevCart.products];
      
      if (newQty === 0) {
        // Remove item
        newProducts = newProducts.filter(
          (item: any) => (item.product._id || item.product) !== id
        );
      } else {
        // Update quantity
        const itemIndex = newProducts.findIndex(
          (item: any) => (item.product._id || item.product) === id
        );
        
        if (itemIndex >= 0) {
          newProducts[itemIndex] = {
            ...newProducts[itemIndex],
            quantity: newQty
          };
        }
      }
      
      const total = newProducts.reduce((acc: number, item: any) => {
        const price = item.product?.price ?? 0;
        return acc + price * item.quantity;
      }, 0);
      
      return { ...prevCart, products: newProducts, total };
    });
    
    // Send request in background
    try {
      if (newQty === 0) {
        await removeFromCart(id);
      } else {
        await addToCart(id, diff);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cart || !cart.products || cart.products.length === 0) return;
    try {
      setCheckingOut(true);
      const cartItems = cart.products.map((it: any) => ({ product: it.product._id || it.product, quantity: it.quantity }));
      const res = await checkout(cartItems);
      setReceipt(res.order ?? res);
      setShowReceipt(true);
      toast.success("Payment successful! Order placed.");
      
      // Clear cart after successful checkout
      setCart({ products: [], total: 0 });
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    } finally {
      // brief delay so spinner is perceptible
      setTimeout(() => setCheckingOut(false), 400);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2">
        <h2 className="text-lg font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p._id || p.id} className="space-y-2">
              <ProductCard product={p} onAdd={(id, qty) => handleAdd(id, qty)} />
            </div>
          ))}
        </div>
      </section>

      <aside className="lg:col-span-1">
        <CartPanel cart={cart} onRemove={handleRemove} onApplyChanges={async (changes) => {
          try {
            // Optimistically update all changes
            for (const c of changes) {
              await handleUpdate(c.id, c.newQty, c.original);
            }
          } catch (err) {
            console.error(err);
            toast.error("Failed to update cart");
          }
        }} />
        {/** Checkout form disabled when cart empty **/}
        <form
          className="mt-4"
          onSubmit={handleCheckout}
          aria-disabled={!cart || !cart.products || cart.products.length === 0}
        >
          <h3 className="font-medium flex items-center justify-between">
            <span>Checkout</span>
            {(!cart || !cart.products || cart.products.length === 0) && (
              <span className="text-xs text-muted-foreground">Cart empty</span>
            )}
          </h3>
          <div className="mt-2">
            <label className="block text-sm">Name</label>
            <Input
              required
              className="mt-1"
              name="name"
              disabled={!cart || !cart.products || cart.products.length === 0}
            />
          </div>
            <div className="mt-2">
            <label className="block text-sm">Email</label>
            <Input
              required
              type="email"
              className="mt-1"
              name="email"
              disabled={!cart || !cart.products || cart.products.length === 0}
            />
          </div>
          <button
            type="submit"
            disabled={!cart || !cart.products || cart.products.length === 0 || checkingOut}
            className="mt-3 w-full px-3 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingOut ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <Loader2 className="animate-spin" /> Processing...
              </span>
            ) : (
              "Pay (mock)"
            )}
          </button>
        </form>

        <Modal open={showReceipt} onClose={() => setShowReceipt(false)}>
          <div>
            <h3 className="text-lg font-semibold">Receipt</h3>
            <div className="mt-2 text-sm text-muted-foreground">Order ID: {receipt?._id}</div>
            <div className="text-sm">Time: {receipt ? new Date(receipt.timestamps || Date.now()).toLocaleString() : "-"}</div>
            <div className="mt-3">
              <h4 className="font-medium">Items</h4>
              <ul className="mt-2 space-y-2">
                {receipt?.products?.map((it: any) => {
                  const prodId = it.product?._id || it.product;
                  const prod = products.find((p) => p._id === prodId || p.id === prodId) || { name: prodId, price: 0 };
                  return (
                    <li key={prodId} className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{prod.name}</div>
                        <div className="text-sm text-muted-foreground">Qty: {it.quantity}</div>
                      </div>
                      <div className="font-medium">${((prod.price ?? 0) * it.quantity).toFixed(2)}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="mt-4 border-t pt-3 flex items-center justify-between">
              <div className="font-semibold">Total</div>
              <div className="font-medium">${receipt?.total?.toFixed(2) ?? "-"}</div>
            </div>
          </div>
        </Modal>
      </aside>
    </div>
  );
}

import React from "react";
import { getProductsServer, getCartServer } from "@/lib/serverApi";
import InteractiveArea from "@/components/InteractiveArea";

export default async function Home() {
  const products = await getProductsServer();
  const cart = await getCartServer();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Vibe Commerce — Mock Cart</h1>
      </header>

      <InteractiveArea products={products} cart={cart} />
    </main>
  );
}

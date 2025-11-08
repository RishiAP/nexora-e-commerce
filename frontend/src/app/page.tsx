import React from "react";
import { getProductsServer, getCartServer } from "@/lib/serverApi";
import InteractiveArea from "@/components/InteractiveArea";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cookies } from "next/headers";

export default async function Home() {
  const products = await getProductsServer();
  const cart = await getCartServer();
  
  // Get current theme from cookies
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  const theme = themeCookie?.value === "dark" ? "dark" : "light";

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Vibe Commerce — Mock Cart</h1>
        <ThemeToggle initialTheme={theme} />
      </header>

      <InteractiveArea products={products} cart={cart} />
    </main>
  );
}

import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexora E-Commerce",
  description: "Modern e-commerce platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read theme from cookies server-side
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  const theme = themeCookie?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <body className={`antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

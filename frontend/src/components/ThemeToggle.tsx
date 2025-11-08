"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setTheme } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ThemeToggle({ initialTheme }: { initialTheme: "light" | "dark" }) {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(initialTheme);
  const router = useRouter();

  const toggleTheme = async () => {
    // Immediately toggle theme in UI
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    
    // Apply to document immediately
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Set theme cookie via API in background (fire and forget)
    setTheme(newTheme).catch((error) => {
      console.error("Failed to save theme to server:", error);
      // Don't revert - keep the UI theme change regardless of API response
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} mode`}
      className="relative"
    >
      {currentTheme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

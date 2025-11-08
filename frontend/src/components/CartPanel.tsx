"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useState, useEffect, useRef } from "react";

export default function CartPanel({
  cart,
  onRemove,
  onApplyChanges,
  removingIds,
  isUpdating,
}: {
  cart: any | null;
  onRemove: (id: string) => void;
  onApplyChanges?: (changes: Array<{ id: string; newQty: number; original: number }>) => void;
  // map of productId -> true when that item is being removed
  removingIds?: Record<string, boolean>;
  // true when the cart update batch is in progress
  isUpdating?: boolean;
}) {
  const [localQty, setLocalQty] = useState<Record<string, number>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [animatedItems, setAnimatedItems] = useState<Record<string, boolean>>({});
  const animateClearTimers = useRef<Record<string, number>>({});
  // local updating state so spinner shows even if parent doesn't provide isUpdating
  const [localUpdating, setLocalUpdating] = useState(false);

  useEffect(() => {
    if (!cart || !cart.products) return;
    const map: Record<string, number> = {};
    cart.products.forEach((it: any) => {
      const id = it.product._id || it.product;
      map[id] = it.quantity;
    });
    setLocalQty(map);
    setHasChanges(false);
    setAnimatedItems({});
  }, [cart]);
  if (!cart || !cart.products) {
    return (
      <Card>
        <CardContent>
          <CardTitle>Cart</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">No items</p>
        </CardContent>
      </Card>
    );
  }

  // If cart exists but has zero products, show friendly empty state inside the card
  if (Array.isArray(cart.products) && cart.products.length === 0) {
    return (
      <Card>
        <CardContent>
          <CardTitle>Cart</CardTitle>
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="text-lg font-medium">Your cart is empty</div>
            <p className="text-sm text-muted-foreground text-center">Add products to your cart to see them here and enable checkout.</p>
            <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">🛒</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = cart.products.reduce((acc: number, item: any) => {
    const price = item.product?.price ?? 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <Card>
      <CardContent>
        <CardTitle>Cart</CardTitle>
        <div className="mt-3 space-y-3">
          {cart.products.map((item: any) => {
            const id = item.product._id || item.product;
            const isRemoving = !!removingIds?.[id];
            const changed = (localQty[id] ?? item.quantity) !== item.quantity;
            const itemAnimating = !!animatedItems[id];
            return (
              <div
                key={id}
                className={
                  "flex items-center justify-between gap-4 transition-all duration-300 ease-in-out " +
                  (isUpdating ? "opacity-80 transform scale-100" : "opacity-100")
                }
              >
                <div className="flex-1">
                  <div className="font-semibold">{item.product?.name}</div>
                  <div className="text-sm text-muted-foreground">${(item.product?.price ?? 0).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={localQty[id] ?? item.quantity}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value) || 0);
                      setLocalQty((s) => ({ ...s, [id]: val }));
                      setHasChanges(true);
                      // trigger brief highlight animation for this item
                      setAnimatedItems((s) => ({ ...s, [id]: true }));
                      if (animateClearTimers.current[id]) {
                        window.clearTimeout(animateClearTimers.current[id]);
                      }
                      animateClearTimers.current[id] = window.setTimeout(() => {
                        setAnimatedItems((s) => {
                          const copy = { ...s };
                          delete copy[id];
                          return copy;
                        });
                        delete animateClearTimers.current[id];
                      }, 500);
                    }}
                    className={
                      "w-20 border rounded px-2 py-1 transition-shadow duration-200 " +
                      (changed || itemAnimating ? "shadow-md ring-2 ring-primary/40" : "")
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      try {
                        await Promise.resolve(onRemove(id));
                        toast.success("Item removed from cart");
                      } catch (err) {
                        console.error(err);
                        toast.error("Failed to remove item");
                      }
                    }}
                    className={isRemoving ? "opacity-80 animate-pulse" : undefined}
                    disabled={isRemoving}
                  >
                    {isRemoving ? "Removing..." : "Remove"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant="default"
            size="sm"
            disabled={!hasChanges || localUpdating || !!isUpdating}
            onClick={async () => {
              if (!onApplyChanges || localUpdating || isUpdating) return;
              const changes = Object.entries(localQty)
                .map(([id, newQty]) => {
                  const original = cart.products.find((p: any) => (p.product._id || p.product) === id)?.quantity ?? 0;
                  return { id, newQty, original };
                })
                .filter((c: any) => c.newQty !== c.original);
              if (changes.length === 0) return;
              try {
                setLocalUpdating(true);
                await Promise.resolve(onApplyChanges(changes));
                toast.success("Cart updated successfully");
              } catch (err) {
                console.error(err);
                toast.error("Failed to update cart");
              } finally {
                // short delay for perceptible spinner
                setTimeout(() => setLocalUpdating(false), 300);
              }
            }}
            className={(localUpdating || isUpdating) ? "transform scale-95" : undefined}
          >
            {(localUpdating || isUpdating) ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" /> Updating...
              </span>
            ) : (
              "Update Cart"
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="font-semibold">Total</div>
          <div className="font-medium">${total.toFixed(2)}</div>
        </div>
      </CardFooter>
    </Card>
  );
}

"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductCard({
  product,
  onAdd,
  isAdding,
}: {
  product: { _id?: string; name: string; price: number };
  onAdd: (id: string, qty: number) => void;
  isAdding?: boolean;
}) {
  // keep the input as a string so the user can backspace and type freely
  const [qtyStr, setQtyStr] = React.useState<string>("1");
  // local loading to show a visible spinner icon regardless of parent state
  const [loading, setLoading] = React.useState<boolean>(false);

  const qty = Math.max(1, parseInt(qtyStr || "0", 10));

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardContent>
        <div className="flex items-center justify-between">
          <CardTitle className="mb-0">{product.name}</CardTitle>
          <div className="text-sm text-muted-foreground">${product.price.toFixed(2)}</div>
        </div>
      </CardContent>
      <div className="px-6">
        <div className="flex items-center justify-between gap-3">
          <input
            aria-label={`quantity-${product._id}`}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={1}
            value={qtyStr}
            onChange={(e) => {
              const v = e.target.value;
              // allow empty string so user can backspace
              if (v === "") {
                setQtyStr("");
                return;
              }
              // only accept digits
              if (/^\d+$/.test(v)) {
                setQtyStr(v.replace(/^0+(?!$)/, "")); // strip leading zeros but keep single 0 if typed
              }
            }}
            onBlur={() => {
              // normalize empty or zero to 1 for adding
              if (!qtyStr || parseInt(qtyStr || "0", 10) < 1) {
                setQtyStr("1");
              }
            }}
            className="w-20 border rounded px-2 py-1"
          />
          <Button
            onClick={async () => {
              if (!product._id) return;
              try {
                setLoading(true);
                // handle both sync and async onAdd
                await Promise.resolve(onAdd(product._id, qty));
                toast.success(`Added ${qty} ${qty > 1 ? 'items' : 'item'} to cart`);
              } catch (err) {
                console.error(err);
                toast.error("Failed to add item to cart");
              } finally {
                // keep spinner visible a bit for feedback
                setTimeout(() => setLoading(false), 400);
              }
            }}
            className={isAdding || loading ? "transform scale-95" : undefined}
            disabled={isAdding || loading}
          >
            {isAdding || loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Adding...
              </span>
            ) : (
              `Add ${qty > 1 ? `${qty} items` : `item`}`
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

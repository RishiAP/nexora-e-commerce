"use client";

import React from "react";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-background text-foreground rounded-lg shadow-lg border p-6">
          <div className="flex justify-end">
            <button onClick={onClose} className="text-muted-foreground">Close</button>
          </div>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

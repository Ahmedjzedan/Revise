"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #444",
        },
      }}
    />
  );
}

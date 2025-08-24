"use client"; // <-- This wrapper needs client-side features

import { usePathname } from "next/navigation"; // Import usePathname here

// This component wraps the main content and applies classes based on pathname
export default function LayoutContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Use usePathname here

  return (
    <main
      className={
        pathname === "/"
          ? "overflow-hidden"
          : "grid grid-rows-[1fr] grid-cols-[2fr_auto_8fr] w-full h-screen overflow-hidden"
      }
    >
      {children} {/* This will render ClientHeader and the rest of the page */}
    </main>
  );
}

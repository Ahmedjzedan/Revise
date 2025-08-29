"use client"; // <-- This wrapper needs client-side features

import { usePathname } from "next/navigation"; // Import usePathname here
import path from "path";

// This component wraps the main content and applies classes based on pathname
function LayoutContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Use usePathname here

  return (
    <main
      className={
        pathname === "/"
          ? ""
          : pathname === "/TEST"
          ? ""
          : pathname === "/login"
          ? ""
          : pathname === "/signup"
          ? ""
          : "grid grid-rows-[1fr] grid-cols-[2fr_auto_8fr] w-full h-screen overflow-hidden"
      }
    >
      {children}
    </main>
  );
}
export default LayoutContentWrapper;

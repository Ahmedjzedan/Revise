"use client";

import { usePathname } from "next/navigation";
import React from "react";

function LayoutContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main
      className={
        pathname === "/TEST"
          ? ""
          : pathname === "/login"
          ? ""
          : pathname === "/signup"
          ? ""
          : "grid grid-rows-[1fr] grid-cols-[1fr] md:grid-cols-[250px_auto_1fr] w-full h-screen overflow-hidden"
      }
    >
      {children}
    </main>
  );
}

export default LayoutContentWrapper;

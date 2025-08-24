// app/components/Layout/ClientHeader.tsx
"use client"; // <-- This component needs client-side features

import Link from "next/link";
import Image from "next/image";
import OpenBookIcon from "@/public/svgs/openbook.svg"; // Assuming this path is correct
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function ClientHeader() {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  // Motion variants for the title animation
  const titleVariants = {
    current: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8 },
    },
    nav: {
      opacity: 1,
      scale: 0.7,
      transition: { duration: 0.8 },
    },
  };

  return (
    <header
      className={
        pathname === "/"
          ? "relative flex flex-col justify-center items-center space-y-1 my-20"
          : "relative flex flex-col justify-center items-center row-start-1 col-start-1 col-span-1 pb-5"
      }
    >
      {/* Loads the flickers blur only on main menu - uses motion */}
      {pathname === "/" && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-neutral-300/70 blur-3xl -z-10 rounded-full"
          initial={{ opacity: 0.0 }}
          animate={{
            opacity: [0.3, 1.0, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        ></motion.div>
      )}
      {/* Title and Logo - uses motion layout and variants */}
      <motion.div
        className="relative z-10 flex flex-col items-center p-5"
        layout // Requires motion
        variants={titleVariants}
        initial={currentPath === "/" ? "current" : "nav"}
        animate={pathname === "/" ? "current" : "nav"}
      >
        <Image src={OpenBookIcon} height={50} width={50} alt="Open book logo" />
        <Link href={"/"} className="text-5xl text-white">
          Revise
        </Link>
      </motion.div>
      {/* Border animation - uses motion */}
      {pathname !== "/" && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "70%" }}
          transition={{ duration: 1 }}
          className="w-2/3 border-1"
        ></motion.div>
      )}
    </header>
  );
}

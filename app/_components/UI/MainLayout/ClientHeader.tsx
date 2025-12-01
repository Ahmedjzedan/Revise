"use client";

import Link from "next/link";
import Image from "next/image";
import OpenBookIcon from "@/public/svgs/openbook.svg";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import ReviseLogo from "../ReviseLogo";

export default function ClientHeader() {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

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
        pathname === "/login" || pathname === "/signup"
          ? "absolute top-0 left-0 m-8 flex flex-row items-center gap-4 z-50 pointer-events-none"
          : "relative flex flex-col justify-start items-center row-start-1 col-start-1 col-span-1 sticky top-0 z-50 mt-4 mb-8 pointer-events-none"
      }
    >
      <motion.div
        className={
          pathname === "/login" || pathname === "/signup"
            ? "flex flex-row items-center gap-3 pointer-events-auto"
            : "relative z-10 flex flex-col items-center p-2 pointer-events-auto"
        }
        layout
        variants={titleVariants}
        initial="nav"
        animate="nav"
      >
        <ReviseLogo isAuthPage={pathname === "/login" || pathname === "/signup"} />
      </motion.div>
      {pathname !== "/login" && pathname !== "/signup" && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "70%" }}
          transition={{ duration: 1 }}
          className="w-2/3 border-b border-[var(--border-color)]"
        ></motion.div>
      )}
    </header>
  );
}

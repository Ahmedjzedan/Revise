"use client";

import Link from "next/link";
import Image from "next/image";
import OpenBookIcon from "@/public/svgs/openbook.svg";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
          ? "absolute top-0 left-0 m-8 flex flex-row items-center gap-4 z-50"
          : "relative flex flex-col justify-start items-center row-start-1 col-start-1 col-span-1 sticky top-0 z-50 pt-8"
      }
    >
      <motion.div
        className={
          pathname === "/login" || pathname === "/signup"
            ? "flex flex-row items-center gap-3"
            : "relative z-10 flex flex-col items-center p-5"
        }
        layout
        variants={titleVariants}
        initial="nav"
        animate="nav"
      >
        <Image 
          src={OpenBookIcon} 
          height={pathname === "/login" || pathname === "/signup" ? 40 : 50} 
          width={pathname === "/login" || pathname === "/signup" ? 40 : 50} 
          alt="Open book logo" 
        />
        <Link 
          href={"/"} 
          className={
            pathname === "/login" || pathname === "/signup"
              ? "text-4xl text-white font-light tracking-wide"
              : "text-5xl text-white"
          }
        >
          Revise
        </Link>
      </motion.div>
      {pathname !== "/login" && pathname !== "/signup" && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "70%" }}
          transition={{ duration: 1 }}
          className="w-2/3 border-1 mb-4"
        ></motion.div>
      )}
    </header>
  );
}

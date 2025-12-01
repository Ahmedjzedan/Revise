"use client";

import Link from "next/link";
import Image from "next/image";
import OpenBookIcon from "@/public/svgs/openbook.svg";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { getCurrentUser } from "@/app/_utils/userActions";
import ReviseLogo from "../ReviseLogo";

interface ClientHeaderProps {
  userId?: string | null;
}

export default function ClientHeader({ userId: initialUserId }: ClientHeaderProps) {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);
  const [userId, setUserId] = useState<string | null>(initialUserId || null);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  useEffect(() => {
    // If we don't have a userId, or if we want to re-validate on mount/navigation
    // Let's fetch it.
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserId(user.id.toString());
        } else {
          setUserId(null);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    
    fetchUser();
  }, [pathname]); // Re-fetch on path change to be safe, or just once on mount? Path change is safer for login/logout flows that might not reload.

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
        <ReviseLogo isAuthPage={pathname === "/login" || pathname === "/signup"} userId={userId} />
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

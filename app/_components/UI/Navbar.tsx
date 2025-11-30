"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-black/50 backdrop-blur-sm">
      <Link href="/">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold tracking-widest text-white cursor-pointer"
        >
          REVISE
        </motion.div>
      </Link>
    </nav>
  );
};

export default Navbar;

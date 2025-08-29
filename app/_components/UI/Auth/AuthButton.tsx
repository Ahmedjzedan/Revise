"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type AuthButtonProps = {
  name: string;
  path: string;
};

const AuthButton: React.FC<AuthButtonProps> = ({ name, path }) => {
  return (
    <Link href={path}>
      <motion.button
        className="text-xl hover:shadow-2xl transition-all duration-300 hover:scale-110
           hover:cursor-pointer focus:text-white"
        type="button"
      >
        {name}
      </motion.button>
    </Link>
  );
};

export default AuthButton;

"use client";

import { motion } from "framer-motion";

export default function MotionBorder() {
  return (
    <motion.div
      className="h-full row-start-1 row-span-2 border-1 border-white"
      initial={{ height: 0 }}
      animate={{ height: "100%" }}
      transition={{ duration: 1 }}
    ></motion.div>
  );
}

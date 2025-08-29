"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { updateNodeFullnessAction } from "@/app/_utils/sActions";

interface SideBarElementProps {
  id: string;
  active?: boolean;
  addbtn?: boolean;
  isChild?: boolean;
  children?: React.ReactNode;
  title?: string;
  onUpdate: (id: string, newFill: number) => void;
}

const MainContentElement: React.FC<
  SideBarElementProps & { fillProp?: number; maxFillProp?: number }
> = ({
  active = false,
  children,
  isChild = false,
  title,
  fillProp = 0,
  maxFillProp = 5,
  id,
  onUpdate,
}) => {
  const [maxFill, setMaxFill] = useState(maxFillProp);
  const [fill, setFill] = useState(fillProp > maxFill ? maxFill : fillProp);

  var widthFill = (fill / maxFill) * 100;
  return (
    <button
      className={
        `group relative flex items-center justify-between h-20 rounded-xl border-white hover:bg-neutral-400
                  mx-10 text-2xl px-10 cursor-pointer bg-[#2C2C2C] z-0 transition-all duration-500 hover:scale-101
                  overflow-hidden shadow-[inset_0_0_0_2px_white]  ` +
        (isChild ? "mb-2 last:mb-0" : "mt-5")
      }
      onClick={() => {
        if (fill < maxFill) {
          setFill(fill + 1);
          updateNodeFullnessAction(Number(id), fill + 1);
          if (isChild) {
            onUpdate(id, fill + 1);
          }
        }
      }}
    >
      <motion.div
        className={
          `absolute inset-0 group-hover:bg-neutral-400 bg-black z-1 ` +
          (fill === maxFill ? "rounded-xl" : "rounded-l-xl rounded-r-[0px]")
        }
        initial={{ width: 0 }}
        animate={{ width: `${widthFill}%` }}
        transition={{ duration: 0.5, ease: "linear" }}
      ></motion.div>
      <motion.div
        className={
          `absolute inset-0 backdrop-invert-100 z-10 ` +
          (fill === maxFill
            ? "rounded-l-[12px] rounded-r-[12px]"
            : "rounded-l-[12px] rounded-r-[0px]")
        }
        initial={{ width: 0 }}
        animate={{ width: `${widthFill}%` }}
        transition={{ duration: 0.5, ease: "linear" }}
      ></motion.div>
      <span className="z-2 transition-colors duration-300 text-white group-hover:text-black">
        {title}
      </span>

      <span
        className="text-md px-4 py-2 flex items-center justify-center rounded-md bg-white text-neutral-900 z-2
                 group-hover:bg-black group-hover:text-white group-hover:text- transition-all duration-500"
      >
        {fill} / {maxFill}
      </span>
    </button>
  );
};

export default MainContentElement;

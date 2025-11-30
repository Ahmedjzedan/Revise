"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { updateNodeFullnessAction } from "@/app/_utils/elementActions";

import { DragControls } from "framer-motion";

interface SideBarElementProps {
  id: string;
  active?: boolean;
  addbtn?: boolean;
  isChild?: boolean;
  children?: React.ReactNode;
  title?: string;
  onUpdate: (id: string, newFill: number) => void;
  onEdit: () => void;
  dragControls?: DragControls;
}

const MainContentElement: React.FC<
  SideBarElementProps & { fillProp?: number; maxFillProp?: number }
> = ({
  active: _active = false,
  children: _children,
  isChild = false,
  title,
  fillProp = 0,
  maxFillProp = 5,
  id,
  onUpdate,
  onEdit,
  dragControls,
}) => {
  const [maxFill] = useState(maxFillProp);
  const [fill, setFill] = useState(fillProp > maxFill ? maxFill : fillProp);

  useEffect(() => {
    setFill(fillProp > maxFill ? maxFill : fillProp);
  }, [fillProp, maxFill]);

  const widthFill = (fill / maxFill) * 100;
  return (
    <div className="relative group/item ml-10 mr-28 mt-5">
      <button
        className={
          `group relative flex items-center justify-between h-20 rounded-xl hover:bg-neutral-400
                    w-full text-2xl px-10 cursor-pointer bg-[#2C2C2C] z-0 transition-all duration-500 hover:scale-101
                    overflow-hidden shadow-[inset_0_0_0_2px_white]  ` +
          (isChild ? "mb-2 last:mb-0" : "")
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
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="absolute -right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 text-neutral-400 hover:text-white p-2 mr-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
      </button>
      
      <div 
        className="absolute -right-24 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 text-neutral-400 hover:text-white p-2 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => dragControls?.start(e)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="12" r="1"></circle>
          <circle cx="9" cy="5" r="1"></circle>
          <circle cx="9" cy="19" r="1"></circle>
          <circle cx="15" cy="12" r="1"></circle>
          <circle cx="15" cy="5" r="1"></circle>
          <circle cx="15" cy="19" r="1"></circle>
        </svg>
      </div>
    </div>
  );
};

export default MainContentElement;

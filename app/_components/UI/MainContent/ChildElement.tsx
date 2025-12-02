"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { updateNodeFullnessAction, toggleNodeCompletion } from "@/app/_utils/elementActions";
import { DragControls } from "framer-motion";

interface ChildElementProps {
  id: string;
  title: string;
  fillProp?: number;
  maxFillProp?: number;
  onUpdate: (id: string, newFill: number) => void;
  onEdit: () => void;
  onComplete?: (id: string) => void;
  dragControls?: DragControls;
  pinned?: boolean;
  type?: "bar" | "revision";
  content?: string;
}

const ChildElement: React.FC<ChildElementProps> = ({
  id,
  title,
  fillProp = 0,
  maxFillProp = 1, // Children usually have maxFill 1
  onUpdate,
  onEdit,
  onComplete,
  dragControls,
  pinned = false,
  type = "revision", // Children are usually revision type (fillable)
  content,
}) => {
  // Use props directly to avoid stale state issues
  const maxFill = maxFillProp;
  const [fill, setFill] = useState(fillProp > maxFill ? maxFill : fillProp);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setFill(fillProp > maxFill ? maxFill : fillProp);
  }, [fillProp, maxFill]);

  const handleCompletion = async () => {
    setIsCompleted(true);
    await toggleNodeCompletion(Number(id), true);
    if (onComplete) {
      onComplete(id);
    }
  };

  const widthFill = maxFill > 0 ? (fill / maxFill) * 100 : 0;
  const isRevision = type === "revision";

  return (
    <div 
      id={`node-${id}`} 
      className={`relative group/item ml-4 mr-4 md:ml-10 md:mr-28 mt-2 transition-all duration-300`}
    >
      <button
        className={
          `group relative flex items-center justify-between h-24 rounded-xl hover:bg-[var(--text-secondary)]
           w-full text-2xl px-10 cursor-pointer bg-[var(--bg-secondary)] z-0 transition-all duration-500 hover:scale-101
           overflow-hidden shadow-[inset_0_0_0_2px_var(--border-color)] mb-2 last:mb-0`
        }
        onClick={() => {
          if (isRevision && fill < maxFill) {
            const newFill = fill + 1;
            setFill(newFill);
            updateNodeFullnessAction(Number(id), newFill);
            onUpdate(id, newFill);
            
            if (newFill === maxFill) {
              handleCompletion();
            }
          } else if (!isRevision) {
             onEdit();
          }
        }}
      >
        {/* Background Fill Layer */}
        {isRevision && (
          <motion.div
            className={
              `absolute inset-0 z-1 ` +
              (isCompleted ? "bg-green-500" : "bg-white [.light_&]:bg-black") + " " +
              (fill === maxFill ? "rounded-xl" : "rounded-l-xl rounded-r-[0px]")
            }
            initial={{ width: 0 }}
            animate={{ width: `${widthFill}%` }}
            transition={{ duration: 0.5, ease: "linear" }}
          ></motion.div>
        )}
        
        {/* Base Content Layer (Visible on background) */}
        <div className="flex items-center justify-between w-full h-full relative z-2">
          <div className="flex flex-col items-start w-full">
            <span className="transition-colors duration-300 text-[var(--text-primary)] flex items-center gap-3">
              {pinned && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <line x1="12" y1="17" x2="12" y2="22"></line>
                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                </svg>
              )}
              {title}
              {!isRevision && content && (
                <span className="text-sm text-[var(--text-secondary)] truncate ml-4 font-light opacity-70">
                  {content.length > 30 ? content.substring(0, 30) + "..." : content}
                </span>
              )}
            </span>
          </div>

          {isRevision && (
            <span
              className="text-md px-4 py-2 flex items-center justify-center rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)]
                       group-hover:bg-[var(--bg-primary)] group-hover:text-[var(--text-primary)] transition-all duration-500 whitespace-nowrap"
            >
              {fill} / {maxFill}
            </span>
          )}
        </div>

        {/* Overlay Content Layer (Visible on fill) - Clipped */}
        {isRevision && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-between px-10 pointer-events-none z-10"
            initial={{ clipPath: `inset(0 100% 0 0)` }}
            animate={{ clipPath: `inset(0 ${100 - widthFill}% 0 0)` }}
            transition={{ duration: 0.5, ease: "linear" }}
          >
             <div className="flex flex-col items-start w-full">
              <span className={`transition-colors duration-300 flex items-center gap-3 ${isCompleted ? "text-white" : "text-black dark:text-black [.light_&]:text-white"}`}>
                {pinned && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <line x1="12" y1="17" x2="12" y2="22"></line>
                    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                  </svg>
                )}
                {title}
                {!isRevision && content && (
                  <span className="text-sm opacity-70">
                    {content.length > 30 ? content.substring(0, 30) + "..." : content}
                  </span>
                )}
              </span>
            </div>

            <span
              className={`text-md px-4 py-2 flex items-center justify-center rounded-md transition-all duration-500 whitespace-nowrap
                ${isCompleted ? "bg-white text-green-500" : "bg-black text-white [.light_&]:bg-white [.light_&]:text-black"}`}
            >
              {fill} / {maxFill}
            </span>
          </motion.div>
        )}
      </button>
      
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity duration-300 flex md:block gap-2 md:gap-0 mt-2 md:mt-0 relative md:absolute right-0 md:-right-16 top-auto md:top-1/2 translate-y-0 md:-translate-y-1/2 justify-end w-full md:w-auto pr-2 md:pr-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
        </button>
        
        <div 
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 cursor-grab active:cursor-grabbing"
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
    </div>
  );
};

export default ChildElement;

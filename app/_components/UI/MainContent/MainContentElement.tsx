"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { updateNodeFullnessAction, toggleNodeCompletion } from "@/app/_utils/elementActions";
import confetti from "canvas-confetti";

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
  onComplete?: (id: string) => void;
  dragControls?: DragControls;
  pinned?: boolean;
  type?: "bar" | "revision";
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
  onComplete,
  dragControls,
  pinned = false,
  type = "bar",
}) => {
  const [maxFill] = useState(maxFillProp);
  const [fill, setFill] = useState(fillProp > maxFill ? maxFill : fillProp);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    setFill(fillProp > maxFill ? maxFill : fillProp);
  }, [fillProp, maxFill]);

  const handleCompletion = async () => {
    setIsCompleted(true);
    setShowTimer(true);
    
    // Trigger confetti
    const rect = document.getElementById(`node-${id}`)?.getBoundingClientRect();
    if (rect) {
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        origin: { x, y },
        particleCount: 100,
        spread: 70,
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
      });
    }

    // Wait 3 seconds then mark as completed
    setTimeout(async () => {
      await toggleNodeCompletion(Number(id), true);
      if (onComplete) {
        onComplete(id);
      }
    }, 3000);
  };

  const widthFill = maxFill > 0 ? (fill / maxFill) * 100 : 0;
  const isRevision = type === "revision";

  return (
    <div 
      id={`node-${id}`} 
      className={`relative group/item ml-4 mr-4 md:ml-10 md:mr-28 mt-5 transition-all duration-300 ${
        pinned ? "border-2 border-yellow-500/50 bg-yellow-500/5 rounded-xl" : ""
      }`}
    >
      <button
        className={
          `group relative flex items-center justify-between h-24 rounded-xl hover:bg-[var(--text-secondary)]
                    w-full text-2xl px-10 cursor-pointer bg-[var(--bg-secondary)] z-0 transition-all duration-500 hover:scale-101
                    overflow-hidden shadow-[inset_0_0_0_2px_var(--border-color)] ` +
          (isChild ? "mb-2 last:mb-0" : "")
        }
        onClick={() => {
          if (isRevision && fill < maxFill) {
            const newFill = fill + 1;
            setFill(newFill);
            updateNodeFullnessAction(Number(id), newFill);
            if (isChild) {
              onUpdate(id, newFill);
            }
            if (newFill === maxFill) {
              handleCompletion();
            }
          } else if (!isRevision) {
             // For normal tasks, open edit modal on click
             onEdit();
          }
        }}
      >
        {isRevision && (
          <>
            <motion.div
              className={
                `absolute inset-0 z-1 ` +
                (isCompleted ? "bg-green-500" : "group-hover:bg-[var(--text-secondary)] bg-[var(--bg-primary)]") + " " +
                (fill === maxFill ? "rounded-xl" : "rounded-l-xl rounded-r-[0px]")
              }
              initial={{ width: 0 }}
              animate={{ width: `${widthFill}%` }}
              transition={{ duration: 0.5, ease: "linear" }}
            ></motion.div>
            <motion.div
              className={
                `absolute inset-0 z-10 ` +
                (isCompleted ? "" : "backdrop-invert-100") + " " +
                (fill === maxFill
                  ? "rounded-l-[12px] rounded-r-[12px]"
                  : "rounded-l-[12px] rounded-r-[0px]")
              }
              initial={{ width: 0 }}
              animate={{ width: `${widthFill}%` }}
              transition={{ duration: 0.5, ease: "linear" }}
            ></motion.div>
          </>
        )}
        
        <div className="z-2 flex flex-col items-start w-full">
          <span className={`transition-colors duration-300 text-[var(--text-primary)] ${isRevision ? "group-hover:text-[var(--bg-primary)]" : ""}`}>
            {title}
          </span>
          {showTimer && (
            <div className="w-full h-1 bg-white/30 rounded-full mt-1 overflow-hidden">
               <motion.div 
                 className="h-full bg-white"
                 initial={{ width: "100%" }}
                 animate={{ width: "0%" }}
                 transition={{ duration: 3, ease: "linear" }}
               />
            </div>
          )}
        </div>

        {isRevision && (
          <span
            className="text-md px-4 py-2 flex items-center justify-center rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] z-2
                     group-hover:bg-[var(--bg-primary)] group-hover:text-[var(--text-primary)] transition-all duration-500 whitespace-nowrap"
          >
            {fill} / {maxFill}
          </span>
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

export default MainContentElement;

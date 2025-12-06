"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DragControls } from "framer-motion";

interface ParentElementProps {
  id: string;
  title: string;
  fillProp?: number;
  maxFillProp?: number;
  onEdit: () => void;
  dragControls?: DragControls;
  pinned?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  content?: string;
}

const ParentElement: React.FC<ParentElementProps> = ({
  id,
  title,
  fillProp = 0,
  maxFillProp = 5,
  onEdit,
  dragControls,
  pinned = false,
  isExpanded,
  onToggleExpand,
  content,
}) => {
  const maxFill = maxFillProp;
  const [fill, setFill] = useState(fillProp > maxFill ? maxFill : fillProp);

  useEffect(() => {
    setFill(fillProp > maxFill ? maxFill : fillProp);
  }, [fillProp, maxFill]);

  const widthFill = maxFill > 0 ? (fill / maxFill) * 100 : 0;

  return (
    <div 
      id={`node-${id}`} 
      className={`relative group/item ml-4 mr-4 md:ml-10 md:mr-28 mt-5 transition-all duration-300`}
    >
      <button
        className={
          `group relative flex items-center justify-between h-24 rounded-xl hover:bg-[var(--text-secondary)]
           w-full text-2xl px-10 cursor-pointer bg-[var(--bg-secondary)] z-0 transition-all duration-500 hover:scale-101
           overflow-hidden shadow-[inset_0_0_0_2px_var(--border-color)]`
        }
        onClick={() => {
          if (onToggleExpand) {
            onToggleExpand();
          }
        }}
      >
        {/* Progress Bar Background */}
        <motion.div
          className={
            `absolute inset-0 z-1 bg-[var(--bg-primary)] group-hover:bg-[var(--text-secondary)] ` +
            (fill === maxFill ? "rounded-xl" : "rounded-l-xl rounded-r-[0px]")
          }
          initial={{ width: 0 }}
          animate={{ width: `${widthFill}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        ></motion.div>
        
        {/* Glassmorphism Overlay */}
        <motion.div
          className={
            `absolute inset-0 z-10 backdrop-invert-100 ` +
            (fill === maxFill
              ? "rounded-l-[12px] rounded-r-[12px]"
              : "rounded-l-[12px] rounded-r-[0px]")
          }
          initial={{ width: 0 }}
          animate={{ width: `${widthFill}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        ></motion.div>

        <div className="z-2 flex flex-col items-start w-full relative">
          <span className={`transition-colors duration-300 text-[var(--text-primary)] flex items-center gap-3 group-hover:text-[var(--bg-primary)]`}>
            {pinned && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <line x1="12" y1="17" x2="12" y2="22"></line>
                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
              </svg>
            )}
            {title}
            {content && (
              <span className="text-sm text-[var(--text-secondary)] truncate ml-4 font-light opacity-70">
                {content.length > 30 ? content.substring(0, 30) + "..." : content}
              </span>
            )}
          </span>
        </div>

        <span
          className="text-md px-4 py-2 flex items-center justify-center rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] z-2
                   group-hover:bg-[var(--bg-primary)] group-hover:text-[var(--text-primary)] transition-all duration-500 whitespace-nowrap"
        >
          {fill} / {maxFill}
        </span>
        
        {onToggleExpand && (
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)]">
               <polyline points="9 18 15 12 9 6"></polyline>
             </svg>
          </div>
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
          onPointerDown={(e) => {
            e.stopPropagation();
            dragControls?.start(e);
          }}
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

export default ParentElement;

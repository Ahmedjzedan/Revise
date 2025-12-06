"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toggleNodeCompletion } from "@/app/_utils/elementActions";
import confetti from "canvas-confetti";
import { DragControls } from "framer-motion";

interface NormalTaskProps {
  id: string;
  title: string;
  onEdit: () => void;
  onComplete?: (id: string) => void;
  dragControls?: DragControls;
  pinned?: boolean;
  content?: string;
}

const NormalTask: React.FC<NormalTaskProps> = ({
  id,
  title,
  onEdit,
  onComplete,
  dragControls,
  pinned = false,
  content,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

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

    setTimeout(async () => {
      await toggleNodeCompletion(Number(id), true);
      if (onComplete) {
        onComplete(id);
      }
    }, 3000);
  };

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
           // For normal tasks, we might want to just edit on click, or have a checkbox?
           // The previous logic was "if !isRevision, onEdit()".
           // But user might want to complete it too.
           // Let's stick to onEdit for the main click, and maybe add a completion button or just let them complete via edit modal?
           // Actually, usually "Normal Task" implies a simple checkbox style, but here we have big blocks.
           // Let's keep onEdit for now as per original logic.
           onEdit();
        }}
      >
        <div className="z-2 flex flex-col items-start w-full relative">
          <span className={`transition-colors duration-300 text-[var(--text-primary)] flex items-center gap-3`}>
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
      </button>
      
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity duration-300 flex md:block gap-2 md:gap-0 mt-2 md:mt-0 relative md:absolute right-0 md:-right-16 top-auto md:top-1/2 translate-y-0 md:-translate-y-1/2 justify-end w-full md:w-auto pr-2 md:pr-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Maybe add a complete button here for normal tasks?
            handleCompletion();
          }}
          className="text-[var(--text-secondary)] hover:text-green-500 p-2"
          title="Complete"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <polyline points="20 6 9 17 4 12"></polyline>
           </svg>
        </button>

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

export default NormalTask;

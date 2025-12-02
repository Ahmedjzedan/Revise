import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReviseLogo from "../ReviseLogo";

interface UnifiedSideBarProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  addButton?: React.ReactNode;
}

const UnifiedSideBar: React.FC<UnifiedSideBarProps> = ({
  children,
  footer,
  addButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[9999] p-2 text-[var(--text-primary)] bg-[var(--bg-secondary)] rounded-md hover:bg-[var(--bg-tertiary)] transition-colors shadow-lg border border-[var(--border-color)] pointer-events-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-[9990] backdrop-blur-sm pointer-events-auto"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        className={`fixed md:relative inset-y-0 left-0 z-[9999] w-64 md:w-full bg-[var(--bg-primary)] md:bg-transparent shadow-xl md:shadow-none transform transition-transform duration-300 ease-in-out pointer-events-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-screen flex-col w-full border-r border-[var(--border-color)] md:border-none">
          <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-5 md:pt-36">
            <div className="md:hidden mb-8 mt-4 scale-75 origin-top">
               <ReviseLogo />
            </div>
            {children}
            {addButton}
          </div>
          
          {footer && (
            <div className="flex justify-center align-middle m-5 text-lg shrink-0 mt-auto">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default UnifiedSideBar;

"use client";
import React from "react";
import { Reorder } from "framer-motion";

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
  return (
    <div className="flex h-full flex-col w-full">
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-36">
        {children}
        {addButton}
      </div>
      
      {footer && (
        <div className="flex justify-center align-middle m-5 text-lg shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
};

export default UnifiedSideBar;

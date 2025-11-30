"use client";
import React, { useState } from "react";
import "./globals.css";
import LocalSideBar from "@/app/_components/UI/Sidebar/LocalSideBar";
import LocalMainContent from "@/app/_components/UI/MainContent/LocalMainContent";
import MotionBorder from "@/app/_components/UI/Online/MotionBorder";

export default function Page() {
  const [currentPageId, setCurrentPageId] = useState<number | null>(null);

  return (
    <>
      <div className="h-full col-start-1 col-span-1 flex flex-col overflow-hidden">
        <LocalSideBar 
          currentPageId={currentPageId} 
          onPageSelect={setCurrentPageId} 
        />
      </div>

      <MotionBorder />

      <div className="row-start-1 row-span-2 h-full col-start-3 flex flex-col overflow-hidden">
        <LocalMainContent pageId={currentPageId} />
      </div>
    </>
  );
}

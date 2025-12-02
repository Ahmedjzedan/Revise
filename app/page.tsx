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
      <div className="fixed inset-0 z-50 pointer-events-none md:static md:col-start-1 md:row-start-1 md:h-full md:w-full md:z-0 md:pointer-events-auto">
        <div className="pointer-events-auto h-full w-full">
          <LocalSideBar 
            currentPageId={currentPageId} 
            onPageSelect={setCurrentPageId} 
          />
        </div>
      </div>

      <MotionBorder />

      <div className="col-start-1 row-start-1 row-span-1 h-full w-full md:row-start-1 md:row-span-2 md:col-start-3 flex flex-col overflow-hidden">
        <LocalMainContent pageId={currentPageId} />
      </div>
    </>
  );
}

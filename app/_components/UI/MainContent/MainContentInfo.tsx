"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface MainContentInfoProps {
  pageName?: string;
  userName?: string;
  isInPage?: boolean;
}

const MainContentInfo: React.FC<MainContentInfoProps> = (
  props
) => {
  const searchParams = useSearchParams();
  const isCompletedView = searchParams.get("view") === "completed";

  return (
    <div
      className={
        props.isInPage === false
          ? "flex justify-between mx-12 mt-10 mb-5 items-center justify-self-end overflow-hidden"
          : "flex justify-between mx-12 mt-10 mb-5 items-center overflow-hidden"
      }
    >
      {props.isInPage === false ? (
        <div className="text-center">
          <p className="text-xl text-neutral-400">Welcome</p>
          <p className="text-3xl text-white mb-4">{props.userName}</p>
          <p className="text-sm text-neutral-500">Select or create a page to get started</p>
        </div>
      ) : (
        <>
          <div className="text-center">
            <p className="mb-0.5 text-xl text-neutral-400">Page</p>
            <p className="text-3xl text-white">{props.pageName}</p>
          </div>

          <div className="flex gap-4">
            <Link
              href={isCompletedView ? "?" : "?view=completed"}
              className="px-4 py-2 bg-[#232323] text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              {isCompletedView ? "View Active Tasks" : "View Completed Tasks"}
            </Link>
          </div>
          
          <div className="text-center">
            <p className="mb-0.5 text-xl text-neutral-400">Logged in as</p>
            <p className="text-3xl text-white">{props.userName}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default MainContentInfo;

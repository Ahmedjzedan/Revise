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
          ? "flex flex-col md:flex-row justify-between mx-4 md:mx-12 mt-10 mb-5 items-center justify-self-end overflow-hidden gap-4 md:gap-0"
          : "flex flex-col md:flex-row justify-between mx-4 md:mx-12 mt-10 mb-5 items-center overflow-hidden gap-4 md:gap-0"
      }
    >
      {props.isInPage === false ? (
        <div className="text-center">
          <p className="text-xl text-[var(--text-secondary)]">Welcome</p>
          <p className="text-3xl text-[var(--text-primary)] mb-4">{props.userName}</p>
          <p className="text-sm text-[var(--text-secondary)]">Select or create a page to get started</p>
        </div>
      ) : (
        <>
          <div className="flex w-full md:w-auto justify-between md:justify-start items-center gap-4">
            <div className="text-center md:text-left">
              <p className="mb-0.5 text-xl text-[var(--text-secondary)]">Page</p>
              <p className="text-3xl text-[var(--text-primary)]">{props.pageName}</p>
            </div>
            
            <div className="text-center md:text-right md:hidden">
              <p className="mb-0.5 text-xl text-[var(--text-secondary)]">Logged in as</p>
              <p className="text-3xl text-[var(--text-primary)]">{props.userName}</p>
            </div>
          </div>

          <div className="flex gap-4 order-last md:order-none w-full md:w-auto justify-center">
            <Link
              href={isCompletedView ? "?" : "?view=completed"}
              className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors w-full md:w-auto text-center"
            >
              {isCompletedView ? "View Active Tasks" : "View Completed Tasks"}
            </Link>
          </div>
          
          <div className="text-center hidden md:block">
            <p className="mb-0.5 text-xl text-[var(--text-secondary)]">Logged in as</p>
            <p className="text-3xl text-[var(--text-primary)]">{props.userName}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default MainContentInfo;

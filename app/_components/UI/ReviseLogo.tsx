"use client";

import Link from "next/link";
import Image from "next/image";
import OpenBookIcon from "@/public/svgs/openbook.svg";

interface ReviseLogoProps {
  isAuthPage?: boolean;
  userId?: string | null;
}

export default function ReviseLogo({ isAuthPage = false, userId }: ReviseLogoProps) {
  // If we have a userId, we should link to the user's dashboard
  // unless we are on the dashboard itself? No, clicking logo usually refreshes or goes to root of dashboard.
  // If userId is present, use it.
  
  const href = userId ? `/${userId}` : "/";

  return (
    <div className="flex flex-col items-center gap-3 pointer-events-auto">
      <div className="relative">
        <Image 
          src={OpenBookIcon} 
          height={isAuthPage ? 40 : 50} 
          width={isAuthPage ? 40 : 50} 
          alt="Open book logo" 
          className="transition-all duration-300 [filter:var(--icon-filter)]"
        />
      </div>
      
      <Link 
        href={href} 
        className={
          isAuthPage
            ? "text-4xl text-[var(--text-primary)] font-light tracking-wide"
            : "text-5xl text-[var(--text-primary)]"
        }
      >
        Revise
      </Link>
    </div>
  );
}

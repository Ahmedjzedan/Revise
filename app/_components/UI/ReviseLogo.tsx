"use client";

import Link from "next/link";
import Image from "next/image";
import OpenBookIcon from "@/public/svgs/openbook.svg";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface ReviseLogoProps {
  isAuthPage?: boolean;
}

export default function ReviseLogo({ isAuthPage = false }: ReviseLogoProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  // If we are in /[user]/..., pathSegments[1] is the user UUID.
  // If we are in /login or /signup, we don't want to link to user dashboard probably, or maybe we do if they are logged in?
  // But this component is used in ClientHeader.
  // If the user is logged in and on a user page, we want to link to /[user].
  // If the user is on landing page, we link to /.
  
  // A simple heuristic: if the URL starts with a user UUID (which is usually long), link to that.
  // Or better, if we are not on /, /login, /signup, /about, then we are likely on a user page.
  
  const isUserPage = pathSegments.length > 1 && !["login", "signup", "about", ""].includes(pathSegments[1]);
  const userUuid = isUserPage ? pathSegments[1] : null;
  const href = userUuid ? `/${userUuid}` : "/";

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

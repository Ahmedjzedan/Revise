"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface SidebarFooterProps {
  authButton: React.ReactNode;
}

export default function SidebarFooter({ authButton }: SidebarFooterProps) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLight(true);
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isLight;
    setIsLight(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full pb-5">
      {/* Auth Button */}
      <div className="w-full flex justify-center">
        {authButton}
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm flex items-center gap-2"
      >
        {isLight ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <span>Dark Mode</span>
          </>
        )}
      </button>

      {/* About Us */}
      <Link href="/about" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm">
        About Us
      </Link>
    </div>
  );
}

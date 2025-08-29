"use client";
import React from "react";
import AuthButton from "./AuthButton";
import { usePathname } from "next/navigation";

const MainAuthButtons: React.FC = () => {
  const pathname = usePathname();

  return pathname === "/" || pathname === "/login" || pathname === "/signup" ? (
    <div className="flex justify-end space-x-8 m-8">
      <AuthButton name="Login" path="/login" />
      <AuthButton name="Sign up" path="/signup" />
    </div>
  ) : null;
};

export default MainAuthButtons;

"use client";
import Link from "next/link";
import React from "react";

const Logout: React.FC = () => {
  return (
    <Link
      href={"/"}
      onClick={() => {
        localStorage.setItem("lastUserId", "");
      }}
    >
      Log out
    </Link>
  );
};

export default Logout;

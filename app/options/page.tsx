"use client";
import Link from "next/link";

export default function Options() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-black text-white gap-y-8">
      <h1 className="text-4xl font-thin tracking-widest mb-10">OPTIONS</h1>
      <p className="text-neutral-400">Settings and configuration coming soon.</p>
      <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
        Back to Home
      </Link>
    </div>
  );
}

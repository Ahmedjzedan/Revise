"use client";
import { signup } from "@/app/_utils/authActions";
import Link from "next/link";
import { useActionState } from "react";

export default function Signup() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-black text-white gap-y-8 pt-28">
      <h1 className="text-4xl font-thin tracking-widest mb-10">SIGN UP</h1>
      <form action={action} className="flex flex-col gap-6 w-80">
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="bg-transparent border-b border-white/50 py-2 px-4 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-500"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="bg-transparent border-b border-white/50 py-2 px-4 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="bg-transparent border-b border-white/50 py-2 px-4 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-500"
        />
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          disabled={pending}
          className="mt-4 border border-white/30 py-2 px-6 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
        >
          {pending ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
        Already have an account? Login
      </Link>
      <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
        Back to Home
      </Link>
    </div>
  );
}

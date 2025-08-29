"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { validateUser } from "@/app/_utils/dbAuthHelpers"; // Adjust path as needed!

const Login: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const user = await validateUser({ name, password });

      if (user) {
        // Login successful!
        // MODIFIED: Redirect to the dynamic user ID page.
        window.location.href = `/${user.id}`;
        localStorage.setItem("lastUserId", user.id);
        localStorage.setItem("lastUserName", user.name);
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 1 } },
  };

  return (
    <>
      {/* ... rest of your JSX remains the same ... */}
      <motion.div
        className="fixed inset-0 z-10 bg-black/95"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      ></motion.div>

      <motion.div
        className="fixed top-1/8 -translate-x-1/2 left-1/2 z-50 text-4xl"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        Login
      </motion.div>

      <motion.div
        className="fixed inset-0 m-auto flex h-fit w-1/2 z-50 items-start justify-center
                   border-3 border-white rounded-lg bg-[#373737]"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <form className="m-10 w-full" onSubmit={handleLogin}>
          <h1 className="text-lg mb-1">Name</h1>
          <input
            className="border-2 mb-7 py-3 px-5 rounded-md bg-[#484848] w-full"
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <h1 className="text-lg mb-1">Password</h1>
          <input
            className="border-2 mb-10 py-3 px-5 rounded-md bg-[#484848] w-full"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-red-400 text-center mb-4">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="border-2 border-white rounded-sm px-4 py-1 cursor-pointer
                         transition-all duration-150 hover:scale-110 bg-black/15 text-white"
            >
              Back
            </button>
            <button
              type="submit"
              className="border-2 border-white rounded-sm px-4 py-1 cursor-pointer
                         transition-all duration-150 hover:scale-110 bg-white text-black
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default Login;

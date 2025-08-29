"use client";

import React, { useState, FormEvent } from "react"; // NEW: Imported useState and FormEvent
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createUser } from "@/app/_utils/dbAuthHelpers"; // NEW: Import the server action. Adjust path as needed!

const SignUp: React.FC = () => {
  const router = useRouter();

  // NEW: State management for form inputs, errors, and loading status
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // NEW: Form submission handler
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the page from reloading
    setError(null); // Reset error on each submission attempt

    // Basic client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!name || !password) {
      setError("Username and password cannot be empty.");
      return;
    }

    setIsLoading(true); // Disable button and show loading state

    try {
      // Call the server action from the client
      const result = await createUser({ name, password });

      // Check the result from the server action
      if (result && "error" in result) {
        setError(result.error); // Display error from the server (e.g., "Username is already taken.")
      } else {
        // Success! Redirect the user to the login page.
        // You could also show a success message here before redirecting.
        router.push("/login");
      }
    } catch (err) {
      // Catch any unexpected network or server errors
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false); // Re-enable the button
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
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
        Sign Up
      </motion.div>

      <motion.div
        className="fixed inset-0 m-auto flex h-fit w-1/2 z-50 items-start justify-center
                   border-3 border-white rounded-lg bg-[#373737]"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* NEW: Added the onSubmit handler to the form */}
        <form className="m-10 w-full" onSubmit={handleSignUp}>
          <h1 className="text-lg mb-1">Name</h1>
          <input
            className="border-2 mb-7 py-3 px-5 rounded-md bg-[#484848] w-full"
            type="text"
            placeholder="Username"
            // NEW: Bind input to state
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <h1 className="text-lg mb-1">Password</h1>
          <input
            className="border-2 mb-7 py-3 px-5 rounded-md bg-[#484848] w-full"
            type="password"
            placeholder="Password"
            // NEW: Bind input to state
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <h1 className="text-lg mb-1">Confirm Password</h1>
          <input
            className="border-2 mb-10 py-3 px-5 rounded-md bg-[#484848] w-full"
            type="password"
            placeholder="Confirm Password"
            // NEW: Bind input to state
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* NEW: Display error messages */}
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
                         disabled:bg-gray-400 disabled:cursor-not-allowed" // NEW: Styles for disabled state
              disabled={isLoading} // NEW: Disable button while loading
            >
              {/* NEW: Change text based on loading state */}
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default SignUp;

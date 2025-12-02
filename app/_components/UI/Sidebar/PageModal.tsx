"use client";

import React, { useState, FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { addPage } from "@/app/_utils/dbHelpers";

interface CreatePageModalProps {
  userId: string;
  pageTitle?: string;
  onClose: () => void;
}

const PageModal: React.FC<CreatePageModalProps> = ({ userId, pageTitle: _pageTitle, onClose: _onClose }) => {
  const router = useRouter();
  const [pageName, setPageName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pageName) {
      setError("Page name cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await addPage(userId, { title: pageName });
      router.refresh();
      setTimeout(() => {
        // Close modal logic if needed, or just refresh
        // router.back(); // If this was a route intercepting modal
        // But here it seems to be a state-controlled modal
        _onClose();
      }, 100);
    } catch (err) {
      setError("Failed to create page. It might already exist.");
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
      {typeof document !== 'undefined' && createPortal(
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={_onClose}
          ></motion.div>

          <motion.div
            className="fixed top-1/8 -translate-x-1/2 left-1/2 z-[150] text-4xl text-[var(--text-primary)]"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Create a new page
          </motion.div>

          <motion.div
            className="fixed inset-0 m-auto flex h-fit w-[90%] md:w-1/2 z-[150] items-start justify-center
                       border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] p-5 shadow-xl"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <form className="m-10 w-full" onSubmit={handleCreatePage}>
              <input
                className="border border-[var(--border-color)] mb-10 py-3 px-5 rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)] w-full placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)]/20"
                type="text"
                placeholder="Page name"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
              />

              {error && (
                <div className="text-red-400 text-center mb-4">{error}</div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={_onClose}
                  className="border border-[var(--border-color)] rounded-sm px-4 py-1 cursor-pointer
                             transition-all duration-150 hover:scale-105 bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-active)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border border-transparent rounded-sm px-4 py-1 cursor-pointer
                             transition-all duration-150 hover:scale-105 bg-[var(--text-primary)] text-[var(--bg-primary)]
                             disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </>,
        document.body
      )}
    </>
  );
};

export default PageModal;

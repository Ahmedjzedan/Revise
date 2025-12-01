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
            className="fixed inset-0 z-[100] bg-black/95"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={_onClose}
          ></motion.div>

          <motion.div
            className="fixed top-1/8 -translate-x-1/2 left-1/2 z-[150] text-4xl"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Create a new page
          </motion.div>

          <motion.div
            className="fixed inset-0 m-auto flex h-fit w-1/2 z-[150] items-start justify-center
                       border-3 border-white rounded-lg bg-[#373737] p-5"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <form className="m-10 w-full" onSubmit={handleCreatePage}>
              <input
                className="border-2 mb-10 py-3 px-5 rounded-md bg-[#484848] w-full"
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
                  className="border-2 border-white rounded-sm px-4 py-1 cursor-pointer
                             transition-all duration-150 hover:scale-110 bg-black/15 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border-2 border-white rounded-sm px-4 py-1 cursor-pointer
                             transition-all duration-150 hover:scale-110 bg-white text-black
                             disabled:bg-gray-400 disabled:cursor-not-allowed"
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

"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import PageModal from "./PageModal";
import { motion } from "framer-motion";

const AddPageButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const useruuid = pathSegments[1];

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="relative flex h-15 cursor-pointer justify-center items-center w-full text-3xl p-3 transition-all duration-500 text-neutral-400 hover:text-white active:bg-neutral-800 bg-[#232323]"
      >
        <motion.span className="relative z-10 transition-colors duration-300 text-4xl hover:text-white">
          +
        </motion.span>
      </button>
      {isModalOpen && (
        <PageModal
          userId={useruuid}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default AddPageButton;

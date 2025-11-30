"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { addNodeAction } from "@/app/_utils/elementActions";

interface CreateElementModalProps {
  pageId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateElementModal: React.FC<CreateElementModalProps> = ({
  pageId,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [maxFullness, setMaxFullness] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await addNodeAction(pageId, title, maxFullness);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1a1a1a] border border-white/20 p-8 rounded-2xl w-[500px] max-w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-light mb-6 text-white tracking-wide">Add New Element</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-neutral-400 text-sm mb-2">Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#333] text-white p-4 rounded-xl border border-transparent focus:border-white outline-none transition-all text-lg"
              placeholder="Element Title"
            />
          </div>

          <div>
            <label className="block text-neutral-400 text-sm mb-2">Max Fullness (Steps)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={maxFullness}
              onChange={(e) => setMaxFullness(Number(e.target.value))}
              className="w-full bg-[#333] text-white p-4 rounded-xl border border-transparent focus:border-white outline-none transition-all text-lg"
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-neutral-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black rounded-xl hover:bg-neutral-200 transition-colors font-medium"
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateElementModal;

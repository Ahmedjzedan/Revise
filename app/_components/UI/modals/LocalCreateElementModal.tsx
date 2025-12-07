"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LocalDataManager } from "@/app/_utils/LocalDataManager";

interface LocalCreateElementModalProps {
  pageId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const LocalCreateElementModal: React.FC<LocalCreateElementModalProps> = ({
  pageId,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [maxFullness, setMaxFullness] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      LocalDataManager.addNode(pageId, title, maxFullness);
      onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 rounded-2xl w-[500px] max-w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-light mb-6 text-[var(--text-primary)] tracking-wide">Add New Element</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-[var(--text-secondary)] text-sm mb-2">Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 rounded-xl border border-transparent focus:border-[var(--text-primary)] outline-none transition-all text-lg"
              placeholder="Element Title"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] text-sm mb-2">Max Fullness (Steps)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={maxFullness}
              onChange={(e) => setMaxFullness(Number(e.target.value))}
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 rounded-xl border border-transparent focus:border-[var(--text-primary)] outline-none transition-all text-lg"
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-xl hover:bg-[var(--bg-primary)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl hover:opacity-90 transition-colors font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LocalCreateElementModal;

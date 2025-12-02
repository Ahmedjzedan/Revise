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
  const [type, setType] = useState<"bar" | "revision">("bar");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || isSubmitting) return;
    
    setIsSubmitting(true);
    // If type is 'bar' (Normal Task), we pass 0 for maxFullness as requested (no fill)
    // But wait, the action expects a number. 0 is fine.
    const actualMaxFullness = type === "bar" ? 0 : maxFullness;
    
    await addNodeAction(pageId, title, actualMaxFullness, undefined, type);
    onSuccess();
    onClose();
    setIsSubmitting(false);
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

          {type === "revision" && (
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
          )}

          <div>
            <label className="block text-[var(--text-secondary)] text-sm mb-2">Element Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setType("bar")}
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  type === "bar"
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                    : "bg-[var(--bg-primary)] text-[var(--text-primary)] border-transparent hover:border-[var(--text-primary)]"
                }`}
              >
                Normal Task
              </button>
              <button
                type="button"
                onClick={() => setType("revision")}
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  type === "revision"
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                    : "bg-[var(--bg-primary)] text-[var(--text-primary)] border-transparent hover:border-[var(--text-primary)]"
                }`}
              >
                Revision
              </button>
            </div>
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
              className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl hover:opacity-90 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateElementModal;

"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { updateNodeAction, deleteNodeAction, addNodeAction } from "@/app/_utils/elementActions";
import { toast } from "sonner";

interface EditElementModalProps {
  nodeId: number;
  pageId: number;
  initialTitle: string;
  initialContent: string;
  initialMaxFullness: number;
  initialFullness: number;
  onClose: () => void;
  onSuccess: () => void;
}

const EditElementModal: React.FC<EditElementModalProps> = ({
  nodeId,
  pageId,
  initialTitle,
  initialContent,
  initialMaxFullness,
  initialFullness,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [maxFullness, setMaxFullness] = useState(initialMaxFullness);
  const [fullness, setFullness] = useState(initialFullness);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [childTitle, setChildTitle] = useState("");

  const handleUpdate = async () => {
    await updateNodeAction(nodeId, { title, content, maxfullness: maxFullness, fullness });
    onSuccess();
    onClose();
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childTitle) return;
    // We need to import addNodeAction here if not already imported? 
    // It is imported in CreateElementModal, let's check imports.
    // We need to add it to imports.
    await addNodeAction(pageId, childTitle, 5, nodeId);
    setChildTitle("");
    setIsAddChildOpen(false);
    onSuccess();
  };

  const handleDelete = async () => {
    toast("Are you sure you want to delete this element?", {
      action: {
        label: "Delete",
        onClick: async () => {
          await deleteNodeAction(nodeId);
          onSuccess();
          onClose();
        },
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 rounded-2xl w-[600px] max-w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-light mb-6 text-[var(--text-primary)] tracking-wide">Edit Element</h3>
        
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-[var(--text-secondary)] text-sm mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 rounded-xl border border-[var(--border-color)] focus:border-[var(--text-primary)] outline-none transition-all text-lg"
              placeholder="Element Title"
            />
          </div>

          <div>
             <label className="block text-[var(--text-secondary)] text-sm mb-2">Notes</label>
             <textarea
               value={content}
               onChange={(e) => setContent(e.target.value)}
               className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 rounded-xl border border-[var(--border-color)] focus:border-[var(--text-primary)] outline-none transition-all min-h-[100px]"
               placeholder="Add notes..."
             />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] text-sm mb-2">Max Fullness</label>
            <input
              type="number"
              min="1"
              max="20"
              value={maxFullness}
              onChange={(e) => setMaxFullness(Number(e.target.value))}
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 rounded-xl border border-[var(--border-color)] focus:border-[var(--text-primary)] outline-none transition-all text-lg"
            />
          </div>
          
          <div>
            <label className="block text-[var(--text-secondary)] text-sm mb-2">Current Fullness</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max={maxFullness}
                value={fullness}
                onChange={(e) => {
                   setFullness(Number(e.target.value));
                }}
                className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-[var(--text-primary)]"
              />
              <span className="text-[var(--text-primary)] w-8">{fullness}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
             <button 
               onClick={handleUpdate}
               className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl hover:opacity-90 transition-colors font-medium"
             >
               Save Changes
             </button>
             
             <button
               onClick={() => setIsAddChildOpen(true)}
               className="w-full py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--border-color)] transition-colors font-medium"
             >
               Add Child Element
             </button>

             <button 
               onClick={handleDelete}
               className="w-full py-3 border border-red-500 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"
             >
               Delete Element
             </button>
          </div>
        </div>

        {isAddChildOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80" onClick={() => setIsAddChildOpen(false)}>
             <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 rounded-lg w-96" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl mb-4 text-[var(--text-primary)]">Add Child Element</h3>
                <form onSubmit={handleAddChild}>
                  <input 
                    autoFocus
                    type="text" 
                    value={childTitle}
                    onChange={(e) => setChildTitle(e.target.value)}
                    placeholder="Child Title"
                    className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] p-2 rounded mb-4 border border-transparent focus:border-[var(--text-primary)] outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAddChildOpen(false)} className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded hover:opacity-90">Add</button>
                  </div>
                </form>
             </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EditElementModal;

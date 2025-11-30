"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { renamePage, deletePageAction } from "@/app/_utils/pageActions";
import { toast } from "sonner";

interface EditPageModalProps {
  pageId: number;
  currentTitle: string;
  userId: number;
  onClose: () => void;
}

const EditPageModal: React.FC<EditPageModalProps> = ({
  pageId,
  currentTitle,
  userId,
  onClose,
}) => {
  const [title, setTitle] = useState(currentTitle);

  const handleRename = async () => {
    await renamePage(pageId, title, userId);
    onClose();
  };

  const handleDelete = async () => {
    toast("Are you sure you want to delete this page?", {
      action: {
        label: "Delete",
        onClick: async () => {
          await deletePageAction(pageId, userId);
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
        className="bg-[#1a1a1a] border border-white/20 p-8 rounded-2xl w-[500px] max-w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-light mb-6 text-white tracking-wide">Edit Page</h3>
        
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-neutral-400 text-sm mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#333] text-white p-4 rounded-xl border border-transparent focus:border-white outline-none transition-all text-lg"
              placeholder="Page Title"
            />
          </div>
          
          <div className="flex flex-col gap-3 mt-4">
             <button 
               onClick={handleRename}
               className="w-full py-3 bg-white text-black rounded-xl hover:bg-neutral-200 transition-colors font-medium"
             >
               Rename
             </button>
             <button 
               onClick={handleDelete}
               className="w-full py-3 border border-red-500 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"
             >
               Delete Page
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditPageModal;

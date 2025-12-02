"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { renamePage, deletePageAction } from "@/app/_utils/pageActions";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();

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
          
          // Check if we are currently on the page being deleted
          // Pathname format: /[userId]/[pageTitle]
          // We need to decode the URL component to match the title
          const pathParts = pathname.split('/');
          const currentPageTitle = pathParts[2] ? decodeURIComponent(pathParts[2]) : null;
          
          if (currentPageTitle === currentTitle) {
             router.push(`/${userId}`);
          }
          
          onClose();
        },
      },
    });
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 rounded-2xl w-[500px] max-w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-light mb-6 text-[var(--text-primary)] tracking-wide">Edit Page</h3>
        
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-[var(--text-secondary)] text-sm mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 rounded-xl border border-transparent focus:border-[var(--text-primary)] outline-none transition-all text-lg"
              placeholder="Page Title"
            />
          </div>
          
          <div className="flex flex-col gap-3 mt-4">
             <button 
               onClick={handleRename}
               className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl hover:opacity-90 transition-colors font-medium"
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
    </div>,
    document.body
  );
};

export default EditPageModal;

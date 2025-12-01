"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LocalDataManager } from "@/app/_utils/LocalDataManager";
import { toast } from "sonner";

interface LocalEditPageModalProps {
  pageId: number;
  currentTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const LocalEditPageModal: React.FC<LocalEditPageModalProps> = ({
  pageId,
  currentTitle,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState(currentTitle);

  const handleRename = () => {
    LocalDataManager.updatePage(pageId, { title });
    onSuccess();
    onClose();
  };

  const handleDelete = () => {
    toast("Are you sure you want to delete this page?", {
      action: {
        label: "Delete",
        onClick: () => {
          LocalDataManager.deletePage(pageId);
          onSuccess();
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
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 rounded-lg w-96" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl mb-6 text-[var(--text-primary)]">Edit Page</h3>
        
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] p-3 rounded border border-transparent focus:border-[var(--text-primary)] outline-none"
            placeholder="Page Title"
          />
          
          <div className="flex flex-col gap-2 mt-4">
             <button 
               onClick={handleRename}
               className="w-full py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded hover:opacity-90 transition-colors"
             >
               Rename
             </button>
             <button 
               onClick={handleDelete}
               className="w-full py-2 border border-red-500 text-red-500 rounded hover:bg-red-500/10 transition-colors"
             >
               Delete
             </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LocalEditPageModal;

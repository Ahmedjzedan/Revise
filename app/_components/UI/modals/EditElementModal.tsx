"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { updateNodeAction, deleteNodeAction, addNodeAction, togglePinAction } from "@/app/_utils/elementActions";
import { toast } from "sonner";

interface EditElementModalProps {
  nodeId: number;
  pageId: number;
  initialTitle: string;
  initialContent: string;
  initialMaxFullness: number;
  initialFullness: number;
  initialPinned?: boolean;
  initialType?: "bar" | "revision";
  onClose: () => void;
  onSuccess: (newNode?: unknown) => void;
}

const EditElementModal: React.FC<EditElementModalProps> = ({
  nodeId,
  pageId,
  initialTitle,
  initialContent,
  initialMaxFullness,
  initialFullness,
  initialPinned = false,
  initialType = "bar",
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [maxFullness, setMaxFullness] = useState(initialMaxFullness);
  const [fullness, setFullness] = useState(initialFullness);
  const [isPinned, setIsPinned] = useState(initialPinned);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [childTitle, setChildTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const newPinned = !isPinned;
      setIsPinned(newPinned);
      await togglePinAction(nodeId, newPinned);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await updateNodeAction(nodeId, { title, content, maxfullness: maxFullness, fullness });
      onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childTitle || isSubmitting) return;
    
    setIsSubmitting(true);
    // Inherit parent type
    const childType = initialType === "bar" ? "bar" : "revision";
    const childMaxFullness = initialType === "bar" ? 0 : 1;

    try {
      const result = await addNodeAction(pageId, childTitle, childMaxFullness, nodeId, childType);
      if (result?.success && result.node) {
        toast.success("Child element created");
        // Pass the new node to onSuccess for optimistic update
        onSuccess(result.node);
      } else {
        toast.error("Failed to create child element");
      }
    } catch (error) {
      toast.error("An error occurred while creating child element");
    } finally {
      setChildTitle("");
      setIsAddChildOpen(false);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const dontShowAgain = localStorage.getItem("dontShowDeleteConfirm");
    
    if (dontShowAgain === "true") {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        await deleteNodeAction(nodeId);
        onSuccess();
        onClose();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    toast.custom((t) => (
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-xl shadow-lg w-full max-w-sm">
        <h3 className="text-[var(--text-primary)] font-medium mb-2">Delete Element?</h3>
        <p className="text-[var(--text-secondary)] text-sm mb-4">Are you sure you want to delete this element? This action cannot be undone.</p>
        
        <div className="flex items-center gap-2 mb-4">
          <input 
            type="checkbox" 
            id="dont-show" 
            className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-primary)]"
            onChange={(e) => {
              if (e.target.checked) {
                localStorage.setItem("dontShowDeleteConfirm", "true");
              } else {
                localStorage.removeItem("dontShowDeleteConfirm");
              }
            }}
          />
          <label htmlFor="dont-show" className="text-[var(--text-secondary)] text-sm cursor-pointer select-none">Don&apos;t show this again</label>
        </div>

        <div className="flex justify-end gap-2">
          <button 
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              try {
                toast.dismiss(t);
                await deleteNodeAction(nodeId);
                onSuccess();
                onClose();
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 rounded-2xl w-[600px] max-w-full mx-4 shadow-2xl max-h-[85vh] overflow-y-auto mt-10"
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

          {initialType === "revision" && (
            <>
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
            </>
          )}

          <div className="flex flex-col gap-3 mt-4">
             <button 
               onClick={handleUpdate}
               disabled={isSubmitting}
               className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl hover:opacity-90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
               {isSubmitting ? "Saving..." : "Save Changes"}
             </button>
             
             <div className="grid grid-cols-3 gap-3">
               <button
                 onClick={() => setIsAddChildOpen(true)}
                 disabled={isSubmitting}
                 className="flex flex-col items-center justify-center gap-1 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--border-color)] transition-colors text-sm font-medium disabled:opacity-50"
                 title="Add Child"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                 <span>Add Child</span>
               </button>

               <button
                 onClick={handlePin}
                 disabled={isSubmitting}
                 className={`flex flex-col items-center justify-center gap-1 py-3 border rounded-xl transition-colors text-sm font-medium disabled:opacity-50 ${
                   isPinned 
                     ? "bg-yellow-500/10 border-yellow-500 text-yellow-500 hover:bg-yellow-500/20" 
                     : "border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]"
                 }`}
                 title={isPinned ? "Unpin" : "Pin"}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
                 <span>{isPinned ? "Unpin" : "Pin"}</span>
               </button>

               <button 
                 onClick={handleDelete}
                 disabled={isSubmitting}
                 className="flex flex-col items-center justify-center gap-1 py-3 border border-red-500 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors text-sm font-medium disabled:opacity-50"
                 title="Delete"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                 <span>Delete</span>
               </button>
             </div>
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
                    <button type="button" onClick={() => setIsAddChildOpen(false)} className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded hover:opacity-90 disabled:opacity-50" disabled={isSubmitting}>Add</button>
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

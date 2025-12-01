"use client";
import React, { useEffect, useState } from "react";
import { getNodes } from "@/app/_utils/dbHelpers";
import { Node } from "@/app/_db/schema";
import { toggleNodeCompletion } from "@/app/_utils/elementActions";
import { motion } from "framer-motion";

interface CompletedTasksListProps {
  pageId: string;
}

const CompletedTasksList: React.FC<CompletedTasksListProps> = ({ pageId }) => {
  const [nodes, setNodes] = useState<Node[]>([]);

  const fetchNodes = async () => {
    const fetchedNodes = await getNodes(Number(pageId));
    // Filter for completed nodes
    const completedNodes = (fetchedNodes || []).filter(n => n.completed);
    // Sort by completedAt desc
    completedNodes.sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
    });
    setNodes(completedNodes);
  };

  useEffect(() => {
    fetchNodes();
  }, [pageId]);

  const handleRestore = async (nodeId: number) => {
    await toggleNodeCompletion(nodeId, false);
    fetchNodes();
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative pb-20 pt-5">
      <div className="flex justify-between items-center px-12 mb-5">
        <h2 className="text-2xl text-[var(--text-primary)] font-light">Completed Tasks: {nodes.length}</h2>
      </div>
      
      {nodes.length === 0 ? (
        <div className="flex justify-center items-center h-full text-[var(--text-secondary)] text-xl">
          No completed tasks yet.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
            {nodes.map((node) => (
                <motion.div 
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group ml-10 mr-28 mt-5"
                >
                    <div className="flex items-center justify-between h-20 rounded-xl bg-[var(--bg-secondary)] w-full text-2xl px-10 shadow-[inset_0_0_0_2px_var(--border-color)]">
                        <span className="text-[var(--text-secondary)] line-through decoration-[var(--text-primary)] decoration-2">{node.title}</span>
                        <button 
                            onClick={() => handleRestore(node.id)}
                            className="text-sm px-6 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg hover:scale-105 transition-all font-medium"
                        >
                            Restore
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasksList;

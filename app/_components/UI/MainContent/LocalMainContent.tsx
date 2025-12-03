"use client";
import React, { useEffect, useState } from "react";
import { LocalDataManager, LocalNode } from "@/app/_utils/LocalDataManager";
import LocalCreateElementModal from "../modals/LocalCreateElementModal";
import LocalEditElementModal from "../modals/LocalEditElementModal";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import DraggableMainContentItem from "./DraggableMainContentItem";
import MainContentInfo from "./MainContentInfo";

interface LocalMainContentProps {
  pageId: number | null;
}

const LocalMainContent: React.FC<LocalMainContentProps> = ({ pageId }) => {
  const [nodes, setNodes] = useState<LocalNode[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<LocalNode | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<number>>(new Set());

  const fetchNodes = () => {
    if (pageId === null) {
      setNodes([]);
      return;
    }
    const localNodes = LocalDataManager.getNodes(pageId);
    setNodes(localNodes);
  };

  useEffect(() => {
    fetchNodes();
  }, [pageId]);

  const handleNodeUpdate = (nodeId: string, newFill: number) => {
    LocalDataManager.updateNode(Number(nodeId), { fullness: newFill });
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === Number(nodeId) ? { ...node, fullness: newFill } : node
      )
    );
  };

  if (pageId === null) {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <MainContentInfo userName="Guest" isInPage={false} />
      </React.Suspense>
    );
  }

  const handleParentReorder = (newParentOrder: LocalNode[]) => {
    setNodes((prevNodes) => {
      // Combine new parent order with existing children AND other parents (completed ones not in view)
      const activeParentIds = new Set(newParentOrder.map(n => n.id));
      
      const nonActiveParents = prevNodes.filter(n => !n.parentId && !activeParentIds.has(n.id));
      const allChildren = prevNodes.filter(n => n.parentId);
      
      return [...newParentOrder, ...nonActiveParents, ...allChildren];
    });
    
    LocalDataManager.reorderNodes(newParentOrder);
  };

  const handleChildReorder = (parentId: number, newChildOrder: LocalNode[]) => {
    setNodes(prevNodes => {
      const otherNodes = prevNodes.filter(n => n.parentId !== parentId);
      return [...otherNodes, ...newChildOrder];
    });
    LocalDataManager.reorderNodes(newChildOrder);
  };

  const handleNodeCompletion = (nodeId: string) => {
    LocalDataManager.deleteNode(Number(nodeId));
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== Number(nodeId)));
  };

  const toggleExpansion = (nodeId: number) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative pb-20">
      <div className="flex flex-col gap-5 pt-5">
        <Reorder.Group axis="y" values={nodes.filter(n => !n.parentId)} onReorder={handleParentReorder}>
          {nodes.filter(n => !n.parentId).map((node) => {
            const children = nodes.filter(n => n.parentId === node.id);
            const hasChildren = children.length > 0;
            
            // Calculate derived fullness for parents
            const calculatedFullness = hasChildren ? 0 : (node.fullness || 0);
            const calculatedMaxFullness = hasChildren ? children.length : (node.maxfullness || 5);
            const displayType = node.type || "bar";

            const isExpanded = !collapsedNodes.has(node.id);

            return (
            <DraggableMainContentItem
                key={node.id}
                node={node}
                fullness={calculatedFullness}
                maxfullness={calculatedMaxFullness}
                onUpdate={handleNodeUpdate}
                onEdit={(n) => setEditingNode(n as LocalNode)}
                onComplete={handleNodeCompletion}
                isExpanded={isExpanded}
                onToggleExpand={() => toggleExpansion(node.id)}
              >
              {/* Render children only if expanded */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <Reorder.Group axis="y" values={children} onReorder={(newOrder) => handleChildReorder(node.id, newOrder)}>
                      {children.map(child => (
                         <DraggableMainContentItem
                          key={child.id}
                          node={child}
                          onUpdate={handleNodeUpdate}
                          onEdit={(n) => setEditingNode(n as LocalNode)}
                          onComplete={handleNodeCompletion}
                          isChild={true}
                          className="ml-10"
                        />
                      ))}
                    </Reorder.Group>
                  </motion.div>
                )}
              </AnimatePresence>
            </DraggableMainContentItem>
            );
          })}
        </Reorder.Group>
      </div>

      <div className="flex justify-center mt-10 mb-10 px-5">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className={`group relative flex items-center justify-center rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] transition-all duration-300 shadow-lg
            ${nodes.length === 0 ? "w-64 h-16 rounded-2xl" : "w-16 h-16"}
          `}
        >
          <span className={`text-3xl text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-300 pb-1
             ${nodes.length === 0 ? "text-xl font-light tracking-widest" : ""}
          `}>
            {nodes.length === 0 ? "+ Add Element" : "+"}
          </span>
        </button>
      </div>

      {isCreateModalOpen && (
        <LocalCreateElementModal
          pageId={pageId}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchNodes}
        />
      )}

      {editingNode && (
        <LocalEditElementModal
          nodeId={editingNode.id}
          pageId={pageId}
          initialTitle={editingNode.title}
          initialContent={editingNode.content || ""}
          initialMaxFullness={editingNode.maxfullness || 5}
          initialFullness={editingNode.fullness || 0}
          onClose={() => setEditingNode(null)}
          onSuccess={fetchNodes}
        />
      )}
    </div>
  );
};

export default LocalMainContent;

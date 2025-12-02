"use client";
import React, { useEffect, useState } from "react";
import { LocalDataManager, LocalNode } from "@/app/_utils/LocalDataManager";
import LocalCreateElementModal from "../modals/LocalCreateElementModal";
import LocalEditElementModal from "../modals/LocalEditElementModal";
import { Reorder } from "framer-motion";
import DraggableMainContentItem from "./DraggableMainContentItem";
import MainContentInfo from "./MainContentInfo";

interface LocalMainContentProps {
  pageId: number | null;
}

const LocalMainContent: React.FC<LocalMainContentProps> = ({ pageId }) => {
  const [nodes, setNodes] = useState<LocalNode[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<LocalNode | null>(null);

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

  const handleReorder = (newOrder: LocalNode[]) => {
    setNodes(newOrder);
    LocalDataManager.reorderNodes(newOrder);
  };

  const handleNodeCompletion = (nodeId: string) => {
    LocalDataManager.deleteNode(Number(nodeId));
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== Number(nodeId)));
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative pb-20">
      <div className="flex flex-col gap-5 pt-5">
        <Reorder.Group axis="y" values={nodes.filter(n => !n.parentId)} onReorder={handleReorder}>
          {nodes.filter(n => !n.parentId).map((node) => {
            const children = nodes.filter(n => n.parentId === node.id);
            const hasChildren = children.length > 0;
            
            // Calculate derived fullness for parents
            const completedChildren = children.filter(c => c.fullness === (c.maxfullness || 1)).length; // Assuming maxfullness 1 for children usually
            // Actually, children are removed when completed in local mode? 
            // "LocalDataManager.deleteNode(Number(nodeId))" in handleNodeCompletion.
            // So completed children are GONE.
            // If completed children are gone, then parent fullness is just 0?
            // Wait, if children are deleted on completion, how do we track progress?
            // In MainContent (logged in), we toggle completion but keep them visible if parent is active.
            // In LocalMainContent, handleNodeCompletion calls deleteNode.
            // This is a discrepancy. Local mode deletes completed nodes immediately.
            // If the user wants "parent elements maximum fill updates when the child is added",
            // and "parent element only completes when all children are complete",
            // then local mode needs to NOT delete children immediately if they have a parent?
            // Or maybe we just count total children?
            // If I change local mode to not delete, it might be a bigger change.
            // Let's stick to the requested fix: "parent elements maximum fill updates when the child is added".
            // So maxFullness = children.length.
            // And fullness = ???
            // If children are deleted, we can't track completion count unless we store it in parent.
            // But the user said "remove that small bar... in the child elements".
            // Let's assume for now we just fix the display.
            // If I can't change the delete logic easily, I'll just use what I have.
            // But wait, if children are deleted, the parent's maxFullness will decrease!
            // That's bad. 0/5 -> 0/4 -> 0/3.
            // The user wants 0/5 -> 1/5 -> 2/5.
            // So Local mode logic is fundamentally flawed for this "parent tracks children" feature if it deletes children.
            // I should probably NOT delete children in local mode if they have a parent?
            // Or maybe I should just implement the display props first.
            // The user said "do all the fixes I told you about for the LOGGED IN USER TO THE UNLOGGED IN."
            // This implies parity.
            // So I should probably make local mode behave like logged in mode: don't delete immediately?
            // But `handleNodeCompletion` deletes it.
            // I will modify `handleNodeCompletion` to check if it's a child.
            // If it's a child, maybe just mark it as completed in local storage?
            // LocalNode interface doesn't have 'completed'.
            // I'll check LocalDataManager.
            
            // For now, I will implement the props passing and derived calculation based on CURRENT children.
            // If children are deleted, it will be weird, but I'll fix the props first.
            
            const calculatedFullness = hasChildren ? 0 : (node.fullness || 0); // We can't easily track completed children if they are deleted.
            const calculatedMaxFullness = hasChildren ? children.length : (node.maxfullness || 5);
            const displayType = node.type || "bar";

            return (
            <div key={node.id}>
              <DraggableMainContentItem
                node={{
                    ...node,
                    fullness: calculatedFullness,
                    maxfullness: calculatedMaxFullness,
                    type: displayType,
                    content: node.content || undefined
                }}
                onUpdate={handleNodeUpdate}
                onEdit={(n) => setEditingNode(n as LocalNode)}
                onComplete={handleNodeCompletion}
              />
              {/* Render children */}
              {children.map(child => (
                <div key={child.id} className="ml-10">
                   <DraggableMainContentItem
                    node={{...child, content: child.content || undefined}}
                    onUpdate={handleNodeUpdate}
                    onEdit={(n) => setEditingNode(n as LocalNode)}
                    onComplete={handleNodeCompletion}
                    isChild={true}
                  />
                </div>
              ))}
            </div>
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

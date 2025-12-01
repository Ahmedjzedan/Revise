"use client";
import React, { useEffect, useState } from "react";
import MainContentElement from "./MainContentElement";
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
          {nodes.filter(n => !n.parentId).map((node) => (
            <div key={node.id}>
              <DraggableMainContentItem
                node={node}
                onUpdate={handleNodeUpdate}
                onEdit={(n) => setEditingNode(n as LocalNode)}
                onComplete={handleNodeCompletion}
              />
              {/* Render children */}
              {nodes.filter(child => child.parentId === node.id).map(child => (
                <div key={child.id} className="ml-10">
                   <DraggableMainContentItem
                    node={child}
                    onUpdate={handleNodeUpdate}
                    onEdit={(n) => setEditingNode(n as LocalNode)}
                    onComplete={handleNodeCompletion}
                  />
                </div>
              ))}
            </div>
          ))}
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

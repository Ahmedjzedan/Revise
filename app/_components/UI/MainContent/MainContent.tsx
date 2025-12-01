"use client";
import MainContentElement from "./MainContentElement";
import { useEffect, useState } from "react";
import { getNodes } from "@/app/_utils/dbHelpers";
import { Node } from "@/app/_db/schema";
import CreateElementModal from "../modals/CreateElementModal";
import EditElementModal from "../modals/EditElementModal";
import { motion } from "framer-motion";
import { Reorder } from "framer-motion";
import DraggableMainContentItem from "./DraggableMainContentItem";
import { reorderNodesAction } from "@/app/_utils/elementActions";
import { useSearchParams } from "next/navigation";
import CompletedTasksList from "./CompletedTasksList";

interface MainContentProps {
  pageId: string;
}

const MainContent: React.FC<MainContentProps> = ({ pageId }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);

  const searchParams = useSearchParams();
  const isCompletedView = searchParams.get("view") === "completed";

  const fetchNodes = async () => {
    const fetchedNodes = await getNodes(Number(pageId));
    const sortedNodes = (fetchedNodes || []).sort((a, b) => {
      if (a.position !== null && b.position !== null) {
        return a.position - b.position;
      }
      return a.id - b.id;
    });
    setNodes(sortedNodes);
  };

  useEffect(() => {
    fetchNodes();
  }, [pageId, isCompletedView]);

  const handleNodeUpdate = async (nodeId: string, newFill: number) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === Number(nodeId) ? { ...node, fullness: newFill } : node
      )
    );
  };

  const handleReorder = (newOrder: Node[]) => {
    setNodes(newOrder);
    const updates = newOrder.map((node, index) => ({
      id: node.id,
      position: index,
    }));
    reorderNodesAction(updates);
  };

  const handleNodeCompletion = (nodeId: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== Number(nodeId)));
  };

  if (isCompletedView) {
      return <CompletedTasksList pageId={pageId} />;
  }

  // Filter out completed nodes for active view
  const activeNodes = nodes.filter(n => !n.completed);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative pb-20">
      <div className="flex justify-between items-center px-12 pt-5 mb-2">
        <h2 className="text-xl text-[var(--text-secondary)] font-light">Tasks: {activeNodes.length}</h2>
      </div>

      <div className="flex flex-col gap-5 pt-2">
        <Reorder.Group axis="y" values={activeNodes.filter(n => !n.parentId)} onReorder={handleReorder}>
          {activeNodes.filter(n => !n.parentId).map((node) => (
            <div key={node.id}>
              <DraggableMainContentItem
                node={node}
                onUpdate={handleNodeUpdate}
                onEdit={(n) => setEditingNode(n as unknown as Node)}
                onComplete={handleNodeCompletion}
              />
              {/* Render children */}
              {activeNodes.filter(child => child.parentId === node.id).map(child => (
                <div key={child.id} className="ml-10">
                   <DraggableMainContentItem
                    node={child}
                    onUpdate={handleNodeUpdate}
                    onEdit={(n) => setEditingNode(n as unknown as Node)}
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
          className={`group relative flex items-center justify-center rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-active)] transition-all duration-300 shadow-lg border border-[var(--border-color)]
            ${activeNodes.length === 0 ? "w-64 h-16 rounded-2xl" : "w-16 h-16"}
          `}
        >
          <span className={`text-3xl text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-300 pb-1
             ${activeNodes.length === 0 ? "text-xl font-light tracking-widest" : ""}
          `}>
            {activeNodes.length === 0 ? "+ Add Element" : "+"}
          </span>
        </button>
      </div>

      {isCreateModalOpen && (
        <CreateElementModal
          pageId={Number(pageId)}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchNodes}
        />
      )}

      {editingNode && (
        <EditElementModal
          nodeId={editingNode.id}
          pageId={Number(pageId)}
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

export default MainContent;

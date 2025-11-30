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

interface MainContentProps {
  pageId: string;
}

const MainContent: React.FC<MainContentProps> = ({ pageId }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);

  const fetchNodes = async () => {
    const fetchedNodes = await getNodes(Number(pageId));
    // Sort by position (descending or ascending? usually list is top to bottom, so asc position)
    // But if we want newest at bottom, or custom order.
    // Let's sort by position if available, else id.
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
  }, [pageId]);

  const handleNodeUpdate = async (nodeId: string, newFill: number) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === Number(nodeId) ? { ...node, fullness: newFill } : node
      )
    );
  };

  const handleReorder = (newOrder: Node[]) => {
    setNodes(newOrder);
    // Call server action
    const updates = newOrder.map((node, index) => ({
      id: node.id,
      position: index,
    }));
    reorderNodesAction(updates);
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
                onEdit={(n) => setEditingNode(n as unknown as Node)}
              />
              {/* Render children */}
              {nodes.filter(child => child.parentId === node.id).map(child => (
                <div key={child.id} className="ml-10">
                   <DraggableMainContentItem
                    node={child}
                    onUpdate={handleNodeUpdate}
                    onEdit={(n) => setEditingNode(n as unknown as Node)}
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
          className={`group relative flex items-center justify-center rounded-full bg-[#232323] hover:bg-white transition-all duration-300 shadow-lg
            ${nodes.length === 0 ? "w-full h-20 rounded-2xl" : "w-16 h-16"}
          `}
        >
          <span className={`text-3xl text-neutral-400 group-hover:text-black transition-colors duration-300 pb-1
             ${nodes.length === 0 ? "text-xl font-light tracking-widest" : ""}
          `}>
            {nodes.length === 0 ? "+ Add First Element" : "+"}
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

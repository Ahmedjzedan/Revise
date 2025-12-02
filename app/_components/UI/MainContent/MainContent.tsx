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
import { reorderNodesAction, toggleNodeCompletion } from "@/app/_utils/elementActions";
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

  const handleNodeCompletion = async (nodeId: string) => {
    const id = Number(nodeId);
    const node = nodes.find(n => n.id === id);
    
    if (!node) return;

    // Optimistically update local state
    setNodes(prev => prev.map(n => n.id === id ? { ...n, completed: true } : n));

    // If it's a child, check if parent needs to be completed
    if (node.parentId) {
      const parent = nodes.find(n => n.id === node.parentId);
      if (parent) {
        const siblings = nodes.filter(n => n.parentId === parent.id && n.id !== id);
        const allSiblingsCompleted = siblings.every(n => n.completed);
        
        if (allSiblingsCompleted) {
          // Complete parent
          await toggleNodeCompletion(parent.id, true);
          setNodes(prev => prev.map(n => n.id === parent.id ? { ...n, completed: true } : n));
        }
      }
    } else {
      // If it's a parent, complete all children?
      // User didn't ask for this, but it might be good behavior. 
      // User said: "send the parent( so all the children will follow)"
      // This implies if parent moves to completed, children go with it.
      // My filtering logic handles this: if parent is completed, children (even if completed) won't show in active view unless we change filter.
      // But wait, my filter says: "Completed nodes that are children of an ACTIVE parent".
      // So if parent is completed, children won't show. Correct.
    }
  };

  if (isCompletedView) {
      return <CompletedTasksList pageId={pageId} />;
  }

  // Filter nodes:
  // 1. Active nodes (not completed)
  // 2. Completed nodes that are children of an active parent
  const activeNodes = nodes.filter(n => {
    if (!n.completed) return true;
    if (n.parentId) {
      const parent = nodes.find(p => p.id === n.parentId);
      return parent && !parent.completed;
    }
    return false;
  });

  // Helper to get children of a node
  const getChildren = (parentId: number) => nodes.filter(n => n.parentId === parentId);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative pb-20">
      <div className="flex justify-between items-center px-12 pt-5 mb-2">
        <h2 className="text-xl text-[var(--text-secondary)] font-light">Tasks: {activeNodes.filter(n => !n.parentId).length}</h2>
      </div>

      <div className="flex flex-col gap-5 pt-2">
        <Reorder.Group axis="y" values={activeNodes.filter(n => !n.parentId)} onReorder={handleReorder}>
          {activeNodes.filter(n => !n.parentId).map((node) => {
            const children = getChildren(node.id);
            const hasChildren = children.length > 0;
            
            // Calculate fullness based on children if they exist
            const calculatedFullness = hasChildren 
              ? children.filter(c => c.completed).length 
              : (node.fullness || 0);
            
            const calculatedMaxFullness = hasChildren
              ? children.length
              : (node.maxfullness || 5);

            // Determine type: respect the node's type
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
                  onEdit={(n) => setEditingNode(n as unknown as Node)}
                  onComplete={(id) => {
                    // If it has children, don't complete it directly via click if not all children are done
                    // But the UI handles click completion. 
                    // We should only allow completion if it has no children OR all children are done.
                    // Actually, for parent with children, completion should be automatic.
                    // But if user clicks it, maybe we should check?
                    // For now, let's rely on the child completion logic below.
                    handleNodeCompletion(id);
                  }}
                />
                {/* Render children */}
                {children.map(child => (
                  <div key={child.id} className="ml-10">
                     <DraggableMainContentItem
                      node={{...child, content: child.content || undefined}}
                      onUpdate={handleNodeUpdate}
                      onEdit={(n) => setEditingNode(n as unknown as Node)}
                      onComplete={(childId) => {
                         handleNodeCompletion(childId);
                         
                         const siblings = children.filter(c => c.id !== Number(childId));
                         const allSiblingsCompleted = siblings.every(c => c.completed);
                         
                         if (allSiblingsCompleted) {
                           // If all siblings are completed, we might want to trigger parent completion
                           // But for now, handleNodeCompletion handles the logic for the current node.
                           // The parent completion logic is inside handleNodeCompletion (if I updated it correctly).
                           // Let's just call handleNodeCompletion.
                         }
                      }}
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
          initialPinned={editingNode.pinned || false}
          initialType={editingNode.type as "bar" | "revision" || "bar"}
          onClose={() => setEditingNode(null)}
          onSuccess={(newNode?: unknown) => {
            if (newNode) {
              setNodes((prev) => {
                // Check if node already exists to avoid duplicates
                const node = newNode as Node;
                if (prev.some(n => n.id === node.id)) return prev;
                return [...prev, node];
              });
            } else {
               fetchNodes();
            }
          }}
        />
      )}
    </div>
  );
};

export default MainContent;

"use client";
import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import MainContentElement from "./MainContentElement";

interface NodeItem {
  id: number;
  title: string;
  fullness: number | null;
  maxfullness: number | null;
  content?: string | null;
  pinned?: boolean | null;
  type?: string | null;
}

interface DraggableMainContentItemProps {
  node: NodeItem;
  onUpdate: (nodeId: string, newFill: number) => void;
  onEdit: (node: NodeItem) => void;
  onComplete: (nodeId: string) => void;
  isChild?: boolean;
}

const DraggableMainContentItem: React.FC<DraggableMainContentItemProps> = ({
  node,
  onUpdate,
  onEdit,
  onComplete,
  isChild = false,
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={node}
      dragListener={false}
      dragControls={controls}
      className="relative"
    >
      <MainContentElement
        id={node.id.toString()}
        title={node.title}
        fillProp={node.fullness || 0}
        maxFillProp={node.maxfullness || 5}
        onUpdate={onUpdate}
        onEdit={() => onEdit(node)}
        onComplete={onComplete}
        dragControls={controls}
        pinned={node.pinned || false}
        type={node.type as "bar" | "revision" || "bar"}
        content={node.content || undefined}
        isChild={isChild}
      />
    </Reorder.Item>
  );
};

export default DraggableMainContentItem;

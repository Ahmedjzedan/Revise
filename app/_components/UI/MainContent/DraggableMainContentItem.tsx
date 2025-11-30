"use client";
import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import MainContentElement from "./MainContentElement";
import { LocalNode } from "@/app/_utils/LocalDataManager";

interface NodeItem {
  id: number;
  title: string;
  fullness: number | null;
  maxfullness: number | null;
  content?: string | null;
}

interface DraggableMainContentItemProps {
  node: NodeItem;
  onUpdate: (nodeId: string, newFill: number) => void;
  onEdit: (node: NodeItem) => void;
}

const DraggableMainContentItem: React.FC<DraggableMainContentItemProps> = ({
  node,
  onUpdate,
  onEdit,
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
        dragControls={controls}
      />
    </Reorder.Item>
  );
};

export default DraggableMainContentItem;

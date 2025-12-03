"use client";
import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import MainContentElement from "./MainContentElement";
import ChildElement from "./ChildElement";

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
  children?: React.ReactNode;
  className?: string;
  fullness?: number;
  maxfullness?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const DraggableMainContentItem: React.FC<DraggableMainContentItemProps> = ({
  node,
  onUpdate,
  onEdit,
  onComplete,
  isChild = false,
  children,
  className = "",
  fullness,
  maxfullness,
  isExpanded,
  onToggleExpand,
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={node}
      dragListener={false}
      dragControls={controls}
      className={`relative ${className}`}
      whileDrag={{ scale: 1.02, zIndex: 50 }}
      dragMomentum={false}
    >
      {isChild ? (
        <ChildElement
          id={node.id.toString()}
          title={node.title}
          fillProp={fullness !== undefined ? fullness : (node.fullness || 0)}
          maxFillProp={maxfullness !== undefined ? maxfullness : (node.maxfullness || 5)}
          onUpdate={onUpdate}
          onEdit={() => onEdit(node)}
          onComplete={onComplete}
          dragControls={controls}
          pinned={node.pinned || false}
          type={node.type as "bar" | "revision" || "bar"}
          content={node.content || undefined}
        />
      ) : (
        <MainContentElement
          id={node.id.toString()}
          title={node.title}
          fillProp={fullness !== undefined ? fullness : (node.fullness || 0)}
          maxFillProp={maxfullness !== undefined ? maxfullness : (node.maxfullness || 5)}
          onUpdate={onUpdate}
          onEdit={() => onEdit(node)}
          onComplete={onComplete}
          dragControls={controls}
          pinned={node.pinned || false}
          type={node.type as "bar" | "revision" || "bar"}
          content={node.content || undefined}
          isChild={isChild}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
        />
      )}
      {children}
    </Reorder.Item>
  );
};

export default DraggableMainContentItem;

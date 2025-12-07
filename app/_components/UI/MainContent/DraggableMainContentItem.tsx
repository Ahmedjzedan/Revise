"use client";
import React from "react";
import { Reorder, useDragControls, motion } from "framer-motion";
import ParentElement from "./ParentElement";
import NormalElement from "./NormalElement";
import NormalTask from "./NormalTask";
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
  hasChildren?: boolean;
  children?: React.ReactNode;
  className?: string;
  fullness?: number;
  maxfullness?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const DraggableMainContentItem: React.FC<DraggableMainContentItemProps> = ({
  node,
  onUpdate,
  onEdit,
  onComplete,
  isChild = false,
  hasChildren = false,
  children,
  className = "",
  fullness,
  maxfullness,
  isExpanded,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
}) => {
  const controls = useDragControls();

  const renderContent = () => {
    if (isChild) {
      return (
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
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      );
    }

    if (hasChildren) {
      return (
        <ParentElement
          id={node.id.toString()}
          title={node.title}
          fillProp={fullness !== undefined ? fullness : (node.fullness || 0)}
          maxFillProp={maxfullness !== undefined ? maxfullness : (node.maxfullness || 5)}
          onEdit={() => onEdit(node)}
          dragControls={controls}
          pinned={node.pinned || false}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          content={node.content || undefined}
        />
      );
    }

    if (node.type === "revision") {
      return (
        <NormalElement
          id={node.id.toString()}
          title={node.title}
          fillProp={fullness !== undefined ? fullness : (node.fullness || 0)}
          maxFillProp={maxfullness !== undefined ? maxfullness : (node.maxfullness || 5)}
          onUpdate={onUpdate}
          onEdit={() => onEdit(node)}
          onComplete={onComplete}
          dragControls={controls}
          pinned={node.pinned || false}
          content={node.content || undefined}
        />
      );
    }

    // Default to NormalTask (type === "bar" or undefined)
    return (
      <NormalTask
        id={node.id.toString()}
        title={node.title}
        onEdit={() => onEdit(node)}
        onComplete={onComplete}
        dragControls={controls}
        pinned={node.pinned || false}
        content={node.content || undefined}
      />
    );
  };

  if (isChild) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`relative ${className}`}
      >
        {renderContent()}
        {children}
      </motion.div>
    );
  }

  return (
    <Reorder.Item
      value={node}
      dragListener={false}
      dragControls={controls}
      className={`relative ${className}`}
      whileDrag={{ scale: 1.02, zIndex: 50 }}
      dragMomentum={false}
    >
      {renderContent()}
      {children}
    </Reorder.Item>
  );
};

export default DraggableMainContentItem;

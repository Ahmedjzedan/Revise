"use client";
import React, { useState, useEffect } from "react";
import { Reorder, useDragControls } from "framer-motion";
import SideBarElement from "./SideBarElement";

interface PageItem {
  id: number;
  title: string;
}

interface DraggableSideBarItemProps {
  page: PageItem;
  isActive: boolean;
  onSelect: (id: number) => void;
  onUpdate: () => void;
  userId?: number | string;
  isLocal?: boolean;
}

const DraggableSideBarItem: React.FC<DraggableSideBarItemProps> = ({
  page,
  isActive,
  onSelect,
  onUpdate,
  userId,
  isLocal,
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={page}
      dragListener={false}
      dragControls={controls}
      className="relative"
    >
      <div onClick={() => onSelect(page.id)}>
        <SideBarElement
          active={isActive}
          pageTitle={page.title}
          pageId={page.id}
          userId={userId || "local"}
          isLocal={isLocal}
          onLocalUpdate={onUpdate}
          dragControls={controls}
        >
          {page.title}
        </SideBarElement>
      </div>
    </Reorder.Item>
  );
};

export default DraggableSideBarItem;

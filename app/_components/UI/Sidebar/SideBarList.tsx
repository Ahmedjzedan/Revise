"use client";
import React, { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import DraggableSideBarItem from "./DraggableSideBarItem";
import AddPageButton from "./AddPageButton";
import { Page } from "@/app/_db/schema";
import { reorderPagesAction } from "@/app/_utils/pageActions";

// Adapt Page type to match LocalPage interface expected by DraggableSideBarItem
// Actually DraggableSideBarItem expects LocalPage which has { id: number, title: string, ... }
// The DB Page type has { id: number, title: string, ... } so it should be compatible if we cast or ensure types match.
// Let's check LocalPage definition in LocalDataManager.ts
// export interface LocalPage { id: number; title: string; position: number; createdAt: number; }
// DB Page: { id: number; title: string; userId: number; position: number | null; ... }
// We need to map DB Page to a compatible type or update DraggableSideBarItem to accept a generic or union.

// Better: Update DraggableSideBarItem to accept a common interface.
// For now, let's cast or map.

interface SideBarListProps {
  initialPages: Page[];
  userId: number;
  currentPageTitle?: string;
}

const SideBarList: React.FC<SideBarListProps> = ({ initialPages, userId, currentPageTitle }) => {
  // Sort by position initially
  const sortedPages = [...initialPages].sort((a, b) => (a.position || 0) - (b.position || 0));
  const [pages, setPages] = useState(sortedPages);

  useEffect(() => {
    setPages([...initialPages].sort((a, b) => (a.position || 0) - (b.position || 0)));
  }, [initialPages]);

  // We need to handle optimistic updates
  const handleReorder = (newOrder: Page[]) => {
    setPages(newOrder);
    // Call server action
    // We need to send the new order (ids and positions)
    const updates = newOrder.map((page, index) => ({
      id: page.id,
      position: index,
    }));
    reorderPagesAction(updates);
  };

  // DraggableSideBarItem expects 'page' prop.
  // We need to make sure DraggableSideBarItem can handle DB Page type.
  // Currently it imports LocalPage.
  // I should update DraggableSideBarItem to use a shared interface or just { id, title }.

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Reorder.Group axis="y" values={pages} onReorder={handleReorder}>
          {pages.map((page) => (
            <DraggableSideBarItem
              key={page.id}
              page={page}
              isActive={currentPageTitle === page.title}
              userId={userId}
              isLocal={false}
              onSelect={() => {}}
              onUpdate={() => {}}
            />
          ))}
        </Reorder.Group>
        <AddPageButton />
      </div>
    </div>
  );
};

export default SideBarList;

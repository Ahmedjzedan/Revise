"use client";
import React, { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import DraggableSideBarItem from "./DraggableSideBarItem";
import AddPageButton from "./AddPageButton";
import { Page } from "@/app/_db/schema";
import { reorderPagesAction } from "@/app/_utils/pageActions";
import UnifiedSideBar from "./UnifiedSideBar";
import { usePathname } from "next/navigation";

interface SideBarListProps {
  initialPages: Page[];
  userId: number;
  footer?: React.ReactNode;
}

const SideBarList: React.FC<SideBarListProps> = ({ initialPages, userId, footer }) => {
  const pathname = usePathname();
  // pathname format: /[user]/[pageTitle]
  // We need to handle URL encoding
  const currentPathTitle = pathname.split("/")[2] ? decodeURIComponent(pathname.split("/")[2]) : undefined;

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

  return (
    <UnifiedSideBar
      footer={footer}
      addButton={<AddPageButton />}
    >
      <Reorder.Group axis="y" values={pages} onReorder={handleReorder}>
          {pages.map((page) => (
            <DraggableSideBarItem
              key={page.id}
              page={page}
              isActive={currentPathTitle === page.title}
              userId={userId}
              isLocal={false}
              onSelect={() => {}}
              onUpdate={() => {}}
            />
          ))}
        </Reorder.Group>
    </UnifiedSideBar>
  );
};

export default SideBarList;

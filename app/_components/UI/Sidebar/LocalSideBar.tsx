"use client";
import React, { useEffect, useState } from "react";
import SideBarElement from "./SideBarElement";
import { LocalDataManager, LocalPage } from "@/app/_utils/LocalDataManager";
import Link from "next/link";
import { Reorder } from "framer-motion";
import DraggableSideBarItem from "./DraggableSideBarItem";

interface LocalSideBarProps {
  currentPageId: number | null;
  onPageSelect: (id: number) => void;
}

const LocalSideBar: React.FC<LocalSideBarProps> = ({ currentPageId, onPageSelect }) => {
  const [pages, setPages] = useState<LocalPage[]>([]);

  const fetchPages = () => {
    const localPages = LocalDataManager.getPages();
    setPages(localPages.sort((a, b) => a.position - b.position));
  };

  useEffect(() => {
    fetchPages();
    window.addEventListener("local-pages-updated", fetchPages);
    return () => window.removeEventListener("local-pages-updated", fetchPages);
  }, []);

  const handleAddPage = () => {
     setIsModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");

  const createPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle) return;
    const newPage = LocalDataManager.addPage(newPageTitle);
    setNewPageTitle("");
    setIsModalOpen(false);
    fetchPages();
    onPageSelect(newPage.id);
  };

  const handleReorder = (newOrder: LocalPage[]) => {
    setPages(newOrder);
    LocalDataManager.reorderPages(newOrder);
  };

  return (
    <>
      <div className="flex h-full flex-col w-full">
        <div className="flex flex-col overflow-y-auto overflow-x-hidden">
          <Reorder.Group axis="y" values={pages} onReorder={handleReorder}>
            {pages.map((page) => (
              <DraggableSideBarItem
                key={page.id}
                page={page}
                isActive={currentPageId === page.id}
                onSelect={onPageSelect}
                onUpdate={fetchPages}
                isLocal={true}
                userId="local"
              />
            ))}
          </Reorder.Group>
          
           <button
            onClick={handleAddPage}
            className="relative flex h-15 cursor-pointer justify-center items-center w-full text-3xl p-3 transition-all duration-500 text-neutral-400 hover:text-white active:bg-neutral-800 bg-[#232323]"
          >
            <span className="relative z-10 transition-colors duration-300 text-4xl hover:text-white">
              +
            </span>
          </button>
        </div>
        
        <div className="flex justify-center align-middle m-5 text-lg shrink-0">
           <Link href="/login" className="text-neutral-500 hover:text-white transition-colors">Sign In / Login</Link>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
           <div className="bg-[#1a1a1a] border border-white/20 p-8 rounded-lg w-96">
              <h3 className="text-xl mb-4 text-white">Create New Page</h3>
              <form onSubmit={createPage}>
                <input 
                  autoFocus
                  type="text" 
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="Page Title"
                  className="w-full bg-[#333] text-white p-2 rounded mb-4 border border-transparent focus:border-white outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-neutral-400 hover:text-white">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-white text-black rounded hover:bg-neutral-200">Create</button>
                </div>
              </form>
           </div>
        </div>
      )}
    </>
  );
};

export default LocalSideBar;

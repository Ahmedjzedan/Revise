"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DragControls } from "framer-motion";
import { useState } from "react";
import EditPageModal from "../modals/EditPageModal";
import LocalEditPageModal from "../modals/LocalEditPageModal";

interface SideBarElementProps {
  active?: boolean;
  children?: React.ReactNode;
  pageTitle?: string;
  pageId: number;
  userId: number | string;
  isLocal?: boolean;
  onLocalUpdate?: () => void;
  onClick?: () => void;
  dragControls?: DragControls;
}

const SideBarElement: React.FC<SideBarElementProps> = ({
  active = false,
  children,
  pageTitle,
  pageId,
  userId,
  isLocal = false,
  onLocalUpdate,
  onClick,
  dragControls,
}) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const useruuid = pathSegments[1];
  const href = isLocal ? "#" : `/${useruuid}/${pageTitle}`;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // handleClick removed as it was unused or handled directly in JSX

  return (
    <div className="group/item relative w-full">
      <Link
        href={href}
        className={`block w-full p-2 pl-8 text-lg transition-colors duration-200 mr-2 ${
          active ? "bg-white text-black font-medium" : "text-neutral-400 hover:text-white"
        }`}
        onClick={onClick}
      >
        {children}
      </Link>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsEditModalOpen(true);
        }}
        className={`absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-20 p-2
          ${active ? "text-black hover:text-neutral-700" : "text-neutral-400 hover:text-white"}
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
      </button>
      
      <div 
        className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-20 p-2 cursor-grab active:cursor-grabbing
          ${active ? "text-black hover:text-neutral-700" : "text-neutral-400 hover:text-white"}
        `}
        onPointerDown={(e) => dragControls?.start(e)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="12" r="1"></circle>
          <circle cx="9" cy="5" r="1"></circle>
          <circle cx="9" cy="19" r="1"></circle>
          <circle cx="15" cy="12" r="1"></circle>
          <circle cx="15" cy="5" r="1"></circle>
          <circle cx="15" cy="19" r="1"></circle>
        </svg>
      </div>

      {isEditModalOpen && (
        isLocal ? (
          <LocalEditPageModal
            pageId={pageId}
            currentTitle={pageTitle || ""}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={onLocalUpdate || (() => {})}
          />
        ) : (
          <EditPageModal
            pageId={pageId}
            currentTitle={pageTitle || ""}
            userId={Number(userId)}
            onClose={() => setIsEditModalOpen(false)}
          />
        )
      )}
    </div>
  );
};

export default SideBarElement;

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname

interface SideBarElementProps {
  active?: boolean;
  addbtn?: boolean;
  children?: React.ReactNode;
  pageTitle?: string;
}

const SideBarElement: React.FC<SideBarElementProps> = ({
  active = false,
  addbtn = false,
  children,
  pageTitle,
}) => {
  const pathname = usePathname(); // e.g., /a1b2c3d4/my-first-page
  const pathSegments = pathname.split("/"); // ["", "a1b2c3d4", "my-first-page"]
  const useruuid = pathSegments[1]; // "a1b2c3d4"

  // Construct the href dynamically.
  // If it's a regular button, link to /[useruuid]/[pageTitle]
  // If it's the add button, you might link to a creation page, e.g., /[useruuid]/add-page
  const href = addbtn ? `/${useruuid}/add-page` : `/${useruuid}/${pageTitle}`;

  return (
    <Link
      href={href}
      className={`flex h-15 cursor-pointer justify-center items-center w-full text-2xl p-3 transition-all duration-500 ${
        addbtn
          ? "text-neutral-400 hover:text-white active:bg-neutral-800 bg-[#232323]"
          : active
            ? "text-black bg-white"
            : "active:bg-neutral-600 text-white hover:text-white hover:bg-neutral-700"
      }`}
    >
      <span
        className={`${
          addbtn ? "text-4xl" : "text-2xl"
        } transition-colors duration-300`}
      >
        {children}
      </span>
    </Link>
  );
};

export default SideBarElement;

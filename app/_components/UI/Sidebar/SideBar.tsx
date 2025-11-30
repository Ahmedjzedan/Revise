import { getPagesForUser } from "@/app/_utils/dbHelpers"; // Adjust path if needed
import { Page } from "@/app/_db/schema";
import Logout from "@/app/_components/UI/Auth/Logout";
import SideBarList from "./SideBarList";

interface SideBarProps {
  userId: string;
  currentPageTitle?: string;
}

const SideBar = async ({ userId, currentPageTitle }: SideBarProps) => {
  const userPages: Page[] = await getPagesForUser(userId);
  return (
    <div className="flex h-full flex-col w-full">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <SideBarList 
          initialPages={userPages} 
          userId={Number(userId)} 
          currentPageTitle={currentPageTitle} 
        />
      </div>

      <div className="flex justify-center align-middle m-5 text-lg shrink-0">
        <Logout />
      </div>
    </div>
  );
};

export default SideBar;

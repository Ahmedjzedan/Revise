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
    <SideBarList 
      initialPages={userPages} 
      userId={Number(userId)} 
      currentPageTitle={currentPageTitle}
      footer={<Logout />}
    />
  );
};

export default SideBar;

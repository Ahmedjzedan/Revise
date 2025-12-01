import { getPagesForUser } from "@/app/_utils/dbHelpers"; // Adjust path if needed
import { Page } from "@/app/_db/schema";
import Logout from "@/app/_components/UI/Auth/Logout";
import SideBarList from "./SideBarList";
import SidebarFooter from "./SidebarFooter";

interface SideBarProps {
  userId: string;
}

const SideBar = async ({ userId }: SideBarProps) => {
  const userPages: Page[] = await getPagesForUser(userId);
  return (
    <SideBarList 
      initialPages={userPages} 
      userId={Number(userId)} 
      footer={<SidebarFooter authButton={<Logout />} />}
    />
  );
};

export default SideBar;

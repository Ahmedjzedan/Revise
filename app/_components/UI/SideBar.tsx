import SideBarElement from "@/app/_components/UI/SideBarElement";
import { getPagesForUser } from "@/app/_utils/dbHelpers"; // Adjust path if needed
import { Page } from "@/app/_db/schema";

interface SideBarProps {
  userId: string;
  currentPageTitle?: string;
}

const SideBar = async ({ userId, currentPageTitle }: SideBarProps) => {
  
  const userPages: Page[] = await getPagesForUser(userId);
  return (
    <div className="overflow-auto h-screen">
      {userPages.map((page) => (
        <SideBarElement
          key={page.id}
          active={currentPageTitle === page.title}
          pageTitle={page.title} // Changed from page.id to page.title
        >
          {page.title}
        </SideBarElement>
      ))}
      <SideBarElement addbtn={true}>+</SideBarElement>
    </div>
  );
};

export default SideBar;

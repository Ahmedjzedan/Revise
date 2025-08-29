import SideBarElement from "@/app/_components/UI/SideBarElement";
import { getPagesForUser } from "@/app/_utils/dbHelpers"; // Adjust path if needed
import { Page } from "@/app/_db/schema";
import Logout from "@/app/_components/UI/Auth/Logout";

interface SideBarProps {
  userId: string;
  currentPageTitle?: string;
}

const SideBar = async ({ userId, currentPageTitle }: SideBarProps) => {
  const userPages: Page[] = await getPagesForUser(userId);
  return (
    <>
      <div className="flex h-screen flex-col">
        {/* 2. Create a new div for the scrolling content that will grow */}
        <div className="">
          {userPages.map((page) => (
            <SideBarElement
              key={page.id}
              active={currentPageTitle === page.title}
              pageTitle={page.title}
            >
              {page.title}
            </SideBarElement>
          ))}
          <SideBarElement addbtn={true}>+</SideBarElement>
        </div>

        {/* 3. This div is now a flex item, naturally at the bottom */}
      </div>
      <div className="grow"></div>

      <div className="flex justify-center align-middle m-5 text-lg">
        <Logout />
      </div>
    </>
  );
};

export default SideBar;

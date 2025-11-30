import SideBar from "@/app/_components/UI/Sidebar/SideBar";
import MainContent from "@/app/_components/UI/MainContent/MainContent";
import MotionBorder from "@/app/_components/UI/Online/MotionBorder";
import MainContentInfo from "@/app/_components/UI/MainContent/MainContentInfo";
import { getUserNameById } from "@/app/_utils/dbAuthHelpers";
import { checkPageExists, getPageId } from "@/app/_utils/dbHelpers";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    user: string;
    pageTitle: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { user, pageTitle } = await params;
  const userName = await getUserNameById(user);
  const isRealPage = await checkPageExists(pageTitle, user);
  
  if (!isRealPage) {
    notFound();
  }

  const pageId = await getPageId(pageTitle, user);

  return (
    <>
      <div className="h-full col-start-1 col-span-1 flex flex-col overflow-hidden">
        <SideBar userId={user} currentPageTitle={pageTitle} />
      </div>

      <MotionBorder />

      <div className="row-start-1 row-span-2 h-full col-start-3 flex flex-col overflow-hidden">
        <MainContentInfo
          pageName={pageTitle}
          userName={userName || undefined}
        ></MainContentInfo>
        {pageId && <MainContent pageId={pageId.toString()} />}
      </div>
    </>
  );
}

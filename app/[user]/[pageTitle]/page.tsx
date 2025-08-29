import SideBar from "@/app/_components/UI/SideBar";
import MainContent from "@/app/_components/UI/MainContent/MainContent";
import MotionBorder from "@/app/_components/UI/Online/MotionBorder";

interface PageProps {
  params: {
    user: string;
    pageTitle: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { user, pageTitle } = await params;
  return (
    <>
      <div className="h-full col-start-1 col-span-1 flex flex-col overflow-hidden">
        <SideBar userId={user} currentPageTitle={pageTitle} />
      </div>

      <MotionBorder />

      <div className="row-start-1 row-span-2 h-full col-start-3">
        <MainContent pageTitle={pageTitle} />
      </div>
    </>
  );
}

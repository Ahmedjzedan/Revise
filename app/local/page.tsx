import SideBar from "@/app/components/UI/SideBar";
import MainContent from "@/app/components/UI/MainContent/MainContent";
import MotionBorder from "../components/UI/Online/MotionBorder";

interface PageProps {
  params: {
    pageId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const awaitedParamas = await params.pageId;
  const pageIdString = awaitedParamas;

  const currentPageId = parseInt(pageIdString, 10);

  if (isNaN(currentPageId)) {
    return <div>Invalid Page ID provided in the URL.</div>;
  }

  return (
    <>
      <div className="h-full col-start-1 col-span-1">
        <SideBar />
      </div>

      <MotionBorder />

      <div className="row-start-1 row-span-2 h-full col-start-3">
        <MainContent pageId={currentPageId} />
      </div>
    </>
  );
}

import MainContent from "@/app/_components/UI/MainContent/MainContent";
import MainContentInfo from "@/app/_components/UI/MainContent/MainContentInfo";
import { getUserNameById } from "@/app/_utils/dbAuthHelpers";
import { getPageId } from "@/app/_utils/dbHelpers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    user: string;
    pageTitle: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { user, pageTitle } = await params;
  const decodedPageTitle = decodeURIComponent(pageTitle);
  
  const [userName, pageId] = await Promise.all([
    getUserNameById(user),
    getPageId(decodedPageTitle, user)
  ]);

  if (!pageId) {
    notFound();
  }

  return (
    <>
      <div className="row-start-1 row-span-1 h-full w-full col-start-1 md:row-start-1 md:row-span-2 md:col-start-3 flex flex-col overflow-hidden">
        <Suspense fallback={<div>Loading info...</div>}>
          <MainContentInfo
            pageName={decodedPageTitle}
            userName={userName || undefined}
          ></MainContentInfo>
        </Suspense>
        <Suspense fallback={<div>Loading content...</div>}>
          {pageId && <MainContent pageId={pageId.toString()} />}
        </Suspense>
      </div>
    </>
  );
}

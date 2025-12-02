import MainContentInfo from "@/app/_components/UI/MainContent/MainContentInfo";
import { getUserNameById } from "@/app/_utils/dbAuthHelpers";
import { notFound } from "next/navigation";
import UserSessionSync from "@/app/_components/Logic/UserSessionSync";

interface PageProps {
  params: Promise<{
    user: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { user } = await params;
  const userName = await getUserNameById(user);
  if (userName === null) {
    notFound();
  }

  return (
    <>
      <div className="row-start-1 row-span-1 h-full w-full col-start-1 md:row-start-1 md:row-span-2 md:col-start-3">
        <MainContentInfo userName={userName || undefined} isInPage={false}></MainContentInfo>
      </div>
      
      {userName && <UserSessionSync userId={user} userName={userName} />}
    </>
  );
}

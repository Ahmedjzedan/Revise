import { validateSession } from "@/app/_utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SideBar from "@/app/_components/UI/Sidebar/SideBar";
import MotionBorder from "@/app/_components/UI/Online/MotionBorder";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ user: string }>;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const user = await validateSession(sessionId);
  if (!user) {
    redirect("/login");
  }

  const { user: userIdParam } = await params;
  if (user.id.toString() !== userIdParam) {
    // Redirect to their own page if they try to access another user's page
    redirect(`/${user.id}`);
  }

  return (
    <>
      <div className="col-start-1 row-start-1 h-full w-full z-40 flex flex-col overflow-hidden pointer-events-none">
        <SideBar userId={userIdParam} />
      </div>
      <MotionBorder />
      {children}
    </>
  );
}

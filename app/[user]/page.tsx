import SideBar from "@/app/_components/UI/SideBar";
import MotionBorder from "@/app/_components/UI/Online/MotionBorder";

interface PageProps {
  params: {
    user: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { user } = await params;
  return (
    <>
      <div className="h-full col-start-1 col-span-1 flex flex-col overflow-hidden">
        <SideBar userId={user} />
      </div>

      <MotionBorder />
    </>
  );
}

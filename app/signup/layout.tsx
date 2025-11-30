import { validateSession } from "@/app/_utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    const user = await validateSession(sessionId);
    if (user) {
      redirect(`/${user.id}`);
    }
  }

  return <>{children}</>;
}

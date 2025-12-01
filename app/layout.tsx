import "./globals.css";

import ClientHeader from "./_components/UI/MainLayout/ClientHeader";
import LayoutContentWrapper from "./_components/UI/MainLayout/LayoutContentWrapper";
import MainAuthButtons from "./_components/UI/Auth/MainAuthButtons";
import ToastProvider from "@/app/_components/Providers/ToastProvider";
import { Inria_Sans } from "next/font/google";

import { cookies } from "next/headers";
import { validateSession } from "@/app/_utils/auth";

const inriaSans = Inria_Sans({
  subsets: ["latin"],
  weight: ["400", "700"], // Light, Regular, Bold
  variable: "--font-inria-sans", // Define the CSS variable
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  let userId: string | null = null;

  if (sessionId) {
    const user = await validateSession(sessionId);
    if (user) {
      userId = user.id.toString();
    }
  }

  return (
    <html lang="en">
      <body className={inriaSans.className}>
        <LayoutContentWrapper>
          <MainAuthButtons />
          <ClientHeader userId={userId} />
          {children}
          <ToastProvider />
        </LayoutContentWrapper>
      </body>
    </html>
  );
}

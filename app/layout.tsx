import "./globals.css";

import ClientHeader from "./_components/UI/MainLayout/ClientHeader";
import LayoutContentWrapper from "./_components/UI/MainLayout/LayoutContentWrapper";
import MainAuthButtons from "./_components/UI/Auth/MainAuthButtons";
import AnimatePresenceProvider from "@/app/_components/Providers/AnimatepresenceProvider";

export default async function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth?: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutContentWrapper>
          <MainAuthButtons />
          <ClientHeader />
          {children}
          <AnimatePresenceProvider>{auth}</AnimatePresenceProvider>
        </LayoutContentWrapper>
      </body>
    </html>
  );
}

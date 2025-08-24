import "./globals.css";

import ClientHeader from "./_components/UI/MainLayout/ClientHeader";
import LayoutContentWrapper from "./_components/UI/MainLayout/LayoutContentWrapper";
import AuthButtons from "./_components/UI/MainLayout/AuthButtons";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutContentWrapper>
          <ClientHeader />
          {/*<AuthButtons />*/}
          {children}
        </LayoutContentWrapper>
      </body>
    </html>
  );
}

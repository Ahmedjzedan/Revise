import "./globals.css";

import ClientHeader from "./_components/UI/MainLayout/ClientHeader";
import LayoutContentWrapper from "./_components/UI/MainLayout/LayoutContentWrapper";
import MainAuthButtons from "./_components/UI/Auth/MainAuthButtons";
import AnimatePresenceProvider from "@/app/_components/Providers/AnimatepresenceProvider";
import ToastProvider from "@/app/_components/Providers/ToastProvider";
import { Inria_Sans } from "next/font/google";

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
  return (
    <html lang="en">
      <body className={inriaSans.className}>
        <LayoutContentWrapper>
          <MainAuthButtons />
          <ClientHeader />
          {children}
          <ToastProvider />
        </LayoutContentWrapper>
      </body>
    </html>
  );
}

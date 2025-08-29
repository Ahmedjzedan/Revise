"use client";
import "./globals.css";
import MainMenuButton from "@/app/_components/UI/MainMenuButton";

export default function Page() {
  const lastUserId = localStorage.getItem("lastUserId");
  return (
    <div className="flex flex-col justify-center items-center gap-y-6">
      <MainMenuButton
        link={lastUserId ? "/" + lastUserId : "/login"}
        buttonTitle="Start online"
      />
      <MainMenuButton link="/local" buttonTitle="Start local" />
      <MainMenuButton link="/options" buttonTitle="Options" />
    </div>
  );
}

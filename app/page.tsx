import "./globals.css";
import MainMenuButton from "@/app/_components/UI/MainMenuButton";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center gap-y-6">
      <MainMenuButton link="/online" buttonTitle="Start online" />
      <MainMenuButton link="/local" buttonTitle="Start local" />
      <MainMenuButton link="/options" buttonTitle="Options" />
    </div>
  );
}

import React from "react";
import Link from "next/link";

interface MainMenuButtonProps {
  buttonTitle: string;
  link: string;
}

const MainMenuButton: React.FC<MainMenuButtonProps> = ({
  buttonTitle,
  link,
}) => {
  return (
    <div className="relative flex flex-col justify-center items-center group">
      <hr
        tabIndex={0}
        className="absolute border-t-4 border-white z-10 invisible group-hover:visible transition-all duration-800 ease-in-out 
                origin-center group-hover:origin-left group-hover:w-screen w-0 group-active:border-[#3D3D3D] group-active:border-t-4 group-active:opacity-100 
                group-active:w-screen overflow-hidden"
      />
      <Link
        href={link}
        className="w-sm text-center text-2xl bg-neutral-300 hover:bg-white hover:shadow-m hover:scale-110
                text-black py-3 px-5 rounded-md shadow-gray-700 transition-all active:bg-neutral-700 duration-300 active:scale-95 ease-in-out z-20
                hover:outline-2 hover:outline-white hover:outline-offset-2 active:outline-2 active:outline-neutral-700 active:outline-offset-2"
      >
        {buttonTitle}
      </Link>
    </div>
  );
};

export default MainMenuButton;

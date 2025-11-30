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
    <Link
      href={link}
      className="group relative px-12 py-4 text-xl font-light tracking-widest transition-all duration-300 overflow-hidden"
    >
      <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500">
        {buttonTitle.toUpperCase()}
      </span>
      <span className="absolute inset-0 z-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center ease-out" />
      <span className="absolute inset-0 border border-white/30 group-hover:border-white/0 transition-colors duration-500" />
    </Link>
  );
};

export default MainMenuButton;

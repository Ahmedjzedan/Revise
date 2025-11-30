import { logout } from "@/app/_utils/authActions";
import React from "react";

const Logout: React.FC = () => {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-neutral-400 hover:text-white transition-colors duration-300"
      >
        Log out
      </button>
    </form>
  );
};

export default Logout;

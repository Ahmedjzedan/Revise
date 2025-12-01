import { logout } from "@/app/_utils/authActions";
import React from "react";

const Logout: React.FC = () => {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300"
      >
        Log out
      </button>
    </form>
  );
};

export default Logout;

"use client";
import { useEffect } from "react";

interface UserSessionSyncProps {
  userId: string;
  userName: string;
}

const UserSessionSync: React.FC<UserSessionSyncProps> = ({ userId, userName }) => {
  useEffect(() => {
    if (userId && userName) {
      localStorage.setItem("lastUserId", userId);
      localStorage.setItem("lastUserName", userName);
    }
  }, [userId, userName]);

  return null;
};

export default UserSessionSync;

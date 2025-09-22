"use client";
import { useRouter } from "next/navigation";
import useAuth from "@/store/auth";

export default function Navbar() {
  const { userType, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-white border-b px-6 py-3 shadow-sm">
      <h1 className="text-lg font-bold text-gray-800">FluencerZ Admin</h1>

      <div className="flex items-center gap-4">
        {userType && (
          <span className="text-sm text-gray-600 capitalize">
            Logged in as: <b>{userType}</b>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

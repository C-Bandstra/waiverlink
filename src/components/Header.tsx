import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSeed } from "../context/SeedContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const seed = useSeed();

  const isOnAdminPage = location.pathname.includes(`admin/${seed.id}`);

  return (
    <header className="w-full p-2 border-b border-gray-200 bg-white flex justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900">waiverlink</h1>
      </div>
      <button
        onClick={() => navigate(`/admin/${seed.id}/dashboard`)}
        className="border-[2px] border-black rounded-sm text-black font-bold p-2 transition-transform duration-300 transform hover:scale-110 will-change-transform"
      >
        {isOnAdminPage ? "manage" : "admin"}
      </button>
    </header>
  );
};

export default Header;

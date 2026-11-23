import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  LogOut,
  Shield,
  Sparkles,
} from "lucide-react";
import api from "../services/api";

export default function Sidebar() {
  const [complaintsCount, setComplaintsCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={19} />,
      path: "/dashboard",
    },
    {
      name: "New Complaint",
      icon: <PlusCircle size={19} />,
      path: "/create-complaint",
    },
    {
      name: "My Complaints",
      icon: <FileText size={19} />,
      path: "/my-complaints",
    },
    {
      name: "Profile",
      icon: <User size={19} />,
      path: "/profile",
    },
  ];

  useEffect(() => {
    const fetchComplaintsCount = async () => {
      try {
        const response = await api.get("/complaints/my");
        setComplaintsCount(response.data.complaints?.length || 0);
      } catch (error) {
        console.error("Error fetching complaints count:", error);
        setComplaintsCount(0);
      }
    };
    fetchComplaintsCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="w-68 min-h-screen bg-white border-r border-slate-200 p-5 flex flex-col sticky top-0 font-sans z-30 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="flex items-center gap-3 pb-6 mb-5 border-b border-slate-100">
        <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
          <Shield size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
            ComplaintHub
          </h2>
          <span className="text-[11px] font-semibold text-blue-600">
            Citizen Portal
          </span>
        </div>
      </div>

      {/* User Info Card */}
      <div className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="overflow-hidden">
          <strong className="block text-xs font-bold text-slate-900 truncate">
            {user?.name || "Citizen User"}
          </strong>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Citizen
          </span>
        </div>
      </div>

      {/* Menu Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`
            }
          >
            <span className="text-blue-600">{item.icon}</span>
            <span>{item.name}</span>
            {item.name === "My Complaints" && complaintsCount > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                {complaintsCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Action */}
      <div className="pt-4 border-t border-slate-100 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

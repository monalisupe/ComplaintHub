import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Shield,
  Settings,
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={19} />,
    },
    {
      label: "All Complaints",
      path: "/all-complaints",
      icon: <FileText size={19} />,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <User size={19} />,
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
          <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Admin User Card */}
      <div className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
          {user?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div className="overflow-hidden">
          <strong className="block text-xs font-bold text-slate-900 truncate">
            {user?.name || "Administrator"}
          </strong>
          <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
            Authority Access
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {menuItems.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path === "/all-complaints" &&
              location.pathname.startsWith("/all-complaints"));

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                active
                  ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <span className="text-blue-600">{item.icon}</span>
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-slate-100 mt-auto flex flex-col gap-1.5">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-left cursor-pointer"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all text-left cursor-pointer"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

import React from "react";
import { Sparkles } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon,
  color = "#2563eb",
  bgColor = "#eff6ff",
}) {
  return (
    <div
      className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer relative overflow-hidden group select-none font-sans"
      style={{
        borderLeft: `4px solid ${color}`,
      }}
    >
      {/* Card Content */}
      <div className="z-10">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          {value}
        </div>
      </div>

      {/* Icon Box */}
      <div
        className="w-13 h-13 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 flex-shrink-0"
        style={{
          backgroundColor: bgColor,
          color: color,
        }}
      >
        {icon}
      </div>
    </div>
  );
}

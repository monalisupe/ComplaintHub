import React from "react";
import { Shield, Lock, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-6 text-slate-500 text-xs font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-800 text-sm">ComplaintHub</span>
            <span className="text-[11px] text-slate-500 ml-1.5">— Official Municipal & Citizen Grievance Portal</span>
          </div>
        </div>

        {/* Center: Badges */}
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-blue-600" /> 256-Bit SSL Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> ISO 27001 Certified
          </span>
        </div>

        {/* Right: Copyright */}
        <div className="text-right text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} ComplaintHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
